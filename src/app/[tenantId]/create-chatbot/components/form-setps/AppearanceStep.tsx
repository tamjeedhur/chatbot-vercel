import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { ChatbotConfig } from '../MultiStepForm';

interface AppearanceStepProps {
  config: ChatbotConfig;
  onInputChange: (field: string, value: any) => void;
}

export const AppearanceStep = ({ config, onInputChange }: AppearanceStepProps) => {
  return (
    <Card className='bg-card border-border'>
      <CardHeader className='pb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-accent rounded-lg'>
            <Palette className='h-6 w-6 text-accent-foreground' />
          </div>
          <div>
            <CardTitle className='text-2xl text-card-foreground'>Appearance & Theme</CardTitle>
            <CardDescription className='text-muted-foreground text-base'>Customize the visual appearance of your chatbot</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-8'>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <Label className='text-foreground font-medium'>Chat Bubble Alignment</Label>
            <Select value={config.ui.position} onValueChange={(value) => onInputChange('ui.chatBubbleAlignment', value)}>
              <SelectTrigger className='bg-input border-border text-foreground'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-popover border-border'>
                <SelectItem value='left' className='text-popover-foreground'>
                  Left
                </SelectItem>
                <SelectItem value='right' className='text-popover-foreground'>
                  Right
                </SelectItem>
                <SelectItem value='center' className='text-popover-foreground'>
                  Center
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-3'>
            <Label htmlFor='autoShowDelay' className='text-foreground font-medium'>
              Auto Show Delay (seconds)
            </Label>
            <Input
              id='autoShowDelay'
              type='number'
              value={(config as any).autoShowDelay || ''}
              onChange={(e) => onInputChange('autoShowDelay', e.target.value)}
              className='bg-input border-border text-foreground'
              min='0'
              max='60'
            />
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <Label htmlFor='userMessageColor' className='text-foreground font-medium'>
              User Message Color
            </Label>
            <div className='flex gap-3 items-center'>
              <input
                type='color'
                id='userMessageColor'
                value={(config as any).userMessageColor || '#3B82F6'}
                onChange={(e) => onInputChange('userMessageColor', e.target.value)}
                className='w-12 h-12 rounded-lg border border-border bg-background cursor-pointer'
              />
              <Input
                value={(config as any).userMessageColor || '#3B82F6'}
                onChange={(e) => onInputChange('userMessageColor', e.target.value)}
                className='bg-input border-border text-foreground'
              />
            </div>
          </div>

          <div className='space-y-3'>
            <Label htmlFor='chatBubbleColor' className='text-foreground font-medium'>
              Chat Bubble Color
            </Label>
            <div className='flex gap-3 items-center'>
              <input
                type='color'
                id='chatBubbleColor'
                value={(config as any).chatBubbleColor || '#000000'}
                onChange={(e) => onInputChange('chatBubbleColor', e.target.value)}
                className='w-12 h-12 rounded-lg border border-border bg-background cursor-pointer'
              />
              <Input
                value={(config as any).chatBubbleColor || '#000000'}
                onChange={(e) => onInputChange('chatBubbleColor', e.target.value)}
                className='bg-input border-border text-foreground'
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
