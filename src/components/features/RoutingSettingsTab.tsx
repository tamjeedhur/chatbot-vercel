'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Chatbot } from '@/types/chatbotConfiguration';

interface RoutingSettingsTabProps {
  selectedChatbot: Chatbot | null;
  onFieldChange: (path: string, value: any) => void;
  disabled?: boolean;
}

export const RoutingSettingsTab: React.FC<RoutingSettingsTabProps> = ({
  selectedChatbot,
  onFieldChange,
  disabled = false,
}) => {
  const handleInputChange = (path: string, value: any) => {
    if (!disabled) {
      onFieldChange(path, value);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950';
      case 'normal':
        return 'text-primary bg-primary/10';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950';
      case 'urgent':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const formatPriority = (priority: string) => {
    return (priority?.charAt(0)?.toUpperCase() || 'N') + (priority?.slice(1) || 'ormal');
  };

  return (
    <div className="space-y-6">
      {/* Escalation & Routing */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Escalation & Routing</h2>

        <div className="space-y-6">
          {/* Enable Escalation Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-foreground">Enable Escalation</h3>
              <p className="text-sm text-muted-foreground">Allow conversations to be escalated to human agents</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedChatbot?.routing?.escalationEnabled || false}
                onChange={(e) => handleInputChange('routing.escalationEnabled', e.target.checked)}
                className="sr-only"
                disabled={disabled}
              />
              <div
                className={`w-11 h-6 rounded-full ${
                  selectedChatbot?.routing?.escalationEnabled ? 'bg-primary' : 'bg-muted-foreground/20'
                }`}
              >
                <div
                  className={`h-5 w-5 bg-background rounded-full shadow transform transition-transform ${
                    selectedChatbot?.routing?.escalationEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </label>
          </div>

          {/* Routing Strategy and Default Priority */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="routingStrategy">Routing Strategy</Label>
              <Select
                value={selectedChatbot?.routing?.strategy || 'round_robin'}
                onValueChange={(value) => handleInputChange('routing.strategy', value)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select routing strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_robin">Round Robin</SelectItem>
                  <SelectItem value="least_busy">Least Busy Agent</SelectItem>
                  <SelectItem value="skills_based">Skills Based</SelectItem>
                  <SelectItem value="priority">Priority Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="defaultPriority">Default Priority</Label>
              <Select
                value={selectedChatbot?.routing?.defaultPriority || 'normal'}
                onValueChange={(value) => handleInputChange('routing.defaultPriority', value)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent Priority</SelectItem>
                </SelectContent>
              </Select>
              <div
                className={`mt-2 px-2 py-1 text-xs rounded-full inline-block ${getPriorityColor(
                  selectedChatbot?.routing?.defaultPriority || 'normal'
                )}`}
              >
                {formatPriority(selectedChatbot?.routing?.defaultPriority || 'normal')} Priority
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Experience */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">User Experience</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-foreground">Collect Feedback</h4>
              <p className="text-xs text-muted-foreground">Ask users to rate conversations</p>
            </div>
            <input
              type="checkbox"
              checked={selectedChatbot?.settings?.collectFeedback || false}
              onChange={(e) => handleInputChange('settings.collectFeedback', e.target.checked)}
              className="h-4 w-4 text-primary rounded border-input"
              disabled={disabled}
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-foreground">Allow Regeneration</h4>
              <p className="text-xs text-muted-foreground">Let users request new responses</p>
            </div>
            <input
              type="checkbox"
              checked={selectedChatbot?.settings?.allowRegenerate || false}
              onChange={(e) => handleInputChange('settings.allowRegenerate', e.target.checked)}
              className="h-4 w-4 text-primary rounded border-input"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
