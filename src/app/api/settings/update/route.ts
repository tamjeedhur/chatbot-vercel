import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Server_URL, API_VERSION } from '@/utils/constants';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const accessToken: string = (session as any)?.accessToken || '';

    if (!accessToken) {
      return NextResponse.json(
        { message: 'No access token available' },
        { status: 401 }
      );
    }

    const updates = await request.json();

    const response = await fetch(`${Server_URL}/api/${API_VERSION}/tenants/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify(updates),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to update settings' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
