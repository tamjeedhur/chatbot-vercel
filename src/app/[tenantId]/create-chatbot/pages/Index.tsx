'use client'
import { Bot, Sparkles } from 'lucide-react';
import { MultiStepForm } from '../components/MultiStepForm'

const Index = () => { 
  return (
    <div className='min-h-screen bg-background p-6'>
      <div className=' space-y-8'>
        {/* Header with Theme Toggle */}
        <div className='text-center space-y-6 py-12 relative'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            <div className='relative'>
              <Bot className='h-12 w-12 text-purple-400' />
              <Sparkles className='h-5 w-5 text-purple-300 absolute -top-1 -right-1' />
            </div>
            <h1 className='text-5xl font-bold text-foreground'>Chatbot Builder</h1>
          </div>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            Create and customize your AI chatbot with cutting-edge design and advanced features
          </p>
        </div>
        <MultiStepForm  />
      </div>
    </div>
  );
};

export default Index;
