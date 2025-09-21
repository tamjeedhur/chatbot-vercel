import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import AppearanceClient from './AppearanceClient';

export default async function AppearancePage({ params }: { params: { tenantId: string; selectedChatbotId: string } }) {
  const session = await getServerSession(authOptions);

  return <AppearanceClient session={session} />;
}
