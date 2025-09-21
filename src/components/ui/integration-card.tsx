import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { IntegrationTool } from '@/types/integrations';

interface IntegrationCardProps {
  integration: IntegrationTool;
  onConnect?: (toolId: string) => void;
  onDisconnect?: (toolId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const getIntegrationIcon = (name: string): string => {
  const iconMap: { [key: string]: string } = {
    Slack: '💬',
    Discord: '🎮',
    Zapier: '⚡',
    Webhook: '🔗',
    'Google Sheets': '📊',
    'Microsoft Teams': '👥',
    Notion: '📝',
    Trello: '📋',
    Asana: '✅',
    Jira: '🎯',
  };
  return iconMap[name] || '🔧';
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Connected':
      return 'default';
    case 'Disconnected':
      return 'outline';
    case 'Pending':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Connected':
      return 'text-green-600';
    case 'Disconnected':
      return 'text-gray-500';
    case 'Pending':
      return 'text-yellow-600';
    default:
      return 'text-gray-500';
  }
};

export function IntegrationCard({ integration, onConnect, onDisconnect, isLoading = false, className = '' }: IntegrationCardProps) {
  const isConnected = integration.status === 'Connected';
  const isPending = integration.status === 'Pending';

  if (isLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Skeleton className='w-8 h-8 rounded' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-3 w-32' />
              </div>
            </div>
            <Skeleton className='h-6 w-20' />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${className}`}>
      <CardContent className='p-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl' role='img' aria-label={`${integration.name} icon`}>
              {integration.icon || getIntegrationIcon(integration.name)}
            </span>
            <div>
              <p className='font-medium text-sm'>{integration.name}</p>
              <p className='text-xs text-muted-foreground line-clamp-2'>{integration.description}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant={getStatusVariant(integration.status)} className={`text-xs ${getStatusColor(integration.status)}`}>
              {integration.status}
            </Badge>
            {isConnected ? (
              <Button variant='outline' size='sm' onClick={() => onDisconnect?.(integration._id)} className='text-xs h-7 px-2'>
                Disconnect
              </Button>
            ) : (
              <Button variant='default' size='sm' onClick={() => onConnect?.(integration._id)} disabled={isPending} className='text-xs h-7 px-2'>
                {isPending ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default IntegrationCard;
