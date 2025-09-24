'use server'
import { listAllTextContent } from '@/app/actions/data-source-actions';
import TextContentDataSource from './TextClientSide';

export default async function Page({ params }: { params: { tenantId: string; selectedChatbotId: string } }) {
  const textContent = await listAllTextContent(params.selectedChatbotId);
  return <TextContentDataSource allTextContent={textContent} />
}