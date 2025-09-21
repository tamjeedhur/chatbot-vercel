import { assign, fromPromise, setup } from 'xstate';
import axiosInstance from '@/lib/axiosInstance';
import { PaymentCaptureMachineContext } from '@/types/interfaces';

const paymentCaptureMachine = setup({
  types: {
    input: {} as { email?: string; organizationId?: string },
    context: {} as PaymentCaptureMachineContext,
  },
  actors: {
    fetchData: fromPromise(async ({ input }: { input: { organizationId?: string } }) => {
      const organizationId = input.organizationId;
      const [cardsResponse, pricesResponse, nonRecurringPricesResponse, transactionsResponse] = await Promise.all([
        axiosInstance.get(`/api/customers/retrieve-customer/${organizationId}`),
        axiosInstance.get('/api/products/get-recurring-prices'),
        axiosInstance.get('/api/products/get-non-recurring-prices'),
        axiosInstance.get(`/api/charges/all/${organizationId}`),
      ]);

      return {
        cards: cardsResponse.data.cards,
        prices: pricesResponse.data,
        nonRecurringPrices: nonRecurringPricesResponse.data,
        charges: transactionsResponse.data.data,
      };
    }),
    addCard: fromPromise(async ({ input }: { input: { paymentMethodId: string; email: string; organizationId: string } }) => {
      const response = await axiosInstance.post('/api/customers/create', {
        paymentMethodId: input.paymentMethodId,
        email: input.email,
        organizationId: input.organizationId,
      });
      return response.data;
    }),
    deleteCard: fromPromise(async ({ input }: { input: { cardId: string } }) => {
      await axiosInstance.post(`/api/payment_methods/${input.cardId}/detach`);
    }),
    createPaymentIntent: fromPromise(async ({ input }: { input: any }) => {
      const endpoint = input.isRecurring ? '/api/subscriptions/create-payment-intent' : '/api/subscriptions/create-one-time-payment-intent';
      const response = await axiosInstance.post(endpoint, input);
      return {
        paymentIntentId: response.data.paymentIntentId,
        subscriptionId: response.data.subscriptionId || null,
      };
    }),
    capturePayment: fromPromise(async ({ input }: { input: any }) => {
      const endpoint = input.isRecurring ? '/api/payment/capture' : '/api/payment/confirm-payment';
      await axiosInstance.post(endpoint, input);
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcCGBPAtmAdgFwGFVk8BXAJzADoBLCAGzAGIIB7HamnAN1YGtqaLLkLEylWgzAIuvAMao8NdgG0ADAF11GxClawaS9rpAAPRAEY1AdgtUArADYATPefWALAGY1F714AaEHRERw8ADgcPey9nNQBOR3jwiy9rAF90oKFsfCISCk4pJjByclZyKmR6RQAzCswqjFzRAok6RhkeVgUjHG1tE2R9Q2UcE3MEK1sqZI8PNWd5rzT7IJCEey2qD0dbeK8PZ0dw6MdM7OaRfPEixiYAQQARJ4B9AgeAJSfBpBBhgx9CaIcIxKhqXbhZJLVxqQ7rRAxNQ7aKxGxqDHWZIXf5XPJiQqSe5PACiABkSQAVEnvL4-TRDEZAv6TCyuDzglwxZxpDFeeIIhCnLyzNn2VJchIRHE5a4E9rFAifEkPamvAAKDwAmgBZEkAOUprwAkoaDZTfnpAWNgQhrIcqBZwtZxfFxdEIh5BSkHBiMWyvOEofMMllccJ8W07swAMpU14knUPY1ky3-Jk2lmWNThEXzGILHzOU45wXReJUQPxNSOezWKH1o4eGV41q3Imx8kkghGj7fNMA0bGLNTGx2MI1tzeVwHayCryOEVeKwHFJuazOYstiNtwkdTsUnsah4EADSDwA4iSBxnh6BWWo61RN7Xg+FH4-BcdrM-YilHxYTiOH424tDchKoBAEBcFARDkBALDsJw3QCE0O7gRIkHQTgsGoPBXTyIoYwDAyfyDsy96IPaHJOi6Fhun49ievO8zPlCk7AR4fhePYoFylGVBYTBcEIaU5SVNUdQNGhYHytQQk4SJBE9ERqiaDe1p3mYVEOrRrrukxpxlmklZ7PRy51hYVl7HxkbthAYCMEoil4QhbAcLQKGCK2GHUA5TnCa5ym9MR6mkVaQ7jCOYocjWrixLycICsEVH2MiubeOEjg5s4bI2WGsp2YS-lgM5uHwSUZQVFUNR4PU5CNIVu4SCVZVKbIKl9CROhkbeUWUVM7KzHF4Q8okaXFoKtY-i6XKgvygFZbZzXUHIlBETh6qtsa+AiIhHkdahTW+VQa1gBtUBbTuO14CIwWqf0YU9RFFHaQgPgcm6y6xLssTARYZZurMaXrlC8Q8hivEFT5cmnetZVXS0N17WJ1WSXV0nHbDZ0XYjIjI-g91dU9jKaf1b0fcD31LIuxxWV+izPml-qnMc9jxLsy0nXI7C1DQDUwXj+BMAQADy+oAGLGp8OrHrq5oaZFtqxD+xZiiki5OPE1iOIK9hQuCxa1kxRz0aNXPY7z-OYILrYiw8+oEOSct6oaiuvZM1GOs6+mMcxKWbO+syorl1Y6wk8QWwJChtLbO77chvBHTD0fynHLRE6FWjhemZPKxCVOpDTf30wHJzIgsXIHN4xvhFH7Yx+I6co1VEm1fVjUpw3aeba2mdqdnz250rI6U19Re-XTAMB9Y9o7MKWVBo4LjNjiOCsA58BkV3hSkyPA0ALS6wHR-gn658XyB0PobD+57x72ZPnWa70fEgEWYKniOFQLiHBE4ruBSJHa+skBIKXKhAe+mYBpMXsOCWcYQFyNh4sZSIgEuRbGdDrJI9diqOVKoFeCUCtKsnmMic+aQrBcUfOEb0GIqD1jopuCwOsLC1lwRIHGCNtq7XwMQ8mkwjiCjNuCfkNYjj2mXB4UMlwb7RytgLXuO5+G2hiBWWc7oITg2SHOAO+s7D5liPRGw2V4jANkaA7usclEtBUSOE4VBQQaNZkcLKawy460dF9XKs9vBWQsJkTIQA */
  id: 'paymentCapture',
  initial: 'idle',
  context: ({ input }) =>
    ({
      cards: [],
      products: [],
      prices: [],
      nonRecurringPrices: [],
      selectedCardId: null,
      selectedPackage: null,
      email: input?.email || '',
      organizationId: input?.organizationId || '',
      paymentIntentId: null,
      error: null,
      toastMessage: null,
      charges: [],
      subscriptionId: null,
      isRecurring: false,
    } as PaymentCaptureMachineContext),
  states: {
    idle: {
      invoke: {
        src: 'fetchData',
        input: ({ context }) => ({ organizationId: context.organizationId }),
        onDone: {
          target: 'idle',
          actions: assign(({ event }) => ({
            cards: event.output.cards,
            prices: event.output.prices,
            nonRecurringPrices: event.output.nonRecurringPrices,
            charges: event.output.charges,
          })),
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: ({ event }: { event: any }) => event.error?.response?.data?.error,
          }),
        },
      },
      on: {
        ADD_CARD: 'addingCard',
        DELETE_CARD: 'deletingCard',
        CREATE_PAYMENT_INTENT: 'creatingPaymentIntent',
        SET_EMAIL: {
          actions: assign({
            email: ({ event }) => event.email,
          }),
        },
        SELECT_CARD: {
          actions: assign({
            selectedCardId: ({ event }) => event.cardId,
            toastMessage: () => 'Card selected successfully!',
            error: null,
          }),
        },
        SELECT_PACKAGE: {
          actions: assign({
            selectedPackage: ({ event }) => event.packageId,
            toastMessage: () => 'Package selected successfully!',
            isRecurring: ({ event }) => event.isRecurring,
          }),
        },
      },
    },
    addingCard: {
      invoke: {
        src: 'addCard',
        input: ({ context, event }) => ({
          paymentMethodId: event.paymentMethodId,
          email: context.email || '',
          organizationId: context.organizationId || '',
        }),
        onDone: {
          target: 'idle',
          actions: assign({
            cards: ({ event }) => {
              console.log('Add card response event:', event);
              console.log('Cards from response:', event.output.cards);
              return event.output.cards || [];
            },
            toastMessage: () => 'Card added successfully!',
            error: null,
          }),
        },
        onError: {
          target: 'idle',
          actions: [
            assign({
              error: ({ event }: { event: any }) => event.error?.response?.data?.error,
              toastMessage: ({ event }: { event: any }) => event.error?.response?.data?.error || 'Failed to add card',
            }),
          ],
        },
      },
    },
    deletingCard: {
      invoke: {
        src: 'deleteCard',
        input: ({ event }) => ({ cardId: event.cardId }),
        onDone: {
          target: 'idle',
          actions: assign({
            toastMessage: () => 'Card deleted successfully!',
            error: null,
            selectedCardId: null,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            toastMessage: ({ event }: { event: any }) => event.error?.response?.data?.error || 'Failed to delete card',
            error: ({ event }) => event.error?.response?.data?.error,
          }),
        },
      },
    },
    creatingPaymentIntent: {
      invoke: {
        src: 'createPaymentIntent',
        input: ({ context }: { context: any }) => ({
          priceId: context.selectedPackage,
          productId: context.isRecurring
            ? context.prices.find((p: any) => p.id === context.selectedPackage)?.productId
            : context.nonRecurringPrices.find((p: any) => p.id === context.selectedPackage)?.productId,
          email: context.email,
          paymentMethodId: context.selectedCardId,
          isRecurring: context.isRecurring,
        }),
        onDone: {
          target: 'confirmingPayment',
          actions: assign({
            paymentIntentId: ({ event }) => event.output.paymentIntentId,
            subscriptionId: ({ event }) => event.output.subscriptionId,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            toastMessage: ({ event }: { event: any }) => event.error?.response?.data?.error || 'Failed to create payment intent',
            error: ({ event }: { event: any }) => event.error?.response?.data?.error,
          }),
        },
      },
    },
    confirmingPayment: {
      on: {
        CONFIRM_PAYMENT: 'capturingPayment',
        CANCEL_PAYMENT: 'idle',
      },
    },
    capturingPayment: {
      invoke: {
        src: 'capturePayment',
        input: ({ context }: { context: any }) => ({
          paymentIntentId: context.paymentIntentId,
          subscriptionId: context.subscriptionId,
          priceId: context.selectedPackage,
          productId: context.isRecurring
            ? context.prices.find((p: any) => p.id === context.selectedPackage)?.productId
            : context.nonRecurringPrices.find((p: any) => p.id === context.selectedPackage)?.productId,
          isRecurring: context.isRecurring,
        }),
        onDone: {
          target: 'idle',
          actions: assign({
            toastMessage: () => 'Payment completed successfully!',
            error: null,
            paymentIntentId: null,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            toastMessage: ({ event }: { event: any }) => event.error?.response?.data?.error || 'Failed to confirm payment',
            error: ({ event }: { event: any }) => event.error?.response?.data?.error,
          }),
        },
      },
    },
  },
});

export default paymentCaptureMachine;
