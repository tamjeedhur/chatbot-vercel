'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Send, RefreshCw, AlertCircle } from 'lucide-react';
import { ComparisonView } from './components/ComparisonView';
import { ChatMessage } from '@/types/interfaces';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { useSelector } from 'react-redux';
import { selectSelectedChatbot } from '@/redux/slices/chatbotSlice';
import { EditableTextArea } from '@/components/forms/EditableTextArea';
import { Session } from 'next-auth';

interface PromptPageClientProps {
  tenantId: string;
  selectedChatbotId: string;
  session: Session;
}

// Constants for better maintainability
const MODEL_OPTIONS = [
  { value: 'gpt-4', label: 'GPT-4 (Recommended)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'claude-3', label: 'Claude 3' },
] as const;

const TEMPERATURE_RANGE = { min: 0, max: 0.7, step: 0.1 };
const DEFAULT_TEMPERATURE = 0;

export default function PromptPageClient({ tenantId, selectedChatbotId, session }: PromptPageClientProps) {
  const [state, send] = useChatBotMachineState();
  const reduxSelectedChatbot = useSelector(selectSelectedChatbot);
  const selectedChatbot = (reduxSelectedChatbot as any) || state.context.selectedChatbot;

  // Determine theme from selectedChatbot configuration
  const theme = selectedChatbot?.ui?.theme || 'light';
  const [prompt, setPrompt] = useState('');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const selectedModelId = selectedChatbot?.config?.model?.responseModel || 'gpt-4';
  const isLoading = state.context.isLoading;
  const temperature = selectedChatbot?.config?.model?.temperature || DEFAULT_TEMPERATURE;

  // Memoized values for performance
  const primaryColor = useMemo(() => selectedChatbot?.ui?.primaryColor || '#3B82F6', [selectedChatbot?.ui?.primaryColor]);
  const displayName = useMemo(() => selectedChatbot?.ui?.displayName || 'AI Assistant', [selectedChatbot?.ui?.displayName]);
  const logoUrl = useMemo(() => selectedChatbot?.ui?.logoUrl, [selectedChatbot?.ui?.logoUrl]);
  const messagePlaceholder = useMemo(
    () => selectedChatbot?.ui?.messagePlaceholder || 'Type your message...',
    [selectedChatbot?.ui?.messagePlaceholder]
  );

  const handleFieldChange = useCallback(
    async (path: string, value: any) => {
      if (!selectedChatbot) return;

      try {
        setError(null);
        send({
          type: 'UPDATE_FIELD_AND_SAVE',
          path: path,
          value: value,
        });
      } catch (err) {
        setError(`Failed to update ${path}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    },
    [selectedChatbot, send]
  );

  // Handle temperature change
  const handleTemperatureChange = useCallback(
    (value: number[]) => {
      const newTemperature = value[0];
      handleFieldChange('config.model.temperature', newTemperature);
    },
    [handleFieldChange]
  );

  // Handle model selection change
  const handleModelChange = useCallback(
    (value: string) => {
      handleFieldChange('config.model.responseModel', value);
    },
    [handleFieldChange]
  );

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isSending) return;

      try {
        setError(null);
        setIsSending(true);

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage: ChatMessage = { role: 'user', content: message, timestamp };

        // TODO: Replace with actual API call to your chatbot service
        // This is a placeholder implementation
        await new Promise((resolve) => {
          setTimeout(() => {
            // Simulate API response - replace with actual implementation
            const responses = [
              'I understand your question. Based on the context provided, I can help you with this task. Let me break down the solution step by step...',
              "Thank you for your question. I'd be happy to assist you with this. Here's my detailed response to your inquiry...",
              "That's an interesting question! Let me provide you with a comprehensive answer that addresses all aspects of your request...",
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const assistantMessage: ChatMessage = {
              role: 'assistant',
              content: randomResponse,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            // Clear the input after sending
            setPrompt('');
            resolve(assistantMessage);
          }, 1500 + Math.random() * 1000);
        });
      } catch (err) {
        setError(`Failed to send message: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsSending(false);
      }
    },
    [isSending]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(prompt);
      }
    },
    [prompt, handleSendMessage]
  );

  const handleRefresh = useCallback(() => {
    // TODO: Implement refresh functionality
    console.log('Refresh clicked');
  }, []);

  if (isCompareMode) {
    return <ComparisonView setIsCompareMode={setIsCompareMode} />;
  }

  return (
    <AdminLayout>
      <div className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold mb-2 dark:text-white'>Prompt Settings</h1>
            <p className='text-muted-foreground'>Test and configure your AI agents</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className='flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
            <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400' />
            <span className='text-red-700 dark:text-red-300 text-sm'>{error}</span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setError(null)}
              className='ml-auto text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'>
              Dismiss
            </Button>
          </div>
        )}

        <div className='flex gap-4'>
          <Button variant={!isCompareMode ? 'default' : 'outline'} onClick={() => setIsCompareMode(false)} aria-pressed={!isCompareMode}>
            Configure & test agents
          </Button>
          <Button variant={isCompareMode ? 'default' : 'outline'} onClick={() => setIsCompareMode(true)} aria-pressed={isCompareMode}>
            Compare
          </Button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Configuration Panel */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  Model Configuration
                  {isLoading && (
                    <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin' aria-label='Loading' />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='model-select'>AI Model</Label>
                  <Select value={selectedModelId} onValueChange={handleModelChange} disabled={isLoading}>
                    <SelectTrigger id='model-select' aria-label='Select AI model'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODEL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='temperature-slider'>Temperature: {temperature}</Label>
                  <Slider
                    id='temperature-slider'
                    value={[temperature]}
                    onValueChange={handleTemperatureChange}
                    min={TEMPERATURE_RANGE.min}
                    max={TEMPERATURE_RANGE.max}
                    step={TEMPERATURE_RANGE.step}
                    className='w-full'
                    disabled={isLoading}
                    aria-label={`Temperature control: ${temperature}`}
                  />
                  <div className='flex justify-between text-xs text-muted-foreground'>
                    <span>Reserved</span>
                    <span>Creative</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>System Prompt</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <EditableTextArea
                    value={selectedChatbot?.config?.systemPrompt || ''}
                    onSave={(value) => handleFieldChange('config.systemPrompt', value)}
                    label='System Prompt'
                    placeholder="Define your chatbot's personality and behavior..."
                    rows={12}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className='lg:col-span-1'>
            <Card className='h-[600px] flex flex-col border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
              <div className='bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl border border-border/30 flex-1 flex flex-col'>
                {/* Chatbot Header */}
                <div
                  className='flex items-center justify-between p-4 border-b-0 rounded-t-2xl shadow-sm relative'
                  style={{ backgroundColor: primaryColor }}>
                  {/* Background overlay for glassmorphism effect */}
                  <div className='absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-t-2xl' />

                  <div className='flex items-center gap-3 z-10'>
                    <div
                      className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20'
                      style={{ backgroundColor: primaryColor }}
                      aria-label={`${displayName} logo`}>
                      {logoUrl ? (
                        <img src={logoUrl} alt={`${displayName} logo`} className='w-full h-full object-cover' />
                      ) : (
                        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' aria-hidden='true'>
                          <path d='M12 2L2 7l10 5 10-5-10-5z'></path>
                          <path d='m2 17 10 5 10-5'></path>
                          <path d='m2 12 10 5 10-5'></path>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className='font-semibold text-white text-base'>{displayName}</div>
                      <div className='text-xs text-white/90 flex items-center gap-1.5'>
                        <div className='w-2 h-2 bg-green-400 rounded-full' aria-label='Online status' />
                        Online
                      </div>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleRefresh}
                    className='p-1.5 hover:bg-white/10 rounded-full transition-colors z-10 text-white'
                    aria-label='Refresh chat'>
                    <RefreshCw className='w-5 h-5' />
                  </Button>
                </div>

                {/* Customer Info Panel */}
                <div className='bg-gray-50/80 dark:bg-[#020817] px-4 py-3 border-b border-border/30 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      className='text-gray-600'
                      aria-hidden='true'>
                      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                      <circle cx='12' cy='7' r='4'></circle>
                    </svg>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Test User</span>
                  </div>
                  <div className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
                    <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
                      <circle cx='12' cy='12' r='10'></circle>
                      <polyline points='12,6 12,12 16,14'></polyline>
                    </svg>
                    <span>Just now</span>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div className='flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-900'>
                  <div className='space-y-4'>
                    {/* Chat interface - messages would be managed by the actual chatbot implementation */}
                    <div className='text-center text-gray-500 dark:text-gray-400 py-8'>
                      <p>Chat interface ready for configuration</p>
                      <p className='text-sm mt-2'>Temperature and system prompt can be configured above</p>
                    </div>

                    {/* Loading Indicator */}
                    {isLoading && (
                      <div className='flex items-start gap-2'>
                        <div
                          className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0'
                          style={{ backgroundColor: primaryColor }}
                          aria-label='AI is typing'>
                          {logoUrl ? (
                            <img src={logoUrl} alt='Bot avatar' className='w-full h-full object-cover rounded-full' />
                          ) : (
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' aria-hidden='true'>
                              <path d='M12 2L2 7l10 5 10-5-10-5z'></path>
                              <path d='m2 17 10 5 10-5'></path>
                              <path d='m2 12 10 5 10-5'></path>
                            </svg>
                          )}
                        </div>
                        <div className='flex flex-col max-w-[80%]'>
                          <div
                            className='p-3 rounded-2xl rounded-bl-sm'
                            style={{
                              backgroundColor: primaryColor,
                              color: theme === 'dark' ? '#FFFFFF' : '#000000',
                              border: theme === 'dark' ? '1px solid #4B5563' : '1px solid #E5E7EB',
                            }}>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm' style={{ color: theme === 'dark' ? '#FFFFFF' : '#000000' }}>
                                AI is typing
                              </span>
                              <div className='flex gap-1' aria-label='Typing indicator'>
                                <div
                                  className='w-2 h-2 rounded-full animate-bounce'
                                  style={{ backgroundColor: theme === 'dark' ? '#9CA3AF' : '#9CA3AF', animationDelay: '0ms' }}></div>
                                <div
                                  className='w-2 h-2 rounded-full animate-bounce'
                                  style={{ backgroundColor: theme === 'dark' ? '#9CA3AF' : '#9CA3AF', animationDelay: '150ms' }}></div>
                                <div
                                  className='w-2 h-2 rounded-full animate-bounce'
                                  style={{ backgroundColor: theme === 'dark' ? '#9CA3AF' : '#9CA3AF', animationDelay: '300ms' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Bar */}
                <div
                  className='border-t border-gray-200 dark:border-gray-700 px-4 py-3'
                  style={{ backgroundColor: selectedChatbot?.ui?.theme === 'dark' ? '#020817' : '#FFFFFF' }}>
                  <div className='flex items-center justify-between mb-3'>
                    {selectedChatbot?.routing?.escalationEnabled && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300 transition-colors p-0 h-auto'
                        aria-label='Talk to human agent'>
                        🎧 Talk to Human Agent
                      </Button>
                    )}
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ml-auto p-0 h-auto'
                      aria-label='Upload file'>
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
                        <polyline points='7,10 12,15 17,10'></polyline>
                        <line x1='12' y1='15' x2='12' y2='3'></line>
                      </svg>
                    </Button>
                  </div>

                  {/* Input Section */}
                  <div className='flex items-end gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2'
                      aria-label='Attach file'>
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49'></path>
                      </svg>
                    </Button>
                    <div
                      className='flex-1 border border-gray-200 dark:border-gray-700 rounded-lg'
                      style={{ backgroundColor: selectedChatbot?.ui?.theme === 'dark' ? '#020817' : '#FFFFFF' }}>
                      <input
                        type='text'
                        placeholder={messagePlaceholder}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSending || isLoading}
                        className='w-full px-3 py-2 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none rounded-lg disabled:opacity-50'
                        aria-label='Type your message'
                      />
                    </div>
                    <Button
                      onClick={() => handleSendMessage(prompt)}
                      disabled={!prompt.trim() || isSending || isLoading}
                      className='p-2 rounded-lg transition-colors disabled:opacity-50'
                      style={{ backgroundColor: primaryColor }}
                      aria-label='Send message'>
                      <Send className='w-4 h-4 text-white' />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
