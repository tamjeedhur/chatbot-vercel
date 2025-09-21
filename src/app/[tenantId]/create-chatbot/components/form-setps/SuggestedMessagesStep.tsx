import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { ChatbotConfig } from '../MultiStepForm';

interface SuggestedMessagesStepProps {
  config: ChatbotConfig;
  onInputChange: (field: string, value: any) => void;
}

export const SuggestedMessagesStep = ({ config, onInputChange }: SuggestedMessagesStepProps) => {
  const [newSuggestedMessage, setNewSuggestedMessage] = useState('');

  const addSuggestedMessage = () => {
    if (newSuggestedMessage.trim()) {
      onInputChange('suggestedMessages', [...((config as any).suggestedMessages || []), newSuggestedMessage.trim()]);
      setNewSuggestedMessage('');
    }
  };

  const removeSuggestedMessage = (index: number) => {
    onInputChange(
      'suggestedMessages',
      (config as any).suggestedMessages.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <Card className='bg-card border-border'>
      <CardHeader className='pb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-green-500/20 rounded-lg'>
            <MessageSquare className='h-6 w-6 text-green-400' />
          </div>
          <div>
            <CardTitle className='text-2xl text-card-foreground'>Suggested Messages</CardTitle>
            <CardDescription className='text-muted-foreground text-base'>Add quick response options for users</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex gap-3'>
          <Input
            value={newSuggestedMessage}
            onChange={(e) => setNewSuggestedMessage(e.target.value)}
            placeholder='Add a suggested message...'
            className='bg-input border-border text-foreground placeholder:text-muted-foreground'
            onKeyPress={(e) => e.key === 'Enter' && addSuggestedMessage()}
          />
          <Button onClick={addSuggestedMessage} className='bg-green-600 hover:bg-green-700 text-white px-6'>
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-y-3'>
          {(config as any).suggestedMessages.map((message: any, index: number) => (
            <div key={index} className='flex items-center justify-between p-4 bg-muted border border-border rounded-xl'>
              <span className='text-card-foreground'>{message}</span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => removeSuggestedMessage(index)}
                className='text-red-400 hover:text-red-300 hover:bg-red-500/10'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
          {(config as any).suggestedMessages.length === 0 && (
            <div className='text-center py-8 text-muted-foreground'>No suggested messages yet. Add one above to get started.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
