import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { ChatbotConfig } from '../MultiStepForm';

interface BasicConfigurationStepProps {
  config: ChatbotConfig;
  onInputChange: (field: string, value: any) => void;
}

export const BasicConfigurationStep = ({ config, onInputChange }: BasicConfigurationStepProps) => {
  return (
    <Card className='bg-card border-border'>
      <CardHeader className='pb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-purple-500/20 rounded-lg'>
            <Settings className='h-6 w-6 text-purple-400' />
          </div>
          <div>
            <CardTitle className='text-2xl text-card-foreground'>Basic Configuration</CardTitle>
            <CardDescription className='text-muted-foreground text-base'>Configure the fundamental settings for your chatbot</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-8'>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <Label htmlFor='name' className='text-foreground font-medium'>
              Chatbot Name
            </Label>
            <Input
              id='name'
              value={config.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className='bg-input border-border text-foreground placeholder:text-muted-foreground'
            />
          </div>
          <div className='space-y-3'>
            <Label htmlFor='displayName' className='text-foreground font-medium'>
              Display Name
            </Label>
            <Input
              id='displayName'
              value={(config as any).displayName || ''}
              onChange={(e) => onInputChange('displayName', e.target.value)}
              className='bg-input border-border text-foreground placeholder:text-muted-foreground'
            />
          </div>
        </div>

        <div className='space-y-3'>
          <Label htmlFor='userEmail' className='text-foreground font-medium'>
            User Email (Context)
          </Label>
          <Input id='userEmail' value={(config as any).userEmail || ''} disabled className='bg-muted border-border text-muted-foreground' />
        </div>

        <div className='space-y-3'>
          <Label htmlFor='initialMessages' className='text-foreground font-medium'>
            Initial Message
          </Label>
          <Textarea
            id='initialMessages'
            value={(config as any).initialMessages || ''}
            onChange={(e) => onInputChange('initialMessages', e.target.value)}
            className='bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[100px]'
            placeholder='Enter the greeting message for your chatbot'
          />
        </div>

        <div className='space-y-3'>
          <Label htmlFor='messagePlaceholder' className='text-foreground font-medium'>
            Message Placeholder
          </Label>
          <Input
            id='messagePlaceholder'
            value={(config as any).messagePlaceholder || ''}
            onChange={(e) => onInputChange('messagePlaceholder', e.target.value)}
            className='bg-input border-border text-foreground placeholder:text-muted-foreground'
          />
        </div>
      </CardContent>
    </Card>
  );
};
