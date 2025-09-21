'use client';

import React from 'react';
import { useMachine } from '@xstate/react';
import { CheckCircle, Copy } from 'lucide-react';
import { embedPageMachine } from '@/machines/embedPageMachine';
import { EmbedData } from '@/app/actions/embed-actions';
import { CodeBlock } from '@/components/ui/code-block';
import { TabSwitcher } from '@/components/ui/tab-switcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmbedPageClientProps {
  initialData: EmbedData;
}

export const EmbedPageClient: React.FC<EmbedPageClientProps> = ({ initialData }) => {
  const [state, send] = useMachine(embedPageMachine);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'script' || tabId === 'iframe') {
      send({ type: 'SWITCH_TAB', tab: tabId });
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        send({ type: 'COPY_CODE', code, id });
      })
      .catch((err) => {
        console.error('Failed to copy code:', err);
      });
  };

  const embedData = initialData;

  const scriptExample = embedData.embedCode;

  const iframeExample = embedData.iframeEmbedCode;

  const tabs = [
    { id: 'script', label: 'JavaScript Embedding' },
    { id: 'iframe', label: 'Iframe Embedding' },
  ];

  return (
    <div className='min-h-[calc(100vh-100px)] bg-background p-6'>
      <main>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>Embed {embedData.chatbotName}</h1>
          <p className='text-muted-foreground'>
            Choose your preferred embedding method and copy the code to integrate the chatbot into your website.
          </p>
        </div>

        {/* Code Examples */}
        <section className='mb-12'>
          <Card>
            <CardHeader>
              <CardTitle className='text-2xl text-center'>Implementation Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <TabSwitcher tabs={tabs} activeTab={state.context.activeTab} onTabChange={handleTabChange} />

              <div className='transition-all duration-300'>
                {state.context.activeTab === 'script' ? (
                  <CodeBlock
                    code={scriptExample}
                    language='HTML/JavaScript'
                    id='script-example'
                    onCopy={handleCopyCode}
                    copiedId={state.context.copiedCode}
                  />
                ) : (
                  <CodeBlock code={iframeExample} language='HTML' id='iframe-example' onCopy={handleCopyCode} copiedId={state.context.copiedCode} />
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Widget Information */}
        <section className='mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Widget Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>Widget Key</label>
                  <div className='flex items-center gap-2 mt-1'>
                    <div className='font-mono text-xs bg-muted p-2 rounded flex-1 break-all overflow-hidden'>{embedData.widgetKey}</div>
                    <Button size='sm' variant='outline' onClick={() => handleCopyCode(embedData.widgetKey, 'widget-key')} className='shrink-0'>
                      {state.context.copiedCode === 'widget-key' ? <CheckCircle className='w-3 h-3 text-green-500' /> : <Copy className='w-3 h-3' />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>Embed Key</label>
                  <div className='flex items-center gap-2 mt-1'>
                    <div className='font-mono text-xs bg-muted p-2 rounded flex-1 break-all overflow-hidden'>{embedData.embedKey}</div>
                    <Button size='sm' variant='outline' onClick={() => handleCopyCode(embedData.embedKey, 'embed-key')} className='shrink-0'>
                      {state.context.copiedCode === 'embed-key' ? <CheckCircle className='w-3 h-3 text-green-500' /> : <Copy className='w-3 h-3' />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Additional Information */}
        <section className='mb-12'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-500' />
                Implementation Tips
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-foreground mb-2'>JavaScript Embedding:</h4>
                  <p className='text-sm text-muted-foreground mb-2'>{embedData.instructions.usage}</p>
                  <div className='bg-muted p-3 rounded-md'>
                    <code className='text-sm'>{embedData.instructions.example}</code>
                  </div>
                </div>
                <div>
                  <h4 className='font-semibold text-foreground mb-2'>Iframe Embedding:</h4>
                  <p className='text-sm text-muted-foreground mb-2'>{embedData.instructions.iframeUsage}</p>
                  <div className='bg-muted p-3 rounded-md'>
                    <code className='text-sm'>{embedData.instructions.iframeExample}</code>
                  </div>
                </div>
                <div className='bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md'>
                  <p className='text-sm text-blue-800 dark:text-blue-200'>{embedData.instructions.note}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};
