import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { ChatbotConfig } from '../MultiStepForm';

interface FeaturesStepProps {
  config: ChatbotConfig;
  onInputChange: (field: string, value: any) => void;
}

export const FeaturesStep = ({ config, onInputChange }: FeaturesStepProps) => {
  return (
    <Card className='bg-card border-border'>
      <CardHeader className='pb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-500/20 rounded-lg'>
            <Bot className='h-6 w-6 text-blue-400' />
          </div>
          <div>
            <CardTitle className='text-2xl text-card-foreground'>Features & Behavior</CardTitle>
            <CardDescription className='text-muted-foreground text-base'>Configure advanced chatbot features</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-8'>
        <div className='grid gap-6'>
          <div className='flex items-center justify-between p-4 bg-muted border border-border rounded-xl'>
            <div className='space-y-1'>
              <Label className='text-card-foreground font-medium'>AI Chat</Label>
              <p className='text-sm text-muted-foreground'>Enable AI-powered responses</p>
            </div>
            <Switch checked={(config as any).aiChat || false} onCheckedChange={(checked) => onInputChange('aiChat', checked)} />
          </div>

          <div className='flex items-center justify-between p-4 bg-muted border border-border rounded-xl'>
            <div className='space-y-1'>
              <Label className='text-card-foreground font-medium'>Collect User Feedback</Label>
              <p className='text-sm text-muted-foreground'>Allow users to rate conversations</p>
            </div>
            <Switch
              checked={(config as any).collectUserFeedback || false}
              onCheckedChange={(checked) => onInputChange('collectUserFeedback', checked)}
            />
          </div>

          <div className='flex items-center justify-between p-4 bg-muted border border-border rounded-xl'>
            <div className='space-y-1'>
              <Label className='text-card-foreground font-medium'>Regenerate Messages</Label>
              <p className='text-sm text-muted-foreground'>Allow users to regenerate AI responses</p>
            </div>
            <Switch
              checked={(config as any).regenerateMessages || false}
              onCheckedChange={(checked) => onInputChange('regenerateMessages', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
