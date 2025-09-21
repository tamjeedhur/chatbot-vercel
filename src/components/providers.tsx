'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/redux/store';
import { LeadFormProvider } from '@/context/LeadFormContext';
import { SessionHydrator } from './SessionHydrator';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { CustomSession } from '@/types/interfaces';
import { Theme } from '@/app/actions/theme';

export function Providers({ 
  children,
  session,
  theme
}: { 
  children: React.ReactNode;
  session: CustomSession | null;
  theme: Theme;
}) {
  return (
    <ThemeProvider initialTheme={theme}>
      <SessionProvider>
        <ReduxProvider store={store}>
          <SessionHydrator session={session} />
          <LeadFormProvider>
            {children}
          </LeadFormProvider>
        </ReduxProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
