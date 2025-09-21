'use client';
import React, { useState } from 'react';
import { ArrowLeft, Database, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { DataSourcePayload } from '@/machines/dataSources/types';
import { useRouter } from 'next/navigation';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { useDataSources } from '../../providers/DataSourcesProvider';
import { useMachine } from '@xstate/react';
import { dataSourcesMachine } from '@/machines/dataSources/dataSourcesMachine';
import { useSelector } from 'react-redux';
import { selectDataSources } from '@/redux/slices/dataSourcesSlice';

const ClientSideEdit = ({ datasource }: { datasource: any }) => {
  const datasourcesFromRedux = useSelector(selectDataSources);
  const [chatbotState] = useChatBotMachineState();
  const [state, send] = useMachine(dataSourcesMachine, {
    input: {
      initialDocuments: [],
      tenantId: chatbotState.context.tenantId,
      chatbotId: chatbotState.context.selectedChatbot?._id || '',
    },
  });
  const router = useRouter();

  const [formData, setFormData] = useState<DataSourcePayload>({
    name: datasource.name || '',
    description: datasource.description || '',
    type: datasource.type || 'url',
    vectorStore: datasource.config?.vectorStore || 'mongodb_atlas',
    settings: {
      chunkSize: datasource.config?.settings?.chunkSize || 500,
      chunkOverlap: datasource.config?.settings?.chunkOverlap || 50,
    },
    credentials: {
      type: datasource.config?.credentials?.type || 'none',
      credentials: datasource.config?.credentials?.credentials || {},
      encrypted: datasource.config?.credentials?.encrypted || false,
    },
    syncSchedule: {
      enabled: datasource.config?.syncSchedule?.enabled || true,
      frequency: datasource.config?.syncSchedule?.frequency || 'daily',
    },
    namespace: datasource.config?.namespace || '',
  });

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showVectorStoreDropdown, setShowVectorStoreDropdown] = useState(false);
  const [showCredentialsDropdown, setShowCredentialsDropdown] = useState(false);
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);

  const dataSourceTypes = ['url', 'file', 'database', 'api'];
  const vectorStores = ['mongodb_atlas', 'pinecone', 'weaviate', 'chroma'];
  const credentialTypes = ['none', 'basic', 'oauth', 'api_key'];
  const frequencies = ['hourly', 'daily', 'weekly', 'monthly'];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof DataSourcePayload] as any),
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send({ type: 'UPDATE_DATA_SOURCE', data: { dataSourceId: datasource.id, data: formData } });
  };

  if (state.matches('success')) {
    router.push(`/${chatbotState.context.tenantId}/${chatbotState.context.selectedChatbot?._id}/data-sources`);
  }

  return (
    <div className='p-4'>
      {/* Header */}
      <div className='flex items-center mb-6'>
        <Link href={`/${chatbotState.context.tenantId}/${chatbotState.context.selectedChatbot?._id}/data-sources`} className='mr-4'>
          <ArrowLeft className='w-5 h-5 text-muted-foreground hover:text-foreground' />
        </Link>
        <div className='flex items-center space-x-2'>
          <Database className='w-5 h-5 text-blue-600' />
          <h1 className='text-2xl font-bold text-foreground'>Edit Data Source</h1>
        </div>
      </div>

      <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-foreground'>Basic Information</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>Name *</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='Enter data source name'
                  className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>Namespace *</label>
                <input
                  type='text'
                  value={formData.namespace}
                  onChange={(e) => handleInputChange('namespace', e.target.value)}
                  placeholder='Enter namespace'
                  className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder='Enter data source description'
                rows={3}
                className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='relative'>
                <label className='block text-sm font-medium text-foreground mb-2'>Type</label>
                <button
                  type='button'
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className='flex items-center justify-between w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-left min-h-[42px]'>
                  <span className='text-sm text-foreground'>{formData.type}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTypeDropdown && (
                  <div className='absolute right-0 mt-1 w-full bg-popover rounded-lg shadow-lg border border-border z-10'>
                    <div className='py-1'>
                      {dataSourceTypes.map((type) => (
                        <button
                          key={type}
                          type='button'
                          onClick={() => {
                            handleInputChange('type', type);
                            setShowTypeDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                            formData.type === type ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                          }`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='relative'>
                <label className='block text-sm font-medium text-foreground mb-2'>Vector Store</label>
                <button
                  type='button'
                  onClick={() => setShowVectorStoreDropdown(!showVectorStoreDropdown)}
                  className='flex items-center justify-between w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-left min-h-[42px]'>
                  <span className='text-sm text-foreground'>{formData.vectorStore}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showVectorStoreDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showVectorStoreDropdown && (
                  <div className='absolute right-0 mt-1 w-full bg-popover rounded-lg shadow-lg border border-border z-10'>
                    <div className='py-1'>
                      {vectorStores.map((store) => (
                        <button
                          key={store}
                          type='button'
                          onClick={() => {
                            handleInputChange('vectorStore', store);
                            setShowVectorStoreDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                            formData.vectorStore === store ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                          }`}>
                          {store}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-foreground'>Processing Settings</h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>Chunk Size</label>
                <input
                  type='number'
                  value={formData.settings.chunkSize}
                  onChange={(e) => handleNestedInputChange('settings', 'chunkSize', parseInt(e.target.value))}
                  className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>Chunk Overlap</label>
                <input
                  type='number'
                  value={formData.settings.chunkOverlap}
                  onChange={(e) => handleNestedInputChange('settings', 'chunkOverlap', parseInt(e.target.value))}
                  className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
                />
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-foreground'>Credentials</h3>

            <div className='relative'>
              <label className='block text-sm font-medium text-foreground mb-2'>Credential Type</label>
              <button
                type='button'
                onClick={() => setShowCredentialsDropdown(!showCredentialsDropdown)}
                className='flex items-center justify-between w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-left min-h-[42px]'>
                <span className='text-sm text-foreground'>{formData.credentials.type}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showCredentialsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCredentialsDropdown && (
                <div className='absolute right-0 mt-1 w-full bg-popover rounded-lg shadow-lg border border-border z-10'>
                  <div className='py-1'>
                    {credentialTypes.map((type) => (
                      <button
                        key={type}
                        type='button'
                        onClick={() => {
                          handleNestedInputChange('credentials', 'type', type);
                          setShowCredentialsDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                          formData.credentials.type === type ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                        }`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='encrypted'
                checked={formData.credentials.encrypted}
                onChange={(e) => handleNestedInputChange('credentials', 'encrypted', e.target.checked)}
                className='rounded border-input'
              />
              <label htmlFor='encrypted' className='text-sm text-foreground'>
                Encrypt credentials
              </label>
            </div>
          </div>

          {/* Sync Schedule */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-foreground'>Sync Schedule</h3>

            <div className='flex items-center space-x-2 mb-4'>
              <input
                type='checkbox'
                id='syncEnabled'
                checked={formData.syncSchedule.enabled}
                onChange={(e) => handleNestedInputChange('syncSchedule', 'enabled', e.target.checked)}
                className='rounded border-input'
              />
              <label htmlFor='syncEnabled' className='text-sm text-foreground'>
                Enable automatic sync
              </label>
            </div>

            {formData.syncSchedule.enabled && (
              <div className='relative'>
                <label className='block text-sm font-medium text-foreground mb-2'>Sync Frequency</label>
                <button
                  type='button'
                  onClick={() => setShowFrequencyDropdown(!showFrequencyDropdown)}
                  className='flex items-center justify-between w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-left min-h-[42px]'>
                  <span className='text-sm text-foreground'>{formData.syncSchedule.frequency}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFrequencyDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showFrequencyDropdown && (
                  <div className='absolute right-0 mt-1 w-full bg-popover rounded-lg shadow-lg border border-border z-10'>
                    <div className='py-1'>
                      {frequencies.map((frequency) => (
                        <button
                          key={frequency}
                          type='button'
                          onClick={() => {
                            handleNestedInputChange('syncSchedule', 'frequency', frequency);
                            setShowFrequencyDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                            formData.syncSchedule.frequency === frequency ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                          }`}>
                          {frequency}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-3 pt-6 border-t border-border'>
            <Link
              href={`/${chatbotState.context.tenantId}/${chatbotState.context.selectedChatbot?._id}/data-sources`}
              className='px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors'>
              Cancel
            </Link>
            <button
              type='submit'
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
              {state.matches('updatingDataSource') ? 'Updating...' : 'Update Data Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientSideEdit;
