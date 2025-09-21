'use client';

import React from 'react';
import { useMachine } from '@xstate/react';
import { chatbotConfigurationMachine } from '@/machines/chatbotConfigurationMachine';
import { ConfigurationHeader } from '@/components/layout/ConfigurationHeader';
import { ConfigurationTabs } from '@/components/layout/ConfigurationTabs';
import { GeneralSettingsTab } from '@/components/features/GeneralSettingsTab';
import { BehaviorSettingsTab } from '@/components/features/BehaviorSettingsTab';
import { WidgetSettingsTab } from '@/components/features/WidgetSettingsTab';
import { RoutingSettingsTab } from '@/components/features/RoutingSettingsTab';
import { ToolsSettingsTab } from '@/components/features/ToolsSettingsTab';
import { WorkingHoursTab } from '@/components/features/WorkingHoursTab';
import { tabs } from '@/utils/constants';
import { ChatbotConfigurationFormProps, Chatbot } from '@/types/chatbotConfiguration';

export const ChatbotConfigurationForm: React.FC<ChatbotConfigurationFormProps> = ({ selectedChatbot, serverUrl, accessToken, onChatbotUpdate }) => {
  const [state, send] = useMachine(chatbotConfigurationMachine, {
    input: { selectedChatbot, serverUrl, accessToken },
  });

  const { context } = state;

  const handleFieldChange = (path: string, value: any) => {
    send({ type: 'UPDATE_FIELD', path, value });
    if (onChatbotUpdate && context.selectedChatbot) {
      const updatedChatbot = { ...context.selectedChatbot } as Chatbot;
      const pathParts = path.split('.');
      let current: any = updatedChatbot;

      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        } else {
          // Clone the nested object to ensure it's mutable
          if (Array.isArray(current[pathParts[i]])) {
            current[pathParts[i]] = [...current[pathParts[i]]];
          } else {
            current[pathParts[i]] = { ...current[pathParts[i]] };
          }
        }
        current = current[pathParts[i]];
      }

      current[pathParts[pathParts.length - 1]] = value;
      onChatbotUpdate(updatedChatbot);
    }
  };

  const handleTabChange = (tab: string) => {
    send({ type: 'SET_ACTIVE_TAB', tab });
  };

  const handleSave = () => {
    send({ type: 'SAVE_CONFIGURATION' });
  };

  const handleReset = () => {
    send({ type: 'RESET_CONFIGURATION' });
  };

  const handleTogglePreview = () => {
    send({ type: 'TOGGLE_PREVIEW' });
  };

  const handleCopyToClipboard = (text: string, fieldName: string) => {
    send({ type: 'COPY_TO_CLIPBOARD', text, fieldName });
  };

  const handleNewBrandVoiceChange = (value: string) => {
    send({ type: 'SET_NEW_BRAND_VOICE', value });
  };

  const handleAddBrandVoice = () => {
    send({ type: 'ADD_BRAND_VOICE' });
  };

  const handleRemoveBrandVoice = () => {
    send({ type: 'REMOVE_BRAND_VOICE' });
  };

  const getActiveTabData = () => tabs.find((tab) => tab.id === context.activeTab);

  const renderActiveTab = () => {
    const isDisabled = state.value === 'saving';

    switch (context.activeTab) {
      case 'general':
        return (
          <GeneralSettingsTab
            selectedChatbot={context.selectedChatbot}
            onFieldChange={handleFieldChange}
            copiedField={context.copiedField}
            onCopyToClipboard={handleCopyToClipboard}
            disabled={isDisabled}
          />
        );
      case 'behavior':
        return (
          <BehaviorSettingsTab
            selectedChatbot={context.selectedChatbot}
            onFieldChange={handleFieldChange}
            newBrandVoice={context.newBrandVoice}
            onNewBrandVoiceChange={handleNewBrandVoiceChange}
            onAddBrandVoice={handleAddBrandVoice}
            onRemoveBrandVoice={handleRemoveBrandVoice}
            disabled={isDisabled}
          />
        );
      case 'widget':
        return (
          <WidgetSettingsTab
            selectedChatbot={context.selectedChatbot}
            onFieldChange={handleFieldChange}
            copiedField={context.copiedField}
            onCopyToClipboard={handleCopyToClipboard}
            disabled={isDisabled}
          />
        );
      case 'routing':
        return (
          <RoutingSettingsTab
            selectedChatbot={context.selectedChatbot}
            onFieldChange={handleFieldChange}
            disabled={isDisabled}
          />
        );
      case 'tools':
        return <ToolsSettingsTab selectedChatbot={context.selectedChatbot} onFieldChange={handleFieldChange} disabled={isDisabled} />;
      case 'hours':
        return <WorkingHoursTab selectedChatbot={context.selectedChatbot} onFieldChange={handleFieldChange} disabled={isDisabled} />;
      default:
        return (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Select a tab to configure settings</p>
          </div>
        );
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <ConfigurationHeader
        title='Chatbot Configuration'
        description={getActiveTabData()?.description || 'Configure your AI chatbot settings and behavior'}
        hasUnsavedChanges={context.hasUnsavedChanges}
        isLoading={state.value === 'saving'}
        showPreview={context.showPreview}
        onSave={handleSave}
        onReset={handleReset}
        onTogglePreview={handleTogglePreview}
      />

      <ConfigurationTabs 
        activeTab={context.activeTab} 
        onTabChange={handleTabChange} 
      />

      <div className='max-w-7xl mx-auto p-6'>
        {renderActiveTab()}
      </div>
    </div>
  );
};
