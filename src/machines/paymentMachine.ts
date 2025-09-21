import { setup, assign } from "xstate";
import { createStripeSessionService } from "./services/services";
import {StripeError} from "@/types/interfaces"


const paymentMachine = setup({
  actors: {
    createStripeSession: createStripeSessionService,
  },
  guards: {
    isTrialSubscription: ({ context }) =>
      context.subscription?.status === "trialing" || false,
    isSubscriptionInvalid: ({ context }) =>
      !context.subscription?.latest_invoice?.payment_intent?.status,
    subscriptionRequiresAction: ({ context }) =>
      context.subscription?.latest_invoice?.payment_intent?.status ===
      "requires_action",
  },
}).createMachine({
  id: "paymentMachine",
  initial: "idle",
  context: {
    priceId: null,
    productId: null,
    chatbotId: null,
    plan: null,
    organizationId: null,
    organizationEmail: null,
    error: null,
    sessionUrl: null,
    recurring: null,
  },
  states: {
    idle: {
      on: {
        START: {
          target: "createStripeSession",
          actions: [
            assign(({ event }) => ({
              priceId: event.type === "START" ? event.priceId : undefined,
              productId: event.type === "START" ? event.productId : undefined,
              recurring: event.type === "START" ? event.recurring : undefined,
              chatbotId: event.type === "START" ? event.chatbotId : undefined,
              plan: event.type === "START" ? event.plan : undefined,
              organizationId: event.type === "START" ? event.organizationId : undefined,
              organizationEmail: event.type === "START" ? event.organizationEmail : undefined,
            })),
          ],
        },
      },
    },
    error: {
      after: {
        2000: {
          target: "idle",
        },
      },
    },
    createStripeSession: {
      invoke: {
        src: createStripeSessionService,
        input: ({ context }: { context: any }) => context,
        onDone: {
          target: "paymentSuccess",
          actions: assign({ sessionUrl: ({ event }) => event.output }),
        },
        onError: {
          target: "error",
          actions: assign({
            error: ({ event }: { event: StripeError }) =>
              event.error.message || "An error occurred",
          }),
        },
      },
    },
    paymentSuccess: {
      type: "final",
    },
  },
});

export default paymentMachine;
