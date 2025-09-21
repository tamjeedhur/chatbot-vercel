import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, MessageSquare, Plus, Trash2, Bot } from 'lucide-react';
import { ChatbotConfig } from '../MultiStepForm';

interface BasicConfigurationAndMessagesStepProps {
  config: ChatbotConfig;
  onInputChange: (field: string, value: any) => void;
}

export const BasicConfigurationAndMessagesStep = ({ config, onInputChange }: BasicConfigurationAndMessagesStepProps) => {
  const [newSuggestedMessage, setNewSuggestedMessage] = useState('');

  const addSuggestedMessage = () => {
    if (newSuggestedMessage.trim()) {
      onInputChange('ui.suggestedMessages', [...config.ui.suggestedMessages, newSuggestedMessage.trim()]);
      setNewSuggestedMessage('');
    }
  };

  const removeSuggestedMessage = (index: number) => {
    onInputChange(
      'ui.suggestedMessages',
      config.ui.suggestedMessages.filter((_, i) => i !== index)
    );
  };

  return (
    <div className='space-y-12'>
      {/* Basic Configuration */}
      <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
        <CardHeader className='pb-8'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center'>
              <Settings className='h-6 w-6 text-purple-500' />
            </div>
            <div>
              <CardTitle className='text-xl font-semibold text-foreground'>Basic Configuration</CardTitle>
              <CardDescription className='text-muted-foreground'>Configure the fundamental settings for your chatbot</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='space-y-3'>
              <Label htmlFor='name' className='text-sm font-medium text-foreground'>
                Chatbot Name
              </Label>
              <Input
                id='name'
                value={config.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'
              />
            </div>
            <div className='space-y-3'>
              <Label htmlFor='displayName' className='text-sm font-medium text-foreground'>
                Display Name
              </Label>
              <Input
                id='displayName'
                value={config.ui.displayName}
                onChange={(e) => onInputChange('ui.displayName', e.target.value)}
                className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'
              />
            </div>
          </div>
          <div className='space-y-3'>
            <Label htmlFor='initialMessages' className='text-sm font-medium text-foreground'>
             Welcome Message
            </Label>
            <Textarea
              id='initialMessages'
              value={config.ui.welcomeMessage}
              onChange={(e) => onInputChange('ui.welcomeMessage', e.target.value)}
              className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 min-h-[100px] resize-none'
              placeholder='Enter the greeting message for your chatbot'
            />
          </div>

          <div className='space-y-3'>
            <Label htmlFor='messagePlaceholder' className='text-sm font-medium text-foreground'>
              Message Placeholder
            </Label>
                          <Input
                id='messagePlaceholder'
                value={config.ui.messagePlaceholder}
                onChange={(e) => onInputChange('ui.messagePlaceholder', e.target.value)}
                className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'
              />
          </div>
        </CardContent>
      </Card>

      {/* Suggested Messages */}
      <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
        <CardHeader className='pb-8'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center'>
              <MessageSquare className='h-6 w-6 text-green-500' />
            </div>
            <div>
              <CardTitle className='text-xl font-semibold text-foreground'>Suggested Messages</CardTitle>
              <CardDescription className='text-muted-foreground'>Add quick response options for users</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-8'>
          <div className='flex gap-3'>
            <Input
              value={newSuggestedMessage}
              onChange={(e) => setNewSuggestedMessage(e.target.value)}
              placeholder='Add a suggested message...'
              className='border-border/50 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200'
              onKeyPress={(e) => e.key === 'Enter' && addSuggestedMessage()}
            />
            <Button
              onClick={addSuggestedMessage}
              className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm hover:shadow-md transition-all duration-200'>
              <Plus className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-3'>
            {(config.ui.suggestedMessages ?? []).map((message, index) => (
              <div
                key={index}
                className='group flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                <span className='text-foreground'>{message}</span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => removeSuggestedMessage(index)}
                  className='opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all duration-200'>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
            {(config.ui.suggestedMessages ?? []).length === 0 && (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4'>
                  <Bot className='h-8 w-8 text-muted-foreground' />
                </div>
                <p className='text-muted-foreground'>No suggested messages yet</p>
                <p className='text-sm text-muted-foreground/70'>Add one above to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
