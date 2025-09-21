import AdminLayout from '@/components/adminlayout/AdminLayout';
import DataSources from './ClientSide';
import { listDocuments } from '@/app/actions/data-source-actions';

export default async function DataSourcesPage({ params }: { params: { tenantId: string; selectedChatbotId: string } }) {
  const initialDocuments = await listDocuments(params.selectedChatbotId);

  return (
    <AdminLayout>
      <DataSources tenantId={params.tenantId} chatbotId={params.selectedChatbotId} documents={initialDocuments} />
    </AdminLayout>
  );
}
