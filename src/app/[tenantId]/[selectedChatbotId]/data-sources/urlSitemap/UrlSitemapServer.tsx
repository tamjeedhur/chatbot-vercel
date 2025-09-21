import React from 'react';
import { ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { UrlSitemapProvider } from './providers/UrlSitemapProvider';
import UrlSitemapClient from './UrlSitemapClient';
import { DataSourceDocument } from '@/redux/slices/scrapSlice';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

interface UrlSitemapServerProps {
  tenantId: string;
  chatbotId: string;
  initialDocuments: DataSourceDocument[];
}

export default async function UrlSitemapServer({ tenantId, chatbotId, initialDocuments }: UrlSitemapServerProps) {
  const session = await getServerSession(authOptions);

  return (
    <AdminLayout>
      <div className='p-4'>
        {/* Header - Server Component */}
        <div className='flex items-center mb-6'>
          <Link href={`/${tenantId}/${chatbotId}/data-sources`} className='mr-4'>
            <ArrowLeft className='w-5 h-5 text-muted-foreground hover:text-foreground' />
          </Link>
          <div className='flex items-center space-x-2'>
            <Globe className='w-5 h-5 text-blue-600' />
            <h1 className='text-2xl font-bold text-foreground'>Sitemap / Website URL</h1>
          </div>
        </div>

        {/* Client Component with Provider */}
        <UrlSitemapProvider tenantId={tenantId} chatbotId={chatbotId} initialDocuments={initialDocuments} session={session}>
          <UrlSitemapClient />
        </UrlSitemapProvider>
      </div>
    </AdminLayout>
  );
}
