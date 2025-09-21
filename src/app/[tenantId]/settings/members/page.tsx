import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';
import { Member } from '@/machines/membersMachine';
import MembersPageClient from './MembersPageClient';

async function getMembersData(): Promise<Member[]> {
  const session = await getServerSession(authOptions);
  const accessToken: string = (session as any)?.accessToken || '';

  if (!accessToken) {
    console.warn('No access token available for members fetch');
    return [];
  }

  try {
    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/members`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Members API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

export default async function MembersPage() {
  const members = await getMembersData();

  return <MembersPageClient initialMembers={members} serverUrl={Server_URL} />;
}
