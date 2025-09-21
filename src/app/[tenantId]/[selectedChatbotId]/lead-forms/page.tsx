import LeadFormsServer from '@/components/server/LeadFormsServer';

interface LeadFormsPageProps {
  params: {
    tenantId: string;
    selectedChatbotId: string;
  };
}

export default function LeadFormsPage({ params }: LeadFormsPageProps) {
  return <LeadFormsServer params={params} />;
}