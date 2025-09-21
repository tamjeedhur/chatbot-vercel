import { fromPromise } from 'xstate';
import axiosInstance from '@/lib/axiosInstance';

export const createStripeSessionService = fromPromise(async ({ input }: { input: any }) => {
  const sessionType = input.recurring ? 'create-subscription-session' : 'create-one-time-session';

  const response = await axiosInstance.post(`/api/subscriptions/${sessionType}`, {
    priceId: input.priceId,
    productId: input.productId,
    chatbotId: input.chatbotId,
    plan: input.plan,
    organizationId: input.organizationId,
    organizationEmail: input.organizationEmail,
  });

  return response.data.url;
});

// registerUser service moved into the sign-up form machine via setup().
