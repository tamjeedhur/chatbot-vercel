'use server';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import ClientSideEdit from './ClientSideEdit';
import { getDataSourceDetails } from '@/app/actions/data-source-actions';

export default async function Page({ params }: { params: { dataSourceId: string } }) {
  const dataSourceId = params.dataSourceId;
  const datasource = await getDataSourceDetails(dataSourceId);
  return (
    <AdminLayout>
      <ClientSideEdit datasource={datasource} />
    </AdminLayout>
  );
}
