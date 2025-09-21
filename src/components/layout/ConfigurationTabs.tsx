'use client';

import React from 'react';
import { tabs } from '@/utils/constants';
import { ConfigurationTabsProps } from '@/types/chatbotConfiguration';

export const ConfigurationTabs: React.FC<ConfigurationTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  className = '' 
}) => {
  return (
    <div className={`bg-card border-b border-border ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap gap-1 py-4" aria-label="Configuration tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group relative flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent'
                  }
                  min-w-0 flex-shrink-0
                `}
                title={tab.description}
              >
                <Icon 
                  size={18} 
                  className={`flex-shrink-0 ${
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  }`} 
                />
                <span className="hidden sm:inline whitespace-nowrap">
                  {tab.name}
                </span>
                <span className="sm:hidden">
                  {tab.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
