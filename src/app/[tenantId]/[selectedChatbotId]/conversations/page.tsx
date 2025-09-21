import React from 'react';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { ModernConversationProvider } from './ModernConversationProvider';
import { getConversationUsers } from '@/app/actions/conversation-actions';
import ConversationLayout from './ConversationLayout';

interface PageProps {
  params: {
    tenantId: string;
    selectedChatbotId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  // Server-side data fetching
  const initialConversations = await getConversationUsers(params.tenantId, params.selectedChatbotId);

  return (
    <ModernConversationProvider 
      initialConversations={initialConversations} 
      tenantId={params.tenantId} 
      chatbotId={params.selectedChatbotId}
    >
      <AdminLayout>
        <ConversationLayout />
      </AdminLayout>
    </ModernConversationProvider>
  );
};

export default Page;
