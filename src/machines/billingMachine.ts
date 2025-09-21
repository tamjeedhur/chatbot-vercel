import { assign, fromPromise, setup } from 'xstate';
import { addPaymentMethod, deletePaymentMethod, BillingPlan, PaymentMethod, BillingCharge, Organization } from '@/app/actions/billing-actions';

// Input types
interface BillingMachineInput {
  tenantId: string;
  initialData: {
    currentPlan: BillingPlan | null;
    paymentMethods: PaymentMethod[];
    billingHistory: BillingCharge[];
    organization: Organization | null;
  };
}

// Context types
interface BillingMachineContext {
  tenantId: string;
  currentPlan: BillingPlan | null;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingCharge[];
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  isPaymentModalOpen: boolean;
  selectedPaymentMethodId: string | null;
}

// Event types
type BillingMachineEvents =
  | { type: 'OPEN_PAYMENT_MODAL' }
  | { type: 'CLOSE_PAYMENT_MODAL' }
  | { type: 'ADD_PAYMENT_METHOD'; paymentMethodId: string; email: string }
  | { type: 'DELETE_PAYMENT_METHOD'; cardId: string }
  | { type: 'SELECT_PAYMENT_METHOD'; cardId: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_SUCCESS' }
  | { type: 'REFRESH_DATA' };

// Guards
const hasPaymentMethodId = ({ event }: { event: any }) => Boolean(event.paymentMethodId);
const hasCardId = ({ event }: { event: any }) => Boolean(event.cardId);

// Machine definition
export const billingMachine = setup({
  types: {
    input: {} as BillingMachineInput,
    context: {} as BillingMachineContext,
    events: {} as BillingMachineEvents,
  },
  actors: {
    addPaymentMethodActor: fromPromise(async ({ input }: { input: { tenantId: string; paymentMethodId: string; email: string } }) => {
      return await addPaymentMethod(input.tenantId, input.paymentMethodId, input.email);
    }),
    deletePaymentMethodActor: fromPromise(async ({ input }: { input: { cardId: string } }) => {
      return await deletePaymentMethod(input.cardId);
    }),
  },
  actions: {
    setLoading: assign({
      loading: true,
      error: null,
    }),
    setError: assign({
      loading: false,
      error: ({ event }: { event: any }) => event.error?.message || 'An error occurred',
    }),
    setSuccess: assign({
      loading: false,
      error: null,
      successMessage: ({ event }: { event: any }) => event.message || 'Operation successful',
    }),
    clearError: assign({
      error: null,
    }),
    clearSuccess: assign({
      successMessage: null,
    }),
    openPaymentModal: assign({
      isPaymentModalOpen: true,
    }),
    closePaymentModal: assign({
      isPaymentModalOpen: false,
    }),
    selectPaymentMethod: assign({
      selectedPaymentMethodId: ({ event }: { event: any }) => event.cardId,
    }),
    updatePaymentMethods: assign({
      paymentMethods: ({ event }: { event: any }) => event.output?.cards || [],
    }),
    removePaymentMethod: assign({
      paymentMethods: ({ context, event }: { context: BillingMachineContext; event: any }) =>
        context.paymentMethods.filter((pm) => pm.id !== event.cardId),
    }),
  },
  guards: {
    hasPaymentMethodId,
    hasCardId,
  },
}).createMachine({
  id: 'billing',
  initial: 'idle',
  context: ({ input }) => ({
    tenantId: input.tenantId,
    currentPlan: input.initialData.currentPlan,
    paymentMethods: input.initialData.paymentMethods,
    billingHistory: input.initialData.billingHistory,
    organization: input.initialData.organization,
    loading: false,
    error: null,
    successMessage: null,
    isPaymentModalOpen: false,
    selectedPaymentMethodId: null,
  }),
  states: {
    idle: {
      on: {
        OPEN_PAYMENT_MODAL: {
          actions: 'openPaymentModal',
        },
        CLOSE_PAYMENT_MODAL: {
          actions: 'closePaymentModal',
        },
        ADD_PAYMENT_METHOD: {
          guard: 'hasPaymentMethodId',
          target: 'addingPaymentMethod',
        },
        DELETE_PAYMENT_METHOD: {
          guard: 'hasCardId',
          target: 'deletingPaymentMethod',
        },
        SELECT_PAYMENT_METHOD: {
          actions: 'selectPaymentMethod',
        },
        CLEAR_ERROR: {
          actions: 'clearError',
        },
        CLEAR_SUCCESS: {
          actions: 'clearSuccess',
        },
        REFRESH_DATA: {
          target: 'refreshing',
        },
      },
    },
    addingPaymentMethod: {
      entry: 'setLoading',
      invoke: {
        src: 'addPaymentMethodActor',
        input: ({ context, event }: { context: BillingMachineContext; event: any }) => ({
          tenantId: context.tenantId,
          paymentMethodId: event.paymentMethodId,
          email: event.email,
        }),
        onDone: {
          target: 'idle',
          actions: ['setSuccess', 'updatePaymentMethods', 'closePaymentModal'],
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    deletingPaymentMethod: {
      entry: 'setLoading',
      invoke: {
        src: 'deletePaymentMethodActor',
        input: ({ event }: { event: any }) => ({
          cardId: event.cardId,
        }),
        onDone: {
          target: 'idle',
          actions: ['setSuccess', 'removePaymentMethod'],
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
    },
    refreshing: {
      entry: 'setLoading',
      // In a real implementation, you would invoke a data fetching actor here
      // For now, we'll just simulate the refresh
      after: {
        1000: {
          target: 'idle',
          actions: [
            'setSuccess',
            assign({
              successMessage: 'Data refreshed successfully',
            }),
          ],
        },
      },
    },
  },
});

export default billingMachine;
