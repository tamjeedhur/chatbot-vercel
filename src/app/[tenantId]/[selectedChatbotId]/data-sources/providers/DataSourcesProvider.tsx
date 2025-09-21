'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { dataSourcesMachine } from '@/machines/dataSources/dataSourcesMachine';
import { Document } from '@/machines/dataSources/types';

interface DataSourcesProviderProps {
  children: ReactNode;
  initialDocuments: Document[];
  tenantId: string;
  chatbotId: string;
}

interface DataSourcesContextType {
  state: any;
  send: any;
}

const DataSourcesContext = createContext<DataSourcesContextType | null>(null);

export function DataSourcesProvider({ children, initialDocuments, tenantId, chatbotId }: DataSourcesProviderProps) {
  const [state, send] = useMachine(dataSourcesMachine, {
    input: {
      initialDocuments,
      tenantId,
      chatbotId,
    },
  });

  return <DataSourcesContext.Provider value={{ state, send }}>{children}</DataSourcesContext.Provider>;
}

export function useDataSources() {
  const context = useContext(DataSourcesContext);
  if (!context) {
    throw new Error('useDataSources must be used within DataSourcesProvider');
  }
  return context;
}
