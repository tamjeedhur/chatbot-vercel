'use client';

import React from 'react';
import { ToolSelector } from '@/components/forms/ToolSelector';
import { ToolsSettingsTabProps, Chatbot } from '@/types/chatbotConfiguration';

export const ToolsSettingsTab: React.FC<ToolsSettingsTabProps> = ({ selectedChatbot, onFieldChange, disabled = false }) => {
  const handleToolToggle = (tool: string) => {
    const currentTools = selectedChatbot?.config?.tools || [];
    const newTools = currentTools.includes(tool) ? currentTools.filter((t: string) => t !== tool) : [...currentTools, tool];

    onFieldChange('config.tools', newTools);
  };

  return (
    <div className='space-y-6'>
      <div className='bg-card rounded-xl border border-border p-6'>
        <ToolSelector selectedTools={selectedChatbot?.config?.tools || []} onToolToggle={handleToolToggle} disabled={disabled} />
      </div>
    </div>
  );
};
