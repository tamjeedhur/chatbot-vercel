'use server'
import DashboardClient from './DashboardClient'
import { totalDocumentsCount , totalConversationsCount } from '@/app/actions/dashboard-actions'
export default async function Dashboard({params}: {params: {tenantId: string, selectedChatbotId: string}}) {
const totalDocuments = await totalDocumentsCount(params.selectedChatbotId)
const totalConversations = await totalConversationsCount(params.selectedChatbotId)
  return (
   <DashboardClient totalDocuments={totalDocuments} totalConversations={totalConversations} />
  )
}