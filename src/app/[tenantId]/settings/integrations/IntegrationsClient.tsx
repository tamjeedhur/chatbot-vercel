'use client';

import React from 'react';
import { useMachine } from '@xstate/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { integrationMachine } from '@/machines/integrationMachine';
import { IntegrationCard } from '@/components/ui/integration-card';
import { WebhookItem } from '@/components/ui/webhook-item';
import { EmptyIntegrations } from '@/components/ui/empty-integrations';
import { toast } from 'sonner';
import type { IntegrationsData, CreateWebhookFormData } from '@/types/integrations';

interface IntegrationsClientProps {
  initialData: IntegrationsData;
  chatbotId: string;
  tenantId: string;
}

export default function IntegrationsClient({ initialData, chatbotId, tenantId }: IntegrationsClientProps) {
  const [state, send] = useMachine(integrationMachine, {
    input: {
      chatbotId,
      initialData,
      serverUrl: process.env.NEXT_PUBLIC_API_URL || '',
      bearerToken: '', // This should come from session or context
    },
  });

  // Handle tool connection
  const handleConnectTool = (toolId: string) => {
    send({ type: 'CONNECT_TOOL', toolId });
  };

  // Handle tool disconnection
  const handleDisconnectTool = (toolId: string) => {
    send({ type: 'DISCONNECT_TOOL', toolId });
  };

  // Handle webhook creation
  const handleCreateWebhook = () => {
    // This would open a modal or navigate to a form
    toast.info('Webhook creation form would open here');
  };

  // Handle webhook edit
  const handleEditWebhook = (webhookId: string) => {
    // This would open an edit modal
    toast.info(`Edit webhook ${webhookId}`);
  };

  // Handle webhook deletion
  const handleDeleteWebhook = (webhookId: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      send({ type: 'DELETE_WEBHOOK', webhookId });
    }
  };

  // Handle webhook URL copy
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Webhook URL copied to clipboard');
  };

  // Handle webhook test
  const handleTestWebhook = (webhookId: string) => {
    toast.info(`Test webhook ${webhookId}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    send({ type: 'LOAD_INTEGRATIONS' });
  };

  // Clear error
  const handleClearError = () => {
    send({ type: 'CLEAR_ERROR' });
  };

  // Show error toast
  React.useEffect(() => {
    if (state.context.error) {
      toast.error(state.context.error);
    }
  }, [state.context.error]);

  return (
    <div className='space-y-6'>
      {/* Error Banner */}
      {state.context.error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between'>
          <p className='text-red-800 text-sm'>{state.context.error}</p>
          <Button variant='outline' size='sm' onClick={handleClearError}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Popular Integrations */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-2xl font-bold'>Popular Integrations</CardTitle>
              <CardDescription>Connect with tools your team already uses</CardDescription>
            </div>
            <Button variant='outline' size='sm' onClick={handleRefresh} disabled={state.context.loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${state.context.loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {state.context.tools.length === 0 ? (
            <EmptyIntegrations type='tools' onAdd={() => toast.info('Integration browser would open here')} />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {state.context.tools.map((integration) => (
                <IntegrationCard
                  key={integration._id}
                  integration={integration}
                  onConnect={handleConnectTool}
                  onDisconnect={handleDisconnectTool}
                  isLoading={
                    state.context.actionLoading.connectTool === integration._id || state.context.actionLoading.disconnectTool === integration._id
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-2xl font-bold'>Webhooks</CardTitle>
              <CardDescription>Configure webhook endpoints for real-time notifications</CardDescription>
            </div>
            <Button variant='outline' size='sm' onClick={handleCreateWebhook} disabled={state.context.actionLoading.createWebhook}>
              <Plus className='w-4 h-4 mr-2' />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {state.context.webhooks.length === 0 ? (
            <EmptyIntegrations type='webhooks' onAdd={handleCreateWebhook} />
          ) : (
            state.context.webhooks.map((webhook) => (
              <WebhookItem
                key={webhook._id}
                webhook={webhook}
                onEdit={handleEditWebhook}
                onDelete={handleDeleteWebhook}
                onCopyUrl={handleCopyUrl}
                onTest={handleTestWebhook}
                isLoading={state.context.actionLoading.updateWebhook === webhook._id || state.context.actionLoading.deleteWebhook === webhook._id}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
