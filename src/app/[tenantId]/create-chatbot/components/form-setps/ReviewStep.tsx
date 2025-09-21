import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { toast } from 'sonner';

interface ReviewStepProps {
  formData: any;
  onSubmit: () => void;
}

export default function ReviewStep({ formData, onSubmit }: ReviewStepProps) {
  const [state, send] = useChatBotMachineState();

  const handleCreateChatbot = () => {
    // Ensure the formData includes the organizationId
    const chatbotData: any = {
      ...formData,
      organizationId: (state.context as any).organization?.id || '',
    };

    send({ type: 'CREATE_CHATBOT', data: chatbotData });
  };

  const isLoading = state.context.isLoading;
  const error = state.context.error;
  const success = state.matches('success');

  return (
    <Card className='bg-card border-border'>
      <CardHeader className='pb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-green-500/20 rounded-lg'>
            <CheckCircle className='h-6 w-6 text-green-400' />
          </div>
          <div>
            <CardTitle className='text-2xl text-card-foreground'>Review Configuration</CardTitle>
            <CardDescription className='text-muted-foreground text-base'>Review your chatbot settings before saving</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-4'>
            <div>
              <h3 className='font-medium text-card-foreground mb-2'>Basic Information</h3>
              <div className='space-y-2 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Name:</span> {formData.name}
                </div>
                <div>
                  <span className='text-muted-foreground'>Display Name:</span> {formData.displayName}
                </div>
                <div>
                  <span className='text-muted-foreground'>User Email:</span> {formData.userEmail}
                </div>
                <div>
                  <span className='text-muted-foreground'>Placeholder:</span> {formData.messagePlaceholder}
                </div>
              </div>
            </div>

            <div>
              <h3 className='font-medium text-card-foreground mb-2'>Appearance</h3>
              <div className='space-y-2 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Alignment:</span> {formData.chatBubbleAlignment}
                </div>
                <div>
                  <span className='text-muted-foreground'>Auto Show Delay:</span> {formData.autoShowDelay}s
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground'>User Color:</span>
                  <div className='w-4 h-4 rounded' style={{ backgroundColor: formData.userMessageColor }}></div>
                  <span className='text-xs'>{formData.userMessageColor}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-muted-foreground'>Bubble Color:</span>
                  <div className='w-4 h-4 rounded' style={{ backgroundColor: formData.chatBubbleColor }}></div>
                  <span className='text-xs'>{formData.chatBubbleColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <h3 className='font-medium text-card-foreground mb-2'>Features</h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Badge variant={formData.aiChat ? 'default' : 'secondary'}>{formData.aiChat ? 'Enabled' : 'Disabled'}</Badge>
                  <span className='text-sm text-muted-foreground'>AI Chat</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant={formData.collectUserFeedback ? 'default' : 'secondary'}>
                    {formData.collectUserFeedback ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <span className='text-sm text-muted-foreground'>User Feedback</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant={formData.regenerateMessages ? 'default' : 'secondary'}>
                    {formData.regenerateMessages ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <span className='text-sm text-muted-foreground'>Regenerate Messages</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className='font-medium text-card-foreground mb-2'>Suggested Messages ({formData.suggestedMessages.length})</h3>
              <div className='space-y-2 max-h-32 overflow-y-auto'>
                {formData.suggestedMessages.map((message: any, index: number) => (
                  <div key={index} className='text-sm p-2 bg-muted rounded text-card-foreground'>
                    {message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='border-t pt-6'>
          <div className='bg-muted p-4 rounded-lg'>
            <h3 className='font-medium text-card-foreground mb-2'>Initial Message</h3>
            <p className='text-sm text-muted-foreground italic'>"{formData.initialMessages}"</p>
          </div>
        </div>

        <div className='flex justify-center pt-4'>
          <Button
            onClick={handleCreateChatbot}
            className='bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-lg font-semibold'
            size='lg'
            disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Chatbot'}
            <Sparkles className='mr-2 h-5 w-5' />
          </Button>
        </div>
      </CardContent>

      {/* Error handling */}
      {error && (
        <div className='error'>
          <p>Error: {error}</p>
          <button onClick={() => send({ type: 'RETRY' })}>Try Again</button>
        </div>
      )}

      {/* Success handling */}
      {success && (
        <div className='success'>
          <p>Chatbot created successfully!</p>
          <button onClick={() => send({ type: 'RESET' })}>Create Another Chatbot</button>
        </div>
      )}
    </Card>
  );
}
