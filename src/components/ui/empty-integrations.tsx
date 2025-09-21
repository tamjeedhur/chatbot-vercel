import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Webhook } from 'lucide-react';

interface EmptyIntegrationsProps {
  type: 'tools' | 'webhooks';
  onAdd?: () => void;
  className?: string;
}

export function EmptyIntegrations({ type, onAdd, className = '' }: EmptyIntegrationsProps) {
  const isTools = type === 'tools';
  const Icon = isTools ? Zap : Webhook;
  const title = isTools ? 'No Integration Tools' : 'No Webhooks';
  const description = isTools
    ? 'Connect your chatbot with external services to extend its capabilities.'
    : 'Create webhooks to receive real-time notifications about chatbot events.';
  const buttonText = isTools ? 'Browse Integrations' : 'Add Webhook';

  return (
    <Card className={`p-8 ${className}`}>
      <CardContent className='flex flex-col items-center justify-center text-center space-y-4'>
        <div className='w-16 h-16 rounded-full bg-muted flex items-center justify-center'>
          <Icon className='w-8 h-8 text-muted-foreground' />
        </div>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>{title}</h3>
          <p className='text-sm text-muted-foreground max-w-md'>{description}</p>
        </div>
        {onAdd && (
          <Button onClick={onAdd} className='mt-4'>
            <Plus className='w-4 h-4 mr-2' />
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default EmptyIntegrations;


