import React from 'react';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { ChatbotConfigurationPageClient } from './ChatbotConfigurationPageClient';

// Server Component - data is now provided by Redux
async function ChatbotConfigurationPage({ params }: { params: { tenantId: string; selectedChatbotId: string } }) {
  // Server-side data fetching
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <ChatbotConfigurationPageClient 
        selectedChatbotId={params.selectedChatbotId}
        session={session}
      />
    </AdminLayout>
  );
}

export default ChatbotConfigurationPage;
