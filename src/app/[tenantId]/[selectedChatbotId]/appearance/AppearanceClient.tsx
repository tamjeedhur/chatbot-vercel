'use client';

import React, { useState, useRef, useCallback } from 'react';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Bot, MessageSquare,  Sparkles, RefreshCw, Plus, Trash2, ThumbsUp, ThumbsDown, Copy, Check, Edit, X, Save } from 'lucide-react';
import ImageUploadWithProgress from '@/components/upload/ImageUploadWithProgress';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { useSelector } from 'react-redux';
import { selectSelectedChatbot } from '@/redux/slices/chatbotSlice';


interface AppearanceClientProps {
  session: any;
}

const AppearanceClient = ({ session }: AppearanceClientProps) => {
  const [state, send] = useChatBotMachineState();
  const selectedChatbot = useSelector(selectSelectedChatbot);
  const accessToken = state.context.accessToken || (session as any)?.accessToken;
  const [newSuggestedMessage, setNewSuggestedMessage] = useState('');
  const [feedbackState, setFeedbackState] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [editingFallback, setEditingFallback] = useState(false);
  const [editingPopup, setEditingPopup] = useState(false);
  const [tempFallbackMessage, setTempFallbackMessage] = useState('');
  const [tempPopupMessage, setTempPopupMessage] = useState('');
  const configScrollRef = useRef<HTMLDivElement | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');


  // Unified editing function using lodash paths
  const handleInputChange = useCallback(
    (field: string, value: any) => {
      send({ type: 'UPDATE_FIELD', path: field, value, base: selectedChatbot });
    },
    [send, selectedChatbot]
  );



  // Functions for editing fallback message
  const startEditingFallback = () => {
    setTempFallbackMessage(selectedChatbot?.settings?.fallbackResponse?.message || '');
    setEditingFallback(true);
  };

  const cancelEditingFallback = () => {
    setTempFallbackMessage('');
    setEditingFallback(false);
  };

  const saveFallbackMessage = () => {
    handleInputChange('settings.fallbackResponse.message', tempFallbackMessage);
    setEditingFallback(false);
    setTempFallbackMessage('');
  };

  // Functions for editing popup message
  const startEditingPopup = () => {
    setTempPopupMessage(selectedChatbot?.settings?.popupMessage?.message || '');
    setEditingPopup(true);
  };

  const cancelEditingPopup = () => {
    setTempPopupMessage('');
    setEditingPopup(false);
  };

  const savePopupMessage = () => {
    handleInputChange('settings.popupMessage.message', tempPopupMessage);
    setEditingPopup(false);
    setTempPopupMessage('');
  };
  const removeLogo = () => {
    setLogoPreview('');
    handleInputChange('ui.logoUrl', '');
  };

  const addSuggestedMessage = () => {
    if (newSuggestedMessage.trim() && selectedChatbot?.ui?.suggestedMessages) {
      const updatedMessages = [...selectedChatbot.ui.suggestedMessages, newSuggestedMessage.trim()];
      handleInputChange('ui.suggestedMessages', updatedMessages);
      setNewSuggestedMessage('');
    }
  };

  const removeSuggestedMessage = (index: number) => {
    if (selectedChatbot?.ui?.suggestedMessages) {
      const updatedMessages = selectedChatbot.ui.suggestedMessages.filter((_: any, i: number) => i !== index);
      handleInputChange('ui.suggestedMessages', updatedMessages);
    }
  };

  const handleSave = useCallback(async () => {
    if (!selectedChatbot) return;
    try {
      send({
        type: 'UPDATE_CHATBOT',
        data: {
          chatbotId: selectedChatbot._id,
          chatbotData: selectedChatbot,
        },
      });
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainScrollable = document.querySelector('main.flex-1.overflow-auto') as HTMLElement | null;
        if (mainScrollable) {
          mainScrollable.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      if (configScrollRef.current) {
        configScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
    
    }
  }, [selectedChatbot, send]);

  const handleReset = () => {
    window.location.reload();
  };

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setFeedbackState((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === feedback ? null : feedback,
    }));
  };

  const handleCopy = async (messageId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [messageId]: false }));
      }, 2000);
    } catch (err) {
      
    }
  };

  const handleRegenerate = (messageId: string) => {
    // In a real implementation, this would trigger message regeneration
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const MessageActionButtons = ({ messageId, messageText, isBot }: { messageId: string; messageText: string; isBot: boolean }) => {
    if (!isBot) return null;

    return (
      <div className='flex items-center  mt-2'>
        <span className='text-xs text-muted-foreground'>{formatTime(new Date())}</span>
        <div className='ml-2 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity'>
          {/* Copy Button - Always shown for bot messages */}
          <button
            onClick={() => handleCopy(messageId, messageText)}
            className='p-1.5 rounded-md hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground'
            title='Copy message'>
            {copiedStates[messageId] ? <Check className='h-3 w-3 text-green-600' /> : <Copy className='h-3 w-3' />}
          </button>

          {/* Feedback Buttons - Shown only if collectUserFeedback is enabled */}
          {selectedChatbot?.settings?.collectFeedback && (
            <>
              <button
                onClick={() => handleFeedback(messageId, 'like')}
                className={`p-1.5 rounded-md hover:bg-background/80 transition-colors ${
                  feedbackState[messageId] === 'like' ? 'text-green-600 bg-green-50' : 'text-muted-foreground hover:text-foreground'
                }`}
                title='Good response'>
                <ThumbsUp className='h-3 w-3' />
              </button>
              <button
                onClick={() => handleFeedback(messageId, 'dislike')}
                className={`p-1.5 rounded-md hover:bg-background/80 transition-colors ${
                  feedbackState[messageId] === 'dislike' ? 'text-red-600 bg-red-50' : 'text-muted-foreground hover:text-foreground'
                }`}
                title='Poor response'>
                <ThumbsDown className='h-3 w-3' />
              </button>
            </>
          )}

          {/* Regenerate Button - Shown only if regenerateMessages is enabled */}
          {selectedChatbot?.settings?.allowRegenerate && (
            <button
              onClick={() => handleRegenerate(messageId)}
              className='p-1.5 rounded-md hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground'
              title='Regenerate response'>
              <RefreshCw className='h-3 w-3' />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className='w-full h-[calc(100vh-60px)] flex flex-col'>
        <div className='p-4 pb-0 flex-shrink-0'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>Chatbot Appearance</h1>
          <p className='text-muted-foreground'>Customize your chatbot's appearance and see changes in real-time</p>
        </div>
        <div className='flex-1 flex lg:grid flex-col lg:flex-row lg:grid-cols-2 lg:items-start gap-5 p-4 pt-8 overflow-visible'>
          {/* Left Side - Configuration (Scrollable) */}
          <div ref={configScrollRef} className='flex-1 pr-0 lg:pr-4 space-y-8 lg:overflow-y-auto'>
            {/* Basic Configuration */}
            <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
              <CardHeader className='pb-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center'>
                    <Bot className='h-6 w-6 text-blue-500' />
                  </div>
                  <div>
                    <CardTitle className='text-xl font-semibold text-foreground'>Basic Configuration</CardTitle>
                    <CardDescription className='text-muted-foreground'>Configure basic chatbot settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-3'>
                  <Label htmlFor='displayName' className='text-sm font-medium text-foreground'>
                    Display Name
                  </Label>
                  <Input
                    id='displayName'
                    value={selectedChatbot?.ui?.displayName || ''}
                    onChange={(e) => handleInputChange('ui.displayName', e.target.value)}
                    className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'
                    placeholder='Support Assistant'
                    disabled={!selectedChatbot}
                  />
                </div>

                <div className='space-y-3'>
                  <Label htmlFor='initialMessages' className='text-sm font-medium text-foreground'>
                    Initial Messages
                  </Label>
                  <Textarea
                    id='initialMessages'
                    value={selectedChatbot?.ui?.welcomeMessage || ''}
                    onChange={(e) => handleInputChange('ui.welcomeMessage', e.target.value)}
                    className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[80px]'
                    placeholder='Hi! What can I help you with?'
                    disabled={!selectedChatbot}
                  />
                </div>

                <div className='space-y-3'>
                  <Label htmlFor='messagePlaceholder' className='text-sm font-medium text-foreground'>
                    Message Placeholder
                  </Label>
                  <Input
                    id='messagePlaceholder'
                    value={selectedChatbot?.ui?.messagePlaceholder || ''}
                    onChange={(e) => handleInputChange('ui.messagePlaceholder', e.target.value)}
                    className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'
                    placeholder='Type your message...'
                    disabled={!selectedChatbot}
                  />
                </div>

                <div className='space-y-4'>
                  <Label className='text-sm font-medium text-foreground'>Suggested Messages</Label>

                  {/* Add new suggested message */}
                  <div className='flex gap-3'>
                    <Input
                      value={newSuggestedMessage}
                      onChange={(e) => setNewSuggestedMessage(e.target.value)}
                      placeholder='Add a suggested message...'
                      className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'
                      onKeyPress={(e) => e.key === 'Enter' && addSuggestedMessage()}
                    />
                    <Button onClick={addSuggestedMessage} className='primary-button'>
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>

                  {/* List of suggested messages */}
                  <div className='space-y-3 max-h-[300px] overflow-y-auto'>
                    {selectedChatbot?.ui?.suggestedMessages?.map((message: any, index: number) => (
                      <div
                        key={index}
                        className='group flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                        <span className='text-foreground text-sm'>{message}</span>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => removeSuggestedMessage(index)}
                          className='text-muted-foreground hover:text-red-500 transition-all duration-200'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                    {(!selectedChatbot?.ui?.suggestedMessages || selectedChatbot.ui.suggestedMessages.length === 0) && (
                      <div className='flex flex-col items-center justify-center py-8 text-center'>
                        <div className='w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3'>
                          <MessageSquare className='h-6 w-6 text-muted-foreground' />
                        </div>
                        <p className='text-muted-foreground text-sm'>No suggested messages yet</p>
                        <p className='text-xs text-muted-foreground/70'>Add one above to get started</p>
                      </div>
                    )}
                  </div>

                  {selectedChatbot?.ui?.suggestedMessages && selectedChatbot.ui.suggestedMessages.length > 0 && (
                    <p className='text-xs text-muted-foreground'>
                      {selectedChatbot.ui.suggestedMessages.length} message
                      {selectedChatbot.ui.suggestedMessages.length !== 1 ? 's' : ''} added
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
              <CardHeader className='pb-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center'>
                    <Palette className='h-6 w-6 text-purple-500' />
                  </div>
                  <div>
                    <CardTitle className='text-xl font-semibold text-foreground'>Appearance</CardTitle>
                    <CardDescription className='text-muted-foreground'>Customize the visual appearance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid gap-6'>
                  <div className='space-y-3'>
                    <Label className='text-sm font-medium text-foreground'>Chat Bubble Alignment</Label>
                    <Select value={selectedChatbot?.ui?.position || 'bottom-right'} onValueChange={(value) => handleInputChange('ui.position', value)}>
                      <SelectTrigger className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='border-border/50'>
                        <SelectItem value='bottom-left'>Left</SelectItem>
                        <SelectItem value='bottom-right'>Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-3'>
                    <Label htmlFor='autoShowDelay' className='text-sm font-medium text-foreground'>
                      Auto Show Delay (seconds)
                    </Label>
                    <Input
                      id='autoShowDelay'
                      type='number'
                      value={selectedChatbot?.widget?.autoShowDelay || 0}
                      onChange={(e) => handleInputChange('widget.autoShowDelay', parseInt(e.target.value))}
                      className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'
                      min='0'
                      max='60'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-3'>
                      <Label htmlFor='userMessageColor' className='text-sm font-medium text-foreground'>
                        Primary Color
                      </Label>
                      <div className='flex gap-2 items-center'>
                        <input
                          type='color'
                          id='userMessageColor'
                          value={selectedChatbot?.ui?.primaryColor || '#3B82F6'}
                          onChange={(e) => handleInputChange('ui.primaryColor', e.target.value)}
                          className='w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer'
                        />
                        <Input
                          value={selectedChatbot?.ui?.primaryColor || '#3B82F6'}
                          onChange={(e) => handleInputChange('ui.primaryColor', e.target.value)}
                          className='border-border/50 focus:border-purple-500/50 text-sm'
                        />
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <Label htmlFor='userMessageTextColor' className='text-sm font-medium text-foreground'>
                        User Message Text Color
                      </Label>
                      <div className='flex gap-2 items-center'>
                        <input
                          type='color'
                          id='userMessageTextColor'
                          value={selectedChatbot?.ui?.userMessageColor || '#3B82F6'}
                          onChange={(e) => handleInputChange('ui.userMessageColor', e.target.value)}
                          className='w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer'
                        />
                        <Input
                          value={selectedChatbot?.ui?.userMessageColor || '#3B82F6'}
                          onChange={(e) => handleInputChange('ui.userMessageColor', e.target.value)}
                          className='border-border/50 focus:border-purple-500/50 text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-3'>
                      <Label htmlFor='chatBubbleColor' className='text-sm font-medium text-foreground'>
                        Bot Message Color
                      </Label>
                      <div className='flex gap-2 items-center'>
                        <input
                          type='color'
                          id='chatBubbleColor'
                          value={selectedChatbot?.ui?.botColor || '#000000'}
                          onChange={(e) => handleInputChange('ui.botColor', e.target.value)}
                          className='w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer'
                        />
                        <Input
                          value={selectedChatbot?.ui?.botColor || '#000000'}
                          onChange={(e) => handleInputChange('ui.botColor', e.target.value)}
                          className='border-border/50 focus:border-purple-500/50 text-sm'
                        />
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <Label htmlFor='botMessageTextColor' className='text-sm font-medium text-foreground'>
                        Bot Message Text Color
                      </Label>
                      <div className='flex gap-2 items-center'>
                        <input
                          type='color'
                          id='botMessageTextColor'
                          value={selectedChatbot?.ui?.botMessageColor || '#000000'}
                          onChange={(e) => handleInputChange('ui.botMessageColor', e.target.value)}
                          className='w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer'
                        />
                        <Input
                          value={selectedChatbot?.ui?.botMessageColor || '#000000'}
                          onChange={(e) => handleInputChange('ui.botMessageColor', e.target.value)}
                          className='border-border/50 focus:border-purple-500/50 text-sm'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bot Logo Upload */}
                  <div className='space-y-3'>
                    <Label className='text-sm font-medium text-foreground'>Bot Logo</Label>
                    <div className='space-y-4'>
                      {/* Upload with progress */}
                      <div className='flex items-center gap-4'>
                        <ImageUploadWithProgress
                          accessToken={accessToken || undefined}
                          label='Upload Logo'
                          onUploaded={(url) => {
                            setLogoPreview(url);
                            handleInputChange('ui.logoUrl', url);
                          }}
                        />
                      </div>

                      {/* Logo preview */}
                      {logoPreview && (
                        <div className='p-4 bg-muted/30 border border-border/30 rounded-xl'>
                          <div className='flex items-center gap-4'>
                            <div className='w-16 h-16 rounded-full overflow-hidden bg-background border-2 border-border/30 flex-shrink-0'>
                              <img src={logoPreview} alt='Bot logo preview' className='w-full h-full object-cover' />
                            </div>
                            <div className='flex-1'>
                              <p className='text-sm font-medium text-foreground'>Logo Preview</p>
                              <p className='text-xs text-muted-foreground'>This will appear as your chatbot avatar</p>
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={removeLogo}
                              className='text-muted-foreground hover:text-red-500 transition-colors'>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
              <CardHeader className='pb-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center'>
                    <Sparkles className='h-6 w-6 text-emerald-500' />
                  </div>
                  <div>
                    <CardTitle className='text-xl font-semibold text-foreground'>Features</CardTitle>
                    <CardDescription className='text-muted-foreground'>Configure advanced capabilities</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                    <div className='space-y-1'>
                      <Label className='text-sm font-medium text-foreground'>AI Chat</Label>
                      <p className='text-xs text-muted-foreground'>Enable AI-powered responses</p>
                    </div>
                    <Switch
                      checked={selectedChatbot?.widget?.aiChatEnabled || false}
                      onCheckedChange={(checked) => handleInputChange('widget.aiChatEnabled', checked)}
                    />
                  </div>

                  <div className='flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                    <div className='space-y-1'>
                      <Label className='text-sm font-medium text-foreground'>Collect Feedback</Label>
                      <p className='text-xs text-muted-foreground'>Allow users to rate conversations</p>
                    </div>
                    <Switch
                      checked={selectedChatbot?.settings?.collectFeedback || false}
                      onCheckedChange={(checked) => handleInputChange('settings.collectFeedback', checked)}
                    />
                  </div>

                  <div className='flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                    <div className='space-y-1'>
                      <Label className='text-sm font-medium text-foreground'>Regenerate Messages</Label>
                      <p className='text-xs text-muted-foreground'>Allow users to regenerate responses</p>
                    </div>
                    <Switch
                      checked={selectedChatbot?.settings?.allowRegenerate || false}
                      onCheckedChange={(checked) => handleInputChange('settings.allowRegenerate', checked)}
                    />
                  </div>
                  <div className='flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                    <div className='space-y-1'>
                      <Label className='text-sm font-medium text-foreground'>Human Escalation</Label>
                      <p className='text-xs text-muted-foreground'>Allow human to respond</p>
                    </div>
                    <Switch
                      checked={selectedChatbot?.routing?.escalationEnabled || false}
                      onCheckedChange={(checked) => handleInputChange('routing.escalationEnabled', checked)}
                    />
                  </div>

                  <div className='p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='space-y-1 flex-1 w-full'>
                        <Label className='text-sm font-medium text-foreground'>Custom Fallback Response</Label>
                        {!editingFallback && (
                          <p className='text-xs text-muted-foreground'>{selectedChatbot?.settings?.fallbackResponse?.message || 'No fallback message set'}</p>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={startEditingFallback}
                          className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'>
                          <Edit className='h-3 w-3' />
                        </Button>
                        <Switch
                          checked={selectedChatbot?.settings?.fallbackResponse?.status || false}
                          onCheckedChange={(checked) => handleInputChange('settings.fallbackResponse.status', checked)}
                        />
                      </div>
                    </div>

                    {editingFallback && (
                      <div className='space-y-3'>
                        <Input
                          type='text'
                          value={tempFallbackMessage}
                          onChange={(e) => setTempFallbackMessage(e.target.value)}
                          placeholder='Enter fallback response message...'
                          className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200  text-sm'
                        />
                        <div className='flex gap-2 justify-end'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={cancelEditingFallback}
                            className='h-8 px-3 text-muted-foreground hover:text-foreground'>
                            <X className='h-3 w-3 mr-1' />
                            Cancel
                          </Button>
                          <Button size='sm' onClick={saveFallbackMessage} className='h-8 px-3 primary-button'>
                            <Save className='h-3 w-3 mr-1' />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='space-y-1 flex-1 w-full'>
                        <Label className='text-sm font-medium text-foreground'>Custom Popup Message</Label>
                        {!editingPopup && (
                          <p className='text-xs text-muted-foreground '>{selectedChatbot?.settings?.popupMessage?.message || 'No popup message set'}</p>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={startEditingPopup}
                          className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'>
                          <Edit className='h-3 w-3' />
                        </Button>
                        <Switch
                          checked={selectedChatbot?.settings?.popupMessage?.status || false}
                          onCheckedChange={(checked) => handleInputChange('settings.popupMessage.status', checked)}
                        />
                      </div>
                    </div>

                    {editingPopup && (
                      <div className='space-y-3'>
                        <Input
                          value={tempPopupMessage}
                          onChange={(e) => setTempPopupMessage(e.target.value)}
                          placeholder='Enter popup message...'
                          className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200  text-sm'
                        />
                        <div className='flex gap-2 justify-end'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={cancelEditingPopup}
                            className='h-8 px-3 text-muted-foreground hover:text-foreground'>
                            <X className='h-3 w-3 mr-1' />
                            Cancel
                          </Button>
                          <Button size='sm' onClick={savePopupMessage} className='h-8 px-3 primary-button'>
                            <Save className='h-3 w-3 mr-1' />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className='flex gap-4 px-6'>
              <Button onClick={handleReset} variant='outline' className='flex-1'>
                Reset to Default
              </Button>
              <Button
                type='button'
                onClick={handleSave}
                className='flex-1 primary-button focus:border-none focus:outline-none focus:ring-0'
                >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Right Side - Live Preview (Sticky) */}
          <div className='w-full lg:sticky lg:top-0 lg:self-start'>
            <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm flex flex-col'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center'>
                    <MessageSquare className='h-6 w-6 text-green-500' />
                  </div>
                  <div>
                    <CardTitle className='text-xl font-semibold text-foreground'>Live Preview</CardTitle>
                    <CardDescription className='text-muted-foreground'>See your chatbot in action</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='flex-1 flex flex-col p-6'>
                <div className='bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl border border-border/30 flex-1 flex flex-col'>
                  {/* Chatbot Header */}
                  <div
                    className='flex items-center justify-between p-4 border-b-0 rounded-t-2xl shadow-sm relative'
                    style={{ backgroundColor: selectedChatbot?.ui?.primaryColor }}>
                    {/* Background overlay for glassmorphism effect */}
                    <div className='absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-t-2xl' />

                    <div className='flex items-center gap-3 z-10'>
                      <div
                        className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20'
                        style={{ backgroundColor: selectedChatbot?.ui?.primaryColor }}>
                        {selectedChatbot?.ui?.logoUrl ? (
                          <img src={selectedChatbot?.ui?.logoUrl} alt='Bot logo' className='w-full h-full object-cover' />
                        ) : (
                          <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
                            <path d='M12 2L2 7l10 5 10-5-10-5z'></path>
                            <path d='m2 17 10 5 10-5'></path>
                            <path d='m2 12 10 5 10-5'></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className='font-semibold text-white text-base'>{selectedChatbot?.ui?.displayName || 'Customer Support'}</div>
                        <div className='text-xs text-white/90 flex items-center gap-1.5'>
                          <div className='w-2 h-2 bg-green-400 rounded-full' />
                          Online
                        </div>
                      </div>
                    </div>
                    <button className='p-1.5 hover:bg-white/10 rounded-full transition-colors z-10'>
                      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
                        <line x1='18' y1='6' x2='6' y2='18'></line>
                        <line x1='6' y1='6' x2='18' y2='18'></line>
                      </svg>
                    </button>
                  </div>

                  {/* Customer Info Panel */}
                  <div className='bg-gray-50/80 px-4 py-3 border-b border-border/30 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='text-gray-600'>
                        <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
                        <circle cx='12' cy='7' r='4'></circle>
                      </svg>
                      <span className='text-sm font-medium text-gray-700'>Guest User</span>
                    </div>
                    <div className='flex items-center gap-1 text-xs text-gray-500'>
                      <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <circle cx='12' cy='12' r='10'></circle>
                        <polyline points='12,6 12,12 16,14'></polyline>
                      </svg>
                      <span>2 mins ago</span>
                    </div>
                  </div>

                  {/* Chat Messages Area - Scrollable */}
                  <div className='flex-1 p-4 overflow-y-auto bg-white'>
                    <div className='space-y-4'>
                      {/* Bot Initial Message */}
                      <div className='flex items-start gap-2'>
                        <div
                          className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0'
                          style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || '#000000' }}>
                          {selectedChatbot?.ui?.logoUrl ? (
                            <img
                              src={selectedChatbot?.ui?.logoUrl || undefined}
                              alt='Bot avatar'
                              className='w-full h-full object-cover rounded-full'
                            />
                          ) : (
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
                              <path d='M12 2L2 7l10 5 10-5-10-5z'></path>
                              <path d='m2 17 10 5 10-5'></path>
                              <path d='m2 12 10 5 10-5'></path>
                            </svg>
                          )}
                        </div>
                        <div className='flex flex-col max-w-[80%]'>
                          <div
                            className='p-3 rounded-2xl rounded-bl-sm text-sm'
                            style={{
                              backgroundColor: selectedChatbot?.ui?.botColor || '#000000',
                              border: `1px solid ${selectedChatbot?.ui?.botColor || '#000000'}`,
                              color: selectedChatbot?.ui?.botMessageColor || '#000000',
                            }}>
                            {selectedChatbot?.ui?.welcomeMessage || 'Hi! What can I help you with?'}
                          </div>
                          <MessageActionButtons
                            messageId='initial-message'
                            messageText={selectedChatbot?.ui?.welcomeMessage || 'Hi! What can I help you with?'}
                            isBot={true}
                          />
                        </div>
                      </div>

                      {/* Sample User Message */}
                      <div className='flex items-start gap-2 flex-row-reverse'>
                        <div
                          className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold'
                          style={{ backgroundColor: selectedChatbot?.ui?.primaryColor }}>
                          G
                        </div>
                        <div className='flex flex-col max-w-[80%] items-end'>
                          <div className='p-3 rounded-2xl rounded-br-sm text-sm' style={{ backgroundColor: selectedChatbot?.ui?.primaryColor, color: selectedChatbot?.ui?.userMessageColor }}>
                            Hello! I need help with something.
                          </div>
                          <span className='text-xs text-gray-500 mt-2'>{formatTime(new Date())}</span>
                        </div>
                      </div>

                      {/* Sample Bot Response */}
                      <div className='flex items-start gap-2'>
                        <div
                          className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0'
                          style={{ backgroundColor: selectedChatbot?.ui?.primaryColor }}>
                          {selectedChatbot?.ui?.logoUrl ? (
                            <img
                              src={selectedChatbot?.ui?.logoUrl || undefined}
                              alt='Bot avatar'
                              className='w-full h-full object-cover rounded-full'
                            />
                          ) : (
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
                              <path d='M12 2L2 7l10 5 10-5-10-5z'></path>
                              <path d='m2 17 10 5 10-5'></path>
                              <path d='m2 12 10 5 10-5'></path>
                            </svg>
                          )}
                        </div>
                        <div className='flex flex-col max-w-[80%]'>
                          <div
                            className='p-3 rounded-2xl rounded-bl-sm text-sm'
                            style={{
                              backgroundColor: selectedChatbot?.ui?.botColor || '#000000',
                              border: `1px solid ${selectedChatbot?.ui?.botColor || '#000000'}`,
                              color: selectedChatbot?.ui?.botMessageColor || '#000000',
                            }}>
                            I'd be happy to help! What can I assist you with today?
                          </div>
                          <MessageActionButtons
                            messageId='sample-response'
                            messageText="I'd be happy to help! What can I assist you with today?"
                            isBot={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className='border-t border-gray-200 px-4 py-3 bg-white'>
                    <div className='flex items-center justify-between mb-3'>
                      {selectedChatbot?.routing?.escalationEnabled && (
                        <button className='text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-700 transition-colors'>
                          🎧 Talk to Human Agent
                        </button>
                      )}
                      <button className='text-gray-500 hover:text-gray-700 transition-colors ml-auto'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                          <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
                          <polyline points='7,10 12,15 17,10'></polyline>
                          <line x1='12' y1='15' x2='12' y2='3'></line>
                        </svg>
                      </button>
                    </div>

                    {/* Input Section */}
                    <div className='flex items-end gap-2'>
                      <button className='text-gray-500 hover:text-gray-700 transition-colors p-2'>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                          <path d='m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49'></path>
                        </svg>
                      </button>
                      <div className='flex-1 border border-gray-200 rounded-lg bg-white'>
                        <input
                          type='text'
                          placeholder={selectedChatbot?.ui?.messagePlaceholder || 'Type your message...'}
                          className='w-full px-3 py-2 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 outline-none rounded-lg'
                          disabled
                        />
                      </div>
                      <button className='p-2 rounded-lg transition-colors' style={{ backgroundColor: selectedChatbot?.ui?.primaryColor }}>
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2'>
                          <line x1='22' y1='2' x2='11' y2='13'></line>
                          <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Section - Suggested Messages */}
                  
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AppearanceClient;