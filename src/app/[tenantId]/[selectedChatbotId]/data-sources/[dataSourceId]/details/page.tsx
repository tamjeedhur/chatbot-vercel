'use server';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import ClientSideDetails from './CliendSideDetails';
import { getDataSourceDetails } from '@/app/actions/data-source-actions';

export default async function Page({ params }: { params: { dataSourceId: string } }) {
  const dataSourceId = params.dataSourceId;
  console.log(dataSourceId, 'this is dataSourceId from the page');
  const datasource = await getDataSourceDetails(dataSourceId);
  return <ClientSideDetails datasource={datasource} />;
}
