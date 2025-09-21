import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import SessionWrapper from '@/components/SessionWrapper';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { CustomSession } from '@/types/interfaces';
import { ChatBotMachineProvider } from '@/providers/ChatBotMachineProvider';
import { TenantMachineProvider } from '@/providers/tenantMachineProvider';
import { getChatbotsFromAPI, getTenant } from '@/app/actions/layout-actions';
import { getDefaultChatbot } from '@/utils/chatbot-helpers';

export default async function TenantLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: { tenantId: string }
}) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const userTenantId = session?.user?.tenantId;

  // Fetch chatbots and tenant for Redux hydration
  const [chatbotsResponse, tenantResponse] = await Promise.allSettled([
    getChatbotsFromAPI(params.tenantId), 
    getTenant()
  ]);
  
  // Handle chatbots data
  let chatbots = null;
  if (chatbotsResponse.status === 'fulfilled') {
    chatbots = chatbotsResponse.value;
    if (chatbots?.error) {
      console.error('Chatbots API returned error:', chatbots.error);
    }
  } else {
    console.error('Failed to fetch chatbots:', chatbotsResponse.reason);
  }

  const chatbotList: any[] = Array.isArray(chatbots?.data) ? chatbots.data : [];
  const selectedChatbot = getDefaultChatbot(chatbotList);
  
  let tenant = null;
  if (tenantResponse.status === 'fulfilled') {
    tenant = tenantResponse.value;
    if (tenant?.error) {
      console.error('Tenant API returned error:', tenant.error);
    }
  } else {
    console.error('Failed to fetch tenant:', tenantResponse.reason);
  }

  // Add tenantId to session (keep lightweight for cookie storage)
  const enhancedSession: CustomSession | null = session
    ? {
        ...session,
        tenantId: userTenantId,
        tenant: tenant?.data,
        chatbots: chatbotList,
      }
    : null;

  return (
    <SessionWrapper 
      session={enhancedSession}
      tenant={tenant?.data}
      chatbots={chatbotList}
      selectedChatbot={selectedChatbot || undefined}
    >
      <TenantMachineProvider>
      <ChatBotMachineProvider>
        {children}
        <Toaster richColors position='bottom-right' />
      </ChatBotMachineProvider>
      </TenantMachineProvider>
    </SessionWrapper>
  );
}
