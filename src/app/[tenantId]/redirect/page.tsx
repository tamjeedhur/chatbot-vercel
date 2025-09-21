import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { CustomSession } from '@/types/interfaces';
import { getChatbotsFromAPI } from '@/app/actions/layout-actions';
import { getDefaultChatbot, getChatbotRedirectUrl } from '@/utils/chatbot-helpers';

export default async function RedirectPage({ 
  params,
  searchParams 
}: { 
  params: { tenantId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;

  const userTenantId = session?.user?.tenantId;

  // Verify tenant access
  if (userTenantId !== params.tenantId) {
    redirect(`/${userTenantId}/redirect`);
  }

  // Fetch chatbots
  const chatbotsResponse = await getChatbotsFromAPI(params.tenantId);

  console.log('chatbotsRespons >>>>>>>>', chatbotsResponse);
  const chatbots = chatbotsResponse?.data || [];

  // Find the default chatbot
  const defaultChatbot = getDefaultChatbot(chatbots);

  // Check if user was trying to access a specific page
  const intendedPath = searchParams?.returnTo as string;
  
  // Redirect to appropriate location
  if (intendedPath && defaultChatbot) {
    // If user had an intended destination and we have a chatbot, go there
    redirect(`/${params.tenantId}/${defaultChatbot._id}/${intendedPath}`);
  } else {
    // Use standard redirect logic
    const redirectUrl = getChatbotRedirectUrl(params.tenantId, defaultChatbot);
    redirect(redirectUrl);
  }
}
