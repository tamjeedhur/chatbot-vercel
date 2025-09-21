'use server'
import { listAllQuestions } from '@/app/actions/data-source-actions';
import QAPairsDataSource from './QaClient';

export default async function Page({ 
  params 
}: { 
  params: { tenantId: string; selectedChatbotId: string } 
}) {
  const questions = await listAllQuestions(params.selectedChatbotId);
  return <QAPairsDataSource questions={questions} />
}