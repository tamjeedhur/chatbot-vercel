'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TabOption {
  id: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, activeTab, onTabChange, className }) => {
  return (
    <div className={cn('flex justify-center mb-6', className)}>
      <div className='bg-muted p-1 rounded-lg'>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant='ghost'
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-6 py-2 rounded-md font-medium transition-colors',
              activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}>
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
