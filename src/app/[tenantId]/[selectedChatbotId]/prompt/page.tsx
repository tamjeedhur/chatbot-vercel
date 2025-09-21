import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import PromptPageClient from './PromptPageClient';

export default async function PromptPage({
  params,
}: {
  params: { tenantId: string; selectedChatbotId: string };
}) {
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
    <PromptPageClient 
      tenantId={params.tenantId}
      selectedChatbotId={params.selectedChatbotId}
      session={session}
    />
  );
}