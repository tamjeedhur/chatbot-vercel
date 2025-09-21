import React from 'react';
import { notFound } from 'next/navigation';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { EmbedPageClient } from '@/components/features/EmbedPageClient';
import { getEmbedData } from '@/app/actions/embed-actions';

interface EmbedPageProps {
  params: {
    tenantId: string;
    selectedChatbotId: string;
  };
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { tenantId, selectedChatbotId } = params;

  // Fetch chatbot data server-side
  const embedData = await getEmbedData(tenantId, selectedChatbotId);

  if (!embedData) {
    notFound();
  }

  return (
    <AdminLayout>
      <EmbedPageClient initialData={embedData} />
    </AdminLayout>
  );
}
