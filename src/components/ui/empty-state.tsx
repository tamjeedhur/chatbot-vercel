import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  className,
  iconClassName
}) => {
  return (
    <div className={cn(
      'flex-1 flex items-center justify-center bg-muted/30',
      className
    )}>
      <div className='text-center max-w-sm mx-auto px-4'>
        {Icon && (
          <div className={cn(
            'w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4',
            iconClassName
          )}>
            <Icon className='w-8 h-8 text-muted-foreground' />
          </div>
        )}
        <h3 className='text-lg font-medium text-foreground mb-2'>{title}</h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>{description}</p>
      </div>
    </div>
  );
};

export default EmptyState;
