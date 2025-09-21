import { useRouter } from 'next/navigation';
import { useMachine } from '@xstate/react';
import { chatbotFormMachine, ChatbotFormContext } from '@/machines/chatbotFormMachine';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { BasicConfigurationAndMessagesStep } from './form-setps/BasicConfigurationAndMessagesStep';
import { AppearanceAndFeaturesStep } from './form-setps/AppearanceAndFeaturesStep';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import React from 'react';

const steps = [
  {
    id: 1,
    title: 'Basic Setup',
    description: 'Configure chatbot basics and suggested messages',
  },
  {
    id: 2,
    title: 'Appearance & Features',
    description: 'Customize appearance and configure features',
  },
];

export interface DataSource {
  id: string;
  type: 'website' | 'document' | 'api' | 'database' | 'knowledge-base';
  name: string;
  url?: string;
  apiKey?: string;
  description?: string;
  enabled: boolean;
}

export interface ChatbotConfig extends ChatbotFormContext {}

export const MultiStepForm = () => {
  const router = useRouter();
  const [state, send] = useChatBotMachineState();
  const [formState, formSend] = useMachine(chatbotFormMachine);
  const stepIndex = formState.value === 'step1' ? 0 : formState.value === 'step2' ? 1 : 0;
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      const currentSection = formState.context[section as keyof ChatbotFormContext] as any;
      formSend({
        type: 'UPDATE_FIELD',
        field: section as keyof ChatbotFormContext,
        value: { ...currentSection, [key]: value },
      });
    } else {
      formSend({
        type: 'UPDATE_FIELD',
        field: field as keyof ChatbotFormContext,
        value,
      });
    }
  };

  const nextStep = () => formSend({ type: 'NEXT' });
  const prevStep = () => formSend({ type: 'PREV' });

  if (state.matches('success') && state.context.chatbotResponse) {
    router.push(`/${state.context.tenantId}/${state.context.selectedChatbot?._id}/dashboard`);
    // TODO: Clear chatbot creation state if needed
  }

  const handleSubmit = async () => {
    if (formState.value === 'completed' || state.matches('creatingChatbot')) {
      return;
    }
    const chatbotData = {
      ...formState.context,
      _id: '', // Temporary ID that will be replaced by the server
    } as any;

    send({ type: 'CREATE_CHATBOT', data: chatbotData });
  };

  const renderStep = () => {
    switch (formState.value) {
      case 'step1':
        return <BasicConfigurationAndMessagesStep config={formState.context} onInputChange={handleInputChange} />;
      case 'step2':
        return <AppearanceAndFeaturesStep config={formState.context} onInputChange={handleInputChange} />;
      default:
        return <BasicConfigurationAndMessagesStep config={formState.context} onInputChange={handleInputChange} />;
    }
  };

  return (
    <div className='max-w-7xl mx-auto space-y-12'>
      {/* Modern Progress Header */}
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl' />
        <Card className='relative border-0 shadow-sm bg-background/80 backdrop-blur-sm'>
          <CardHeader className='pb-8'>
            <div className='flex items-center justify-between mb-6'>
              <div className='space-y-2'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-medium'>
                    {stepIndex + 1}
                  </div>
                  <CardTitle className='text-2xl font-semibold text-foreground'>{steps[stepIndex].title}</CardTitle>
                </div>
                <CardDescription className='text-base text-muted-foreground ml-11'>{steps[stepIndex].description}</CardDescription>
              </div>
              <div className='text-right space-y-1'>
                <div className='text-sm text-muted-foreground'>Progress</div>
                <div className='text-2xl font-bold text-foreground'>{Math.round(progress)}%</div>
              </div>
            </div>
            <Progress value={progress} className='h-2 bg-muted' />
          </CardHeader>
        </Card>
      </div>

      {/* Minimalistic Step Navigation */}
      <div className='flex justify-center'>
        <div className='flex items-center gap-8'>
          {steps.map((step, idx) => (
            <div key={step.id} className='flex items-center gap-3'>
              <div className='flex items-center gap-4'>
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx < stepIndex
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : idx === stepIndex
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                      : 'bg-muted'
                  }`}
                />
                <div className='hidden sm:block'>
                  <div className={`text-sm font-medium transition-colors ${idx <= stepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
              </div>
              {step.id < steps.length && <div className='w-16 h-px bg-border hidden sm:block' />}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className='min-h-[600px]'>{renderStep()}</div>

      {/* Clean Navigation */}
      <div className='flex justify-between items-center pt-8 border-t border-border/50'>
        <Button
          variant='ghost'
          onClick={prevStep}
          disabled={stepIndex === 0}
          className='flex items-center gap-2 text-muted-foreground hover:text-foreground disabled:opacity-50'>
          <ChevronLeft className='h-4 w-4' />
          Previous
        </Button>

        <div className='flex gap-3'>
          {stepIndex < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!formState.can({ type: 'NEXT' })}
              className='bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2'>
              Next
              <ChevronRight className='h-4 w-4' />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={state.matches('creatingChatbot')}
              className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2'>
              {state.matches('creatingChatbot') ? (
                <>
                  <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className='h-4 w-4' />
                  Complete Setup
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
