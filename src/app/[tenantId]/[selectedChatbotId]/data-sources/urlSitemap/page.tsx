'use server';
import { getDocumentsByContentType } from '@/app/actions/data-source-actions';
import UrlSitemapServer from './UrlSitemapServer';
export default async function Page({ params }: { params: { tenantId: string; selectedChatbotId: string } }) {
  const dataSourcesDocuments = await getDocumentsByContentType(params.selectedChatbotId, 'url');

  return <UrlSitemapServer tenantId={params.tenantId} chatbotId={params.selectedChatbotId} initialDocuments={dataSourcesDocuments.documents} />;
}
