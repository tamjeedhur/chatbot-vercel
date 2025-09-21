'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';

// Types for billing data
export interface BillingPlan {
  _id: string;
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  features: {
    maxMembers: number;
    featureLevel: string;
    storageInGB: number;
    support: string;
  };
}

export interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name?: string;
    address?: {
      country?: string;
      line1?: string;
      city?: string;
      postal_code?: string;
    };
  };
}

export interface BillingCharge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  description?: string;
  payment_method_details?: {
    card?: {
      brand: string;
      last4: string;
    };
  };
  receipt_url?: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  organizationRole: string;
  status: string;
}

// Helper function to get authenticated headers
async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    throw new Error('No access token available');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
}

// Get current billing plan
export async function getCurrentPlan(tenantId: string): Promise<BillingPlan | null> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/${tenantId}/current-plan`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Current plan API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching current plan:', error);
    return null;
  }
}

// Get payment methods
export async function getPaymentMethods(tenantId: string): Promise<PaymentMethod[]> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/customers/retrieve-customer/${tenantId}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Payment methods API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();
    return data.cards || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}

// Get billing history
export async function getBillingHistory(tenantId: string): Promise<BillingCharge[]> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/charges/all/${tenantId}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Billing history API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching billing history:', error);
    return [];
  }
}

// Get organization details
export async function getOrganizationDetails(tenantId: string): Promise<Organization | null> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/${tenantId}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Organization details API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching organization details:', error);
    return null;
  }
}

// Get all billing data in one call (for initial page load)
export async function getBillingData(tenantId: string) {
  try {
    const [currentPlan, paymentMethods, billingHistory, organization] = await Promise.all([
      getCurrentPlan(tenantId),
      getPaymentMethods(tenantId),
      getBillingHistory(tenantId),
      getOrganizationDetails(tenantId),
    ]);

    return {
      currentPlan,
      paymentMethods,
      billingHistory,
      organization,
    };
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return {
      currentPlan: null,
      paymentMethods: [],
      billingHistory: [],
      organization: null,
    };
  }
}

// Add payment method
export async function addPaymentMethod(tenantId: string, paymentMethodId: string, email: string) {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/customers/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        paymentMethodId,
        email,
        organizationId: tenantId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add payment method');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
}

// Delete payment method
export async function deletePaymentMethod(cardId: string) {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/payment_methods/${cardId}/detach`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete payment method');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
}
