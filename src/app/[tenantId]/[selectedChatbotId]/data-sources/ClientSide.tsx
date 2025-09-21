import React from 'react';
import { Globe, FileText, HelpCircle, Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import { Document } from '@/machines/dataSources/types';

interface DataSourcesProps {
  tenantId: string;
  chatbotId: string;
  documents: Document[];
}

const DataSources: React.FC<DataSourcesProps> = ({ tenantId, chatbotId, documents }) => {
  // Use documents passed as props instead of XState context
  const initialDocuments = documents;

  const dataSourceTypes = [
    {
      icon: Globe,
      title: 'Sitemap / Website URL',
      description: 'Crawl and index web pages from a sitemap or website',
      path: `/${tenantId}/${chatbotId}/data-sources/urlSitemap`,
      color: 'bg-blue-500',
    },
    {
      icon: Upload,
      title: 'File Upload',
      description: 'Upload documents, PDFs, or other files',
      path: `/${tenantId}/${chatbotId}/data-sources/file`,
      color: 'bg-green-500',
    },
    {
      icon: FileText,
      title: 'Text Content',
      description: 'Add custom text content directly',
      path: `/${tenantId}/${chatbotId}/data-sources/text`,
      color: 'bg-purple-500',
    },
    {
      icon: HelpCircle,
      title: 'Q&A Pairs',
      description: 'Create question and answer pairs',
      path: `/${tenantId}/${chatbotId}/data-sources/qa`,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className='p-4'>
      <div className='max-w-screen-2xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>Data Sources</h1>
          <p className='text-muted-foreground'>Manage your chatbot and data sources</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-foreground'>Data Sources</h3>
              <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>
                <Globe className='w-5 h-5 text-primary' />
              </div>
            </div>
            <div className='text-3xl font-bold text-foreground mb-2'>{initialDocuments?.length || 0}</div>
            <p className='text-sm text-muted-foreground'>{initialDocuments?.length === 0 ? 'No documents added' : 'Documents available'}</p>
          </div>

          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-foreground'>Total Pages</h3>
              <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>
                <FileText className='w-5 h-5 text-green-600' />
              </div>
            </div>
            <div className='text-3xl font-bold text-foreground mb-2'>{initialDocuments?.length || 0}</div>
            <p className='text-sm text-muted-foreground'>Documents indexed</p>
          </div>

          <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-foreground'>Last Updated</h3>
              <div className='w-10 h-10 bg-accent rounded-lg flex items-center justify-center'>
                <HelpCircle className='w-5 h-5 text-purple-600' />
              </div>
            </div>
            <div className='text-lg font-medium text-foreground mb-2'>
              {initialDocuments?.length > 0
                ? new Date(Math.max(...initialDocuments.map((doc: any) => new Date(doc.updatedAt).getTime()))).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                : 'Never'}
            </div>
            <p className='text-sm text-muted-foreground'>{initialDocuments?.length > 0 ? 'Last document updated' : 'No updates yet'}</p>
          </div>
        </div>

        <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {dataSourceTypes.map((source) => (
              <Link
                key={source.path}
                href={source.path}
                className='block p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-accent transition-colors'>
                <div className='flex items-start space-x-3'>
                  <div className={`w-10 h-10 ${source.color} rounded-lg flex items-center justify-center`}>
                    <source.icon className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h3 className='font-medium text-foreground mb-1'>{source.title}</h3>
                    <p className='text-sm text-muted-foreground'>{source.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSources;
