'use client';

import React from 'react';
import { Check, Copy, Plus, Globe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chatbot } from '@/types/chatbotConfiguration';

interface WidgetSettingsTabProps {
  selectedChatbot: Chatbot | null;
  onFieldChange: (path: string, value: any) => void;
  copiedField: string | null;
  onCopyToClipboard: (text: string, fieldName: string) => void;
  disabled?: boolean;
}

export const WidgetSettingsTab: React.FC<WidgetSettingsTabProps> = ({
  selectedChatbot,
  onFieldChange,
  copiedField,
  onCopyToClipboard,
  disabled = false,
}) => {
  const handleInputChange = (path: string, value: any) => {
    if (!disabled) {
      onFieldChange(path, value);
    }
  };

  const handleAddDomain = () => {
    const domain = window.prompt('Enter domain (e.g., https://example.com):');
    if (domain && domain.trim()) {
      const currentOrigins = selectedChatbot?.widget?.allowedOrigins || [];
      handleInputChange('widget.allowedOrigins', [...currentOrigins, domain.trim()]);
    }
  };

  const handleRemoveDomain = (index: number) => {
    const currentOrigins = [...(selectedChatbot?.widget?.allowedOrigins || [])];
    currentOrigins.splice(index, 1);
    handleInputChange('widget.allowedOrigins', currentOrigins);
  };

  return (
    <div className="space-y-6">
      {/* Widget Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Widget Settings</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Widget Status:</span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                selectedChatbot?.widget?.enabled
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {selectedChatbot?.widget?.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Enable Chat Widget Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-foreground">Enable Chat Widget</h3>
              <p className="text-sm text-muted-foreground">Allow visitors to interact with your chatbot</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedChatbot?.widget?.enabled || false}
                onChange={(e) => handleInputChange('widget.enabled', e.target.checked)}
                className="sr-only"
                disabled={disabled}
              />
              <div
                className={`w-11 h-6 rounded-full ${
                  selectedChatbot?.widget?.enabled ? 'bg-primary' : 'bg-muted-foreground/20'
                }`}
              >
                <div
                  className={`h-5 w-5 bg-background rounded-full shadow transform transition-transform ${
                    selectedChatbot?.widget?.enabled ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </label>
          </div>

          {/* Widget Key and Auto-show Delay */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="widgetKey">
                Widget Key
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="widgetKey"
                  type="text"
                  value={selectedChatbot?.key || ''}
                  onChange={(e) => handleInputChange('key', e.target.value)}
                  placeholder="support-bot-widget-001"
                  disabled={true}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCopyToClipboard(selectedChatbot?.key || '', 'widgetKey')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  disabled={disabled}
                >
                  {copiedField === 'widgetKey' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="autoShowDelay">Auto-show Delay (seconds)</Label>
              <Input
                id="autoShowDelay"
                type="number"
                min="0"
                value={(selectedChatbot?.widget?.autoShowDelay || 5000) / 1000}
                onChange={(e) =>
                  handleInputChange('widget.autoShowDelay', parseInt(e.target.value) * 1000)
                }
                disabled={disabled}
              />
            </div>
          </div>

          {/* AI Chat Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-foreground">AI Chat</h4>
                <p className="text-xs text-muted-foreground">Enable AI-powered responses</p>
              </div>
              <input
                type="checkbox"
                checked={selectedChatbot?.widget?.aiChatEnabled || false}
                onChange={(e) => handleInputChange('widget.aiChatEnabled', e.target.checked)}
                className="h-4 w-4 text-primary rounded border-input"
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popup Configuration */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Popup Configuration</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="popupMessage">Popup Message</Label>
            <Input
              id="popupMessage"
              type="text"
              value={selectedChatbot?.settings?.popupMessage?.message || ''}
              onChange={(e) => handleInputChange('settings.popupMessage.message', e.target.value)}
              placeholder="Message shown in popup..."
              disabled={disabled}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedChatbot?.settings?.popupMessage?.status || false}
              onChange={(e) => handleInputChange('settings.popupMessage.status', e.target.checked)}
              className="h-4 w-4 text-primary rounded border-input"
              disabled={disabled}
            />
            <label className="ml-2 text-sm text-foreground">Enable popup message</label>
          </div>
        </div>
      </div>

      {/* Allowed Origins */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Allowed Origins</h2>
          <Button
            onClick={handleAddDomain}
            variant="outline"
            size="sm"
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Domain
          </Button>
        </div>

        <div className="space-y-3">
          {(selectedChatbot?.widget?.allowedOrigins || []).map((origin: string, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-800 dark:text-green-200 font-mono">{origin}</span>
              </div>
              <Button
                onClick={() => handleRemoveDomain(index)}
                variant="ghost"
                size="sm"
                disabled={disabled}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 p-1"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
