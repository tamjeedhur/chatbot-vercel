import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Trash2, Edit, Copy, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Webhook } from '@/types/integrations';

interface WebhookItemProps {
  webhook: Webhook;
  onEdit?: (webhookId: string) => void;
  onDelete?: (webhookId: string) => void;
  onCopyUrl?: (url: string) => void;
  onTest?: (webhookId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Inactive':
      return 'outline';
    case 'Error':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'text-green-600';
    case 'Inactive':
      return 'text-gray-500';
    case 'Error':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function WebhookItem({ webhook, onEdit, onDelete, onCopyUrl, onTest, isLoading = false, className = '' }: WebhookItemProps) {
  if (isLoading) {
    return (
      <Card className={`p-4 ${className}`}>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-48' />
              <Skeleton className='h-3 w-24' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-8 w-8' />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${className}`}>
      <CardContent className='p-0'>
        <div className='flex items-center justify-between'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <p className='font-medium text-sm truncate'>{webhook.name}</p>
              <Badge variant={getStatusVariant(webhook.status)} className={`text-xs ${getStatusColor(webhook.status)}`}>
                {webhook.status}
              </Badge>
            </div>
            <p className='text-xs text-muted-foreground truncate mb-1'>{webhook.url}</p>
            <div className='flex items-center gap-4 text-xs text-muted-foreground'>
              <span>Created: {formatDate(webhook.createdAt)}</span>
              {webhook.lastTriggered && <span>Last triggered: {formatDate(webhook.lastTriggered)}</span>}
            </div>
            {webhook.events && webhook.events.length > 0 && (
              <div className='flex flex-wrap gap-1 mt-2'>
                {webhook.events.slice(0, 3).map((event, index) => (
                  <Badge key={index} variant='outline' className='text-xs'>
                    {event}
                  </Badge>
                ))}
                {webhook.events.length > 3 && (
                  <Badge variant='outline' className='text-xs'>
                    +{webhook.events.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className='flex items-center gap-2 ml-4'>
            <Button variant='outline' size='sm' onClick={() => onCopyUrl?.(webhook.url)} className='text-xs h-7 px-2'>
              <Copy className='w-3 h-3 mr-1' />
              Copy
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='h-7 w-7 p-0'>
                  <MoreHorizontal className='w-3 h-3' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => onEdit?.(webhook._id)}>
                  <Edit className='w-3 h-3 mr-2' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTest?.(webhook._id)}>
                  <ExternalLink className='w-3 h-3 mr-2' />
                  Test
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(webhook._id)} className='text-red-600 focus:text-red-600'>
                  <Trash2 className='w-3 h-3 mr-2' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WebhookItem;
