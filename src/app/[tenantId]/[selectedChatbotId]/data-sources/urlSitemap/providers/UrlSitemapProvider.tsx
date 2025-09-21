'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { useSession } from 'next-auth/react';
import { urlSitemapMachine } from '../machines/urlSitemapMachine';
import { DataSourceDocument } from '@/redux/slices/scrapSlice';
import { Session } from 'next-auth';

interface UrlSitemapProviderProps {
  children: ReactNode;
  tenantId: string;
  chatbotId: string;
  initialDocuments: DataSourceDocument[];
  session: any;
}

interface UrlSitemapContextType {
  state: any;
  send: any;
}

const UrlSitemapContext = createContext<UrlSitemapContextType | null>(null);

export function UrlSitemapProvider({ children, tenantId, chatbotId, initialDocuments, session }: UrlSitemapProviderProps) {
  const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
  const accessToken = (session as any)?.accessToken || (session as any)?.user?.accessToken || '';

  const [state, send] = useMachine(urlSitemapMachine, {
    input: {
      tenantId,
      chatbotId,
      initialDocuments,
      accessToken,
      serverUrl,
    },
  });

  return <UrlSitemapContext.Provider value={{ state, send }}>{children}</UrlSitemapContext.Provider>;
}

export function useUrlSitemap() {
  const context = useContext(UrlSitemapContext);
  if (!context) {
    throw new Error('useUrlSitemap must be used within UrlSitemapProvider');
  }
  return context;
}
