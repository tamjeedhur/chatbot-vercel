'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useMachine} from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { useSession } from 'next-auth/react';
import tenantMachine from '@/machines/tenantsMachine/tenantMachine';
import type { Session } from 'next-auth';
import { useServerSession } from '@/components/SessionWrapper';
import { useSelector as useReduxSelector } from 'react-redux';
import { selectTenant } from '@/redux/slices/tenantSlice';

interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
  };
  tenant?: any;
  tenantId?: string | null;
  chatbots?: any;
  selectedChatbot?: any;
}

type TenantMachineService = ActorRefFrom<typeof tenantMachine>;

interface TenantMachineContextType {
  tenantService: TenantMachineService;
  state: any;
  send: any;
}

const TenantMachineContext = createContext<TenantMachineContextType | null>(null); 

export const useTenantMachineState = () => {
  const context = useContext(TenantMachineContext);
  if (!context) {
    throw new Error('useTenantMachineState must be used within TenantMachineProvider');
  }
  return [context.state, context.send, context.tenantService] as const;
};

export const TenantMachineProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: string;
  };

 

  const serverSession = useServerSession();
  const effectiveSession = session || serverSession;
  const reduxSelectedTenant = useReduxSelector(selectTenant);

  const [state, send, tenantService] = useMachine(tenantMachine, {
    input: {
      tenantId: effectiveSession?.tenantId as string,
      tenant: reduxSelectedTenant || (effectiveSession as any)?.tenant || null,
    },
  });

  // Sync machine with Redux when Redux state changes (like on refresh)
  React.useEffect(() => {
    if (reduxSelectedTenant && (!state.context.tenant || 
        reduxSelectedTenant.updatedAt !== state.context.tenant?.updatedAt)) {
      // Update the machine context with the Redux tenant data
      send({ type: 'SYNC_TENANT', data: reduxSelectedTenant });
    }
  }, [reduxSelectedTenant, state.context.tenant, send]);

  return <TenantMachineContext.Provider value={{ state, send, tenantService }}>{children}</TenantMachineContext.Provider>;
};
