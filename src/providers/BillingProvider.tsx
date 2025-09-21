'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { billingMachine } from '@/machines/billingMachine';
import { BillingPlan, PaymentMethod, BillingCharge, Organization } from '@/app/actions/billing-actions';

interface BillingProviderProps {
  children: ReactNode;
  tenantId: string;
  initialData: {
    currentPlan: BillingPlan | null;
    paymentMethods: PaymentMethod[];
    billingHistory: BillingCharge[];
    organization: Organization | null;
  };
}

interface BillingContextType {
  // State
  currentPlan: BillingPlan | null;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingCharge[];
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  isPaymentModalOpen: boolean;
  selectedPaymentMethodId: string | null;

  // Actions
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  addPaymentMethod: (paymentMethodId: string, email: string) => void;
  deletePaymentMethod: (cardId: string) => void;
  selectPaymentMethod: (cardId: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
  refreshData: () => void;
}

const BillingContext = createContext<BillingContextType | null>(null);

export function BillingProvider({ children, tenantId, initialData }: BillingProviderProps) {
  const [state, send] = useMachine(billingMachine, {
    input: {
      tenantId,
      initialData,
    },
  });

  const context: BillingContextType = {
    // State
    currentPlan: state.context.currentPlan,
    paymentMethods: state.context.paymentMethods,
    billingHistory: state.context.billingHistory,
    organization: state.context.organization,
    loading: state.context.loading,
    error: state.context.error,
    successMessage: state.context.successMessage,
    isPaymentModalOpen: state.context.isPaymentModalOpen,
    selectedPaymentMethodId: state.context.selectedPaymentMethodId,

    // Actions
    openPaymentModal: () => send({ type: 'OPEN_PAYMENT_MODAL' }),
    closePaymentModal: () => send({ type: 'CLOSE_PAYMENT_MODAL' }),
    addPaymentMethod: (paymentMethodId: string, email: string) => send({ type: 'ADD_PAYMENT_METHOD', paymentMethodId, email }),
    deletePaymentMethod: (cardId: string) => send({ type: 'DELETE_PAYMENT_METHOD', cardId }),
    selectPaymentMethod: (cardId: string) => send({ type: 'SELECT_PAYMENT_METHOD', cardId }),
    clearError: () => send({ type: 'CLEAR_ERROR' }),
    clearSuccess: () => send({ type: 'CLEAR_SUCCESS' }),
    refreshData: () => send({ type: 'REFRESH_DATA' }),
  };

  return <BillingContext.Provider value={context}>{children}</BillingContext.Provider>;
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
