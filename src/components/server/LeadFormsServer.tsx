import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import { LeadFormsClient } from '../client/LeadFormsClient';
import { Server_URL } from '@/utils/constants';

interface LeadFormsServerProps {
  params: {
    tenantId: string;
    selectedChatbotId: string;
  };
}

export default async function LeadFormsServer({ params }: LeadFormsServerProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/sign-in');
  }

  const accessToken = (session as any)?.accessToken;
  
  if (!accessToken) {
    redirect('/sign-in');
  }
  let initialForms = [];
  let serverError = null;

  try {
    let response = await fetch(`${Server_URL}/api/v1/ai-support/lead-forms?chatbotId=${params.selectedChatbotId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      next: { revalidate: 300 }
    });

    if (response.ok) {
      const data = await response.json();
      initialForms = data.data || [];
      console.log('initialForms', initialForms);
    }
  } catch (error) {
    console.error('Error fetching lead forms:', error);
    serverError = 'Failed to load lead forms. Please try again.';
  }

  return (
    <LeadFormsClient
      initialForms={initialForms}
      serverUrl={Server_URL}
      accessToken={accessToken}
      tenantId={params.tenantId}
      chatbotId={params.selectedChatbotId}
      serverError={serverError}
    />
  );
}
