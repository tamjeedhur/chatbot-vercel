'use client';

import React, { ReactNode, createContext, useContext, useLayoutEffect } from 'react';
import { CustomSession } from '@/types/interfaces';
import { Chatbot } from '@/types/chatbotConfiguration';
import { useDispatch } from 'react-redux';
import { setChatbots, setSelectedChatbot, clearSelectedChatbot } from '@/redux/slices/chatbotSlice';
import { setUser } from '@/redux/slices/userSlice';
import { setTenant, Tenant } from '@/redux/slices/tenantSlice';

interface ServerSessionContextType {
  serverSession: CustomSession | null;
}

const ServerSessionContext = createContext<ServerSessionContextType | undefined>(undefined);

export const useServerSession = () => {
  const context = useContext(ServerSessionContext);
  if (context === undefined) {
    throw new Error('useServerSession must be used within SessionWrapper');
  }
  return context.serverSession;
};

interface SessionWrapperProps {
  children: React.ReactNode;
  session: CustomSession | null;
  tenant?: Tenant;
  chatbots?: Chatbot[];
  selectedChatbot?: Chatbot;
}

export default function SessionWrapper({
  children,
  session,
  tenant,
  chatbots,
  selectedChatbot,
}: SessionWrapperProps) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // Dispatch user data only (not full session)
    if (session?.user) {
      dispatch(setUser({
        user: session.user,
        tenantId: (session.tenantId || session.user.tenantId) as string,
        accessToken: session.accessToken || '',
        refreshToken: session.refreshToken || '',
      }));
    }
    
    // Dispatch tenant data
    if (tenant) {
      dispatch(setTenant(tenant));
    }
    
    // Dispatch chatbot data
    if (chatbots && Array.isArray(chatbots)) {
      dispatch(setChatbots(chatbots));
    }
    // Dispatch selectedChatbot or clear it
    if (selectedChatbot) {
      dispatch(setSelectedChatbot(selectedChatbot));
    } else {
      dispatch(clearSelectedChatbot());
    }
  }, [session, tenant, chatbots, selectedChatbot, dispatch]);

  return <ServerSessionContext.Provider value={{ serverSession: session }}>{children}</ServerSessionContext.Provider>;
}
