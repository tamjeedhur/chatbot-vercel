'use server';
import React, { ReactNode } from 'react';
import ThemeToggleWrapper from './ThemeToggleWrapper';
import { Toaster } from '@/components/ui/sonner';

function DefaultAuthLayout(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div className='min-h-screen w-full bg-background text-foreground'>
      <header className='flex h-12 items-center justify-end mb-6'>
        <ThemeToggleWrapper />
      </header>
      <div className='mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-start px-6 py-10 lg:px-12'>{children}</div>
      <Toaster richColors position='bottom-right' />
    </div>
  );
}

export default DefaultAuthLayout;
