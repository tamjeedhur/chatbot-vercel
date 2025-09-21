'use client';

import React, { createContext, useContext } from 'react';
import { useMachine } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { useSession } from 'next-auth/react';
import { conversationMachine, Conversation } from '@/machines/conversation-machine';

type ConversationMachineService = ActorRefFrom<typeof conversationMachine>;

interface ConversationContextType {
  conversationService: ConversationMachineService;
  state: any;
  send: any;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

interface ConversationProviderProps {
  children: React.ReactNode;
  initialConversations: Conversation[];
  selectedConversation?: Conversation | null;
  tenantId: string;
  chatbotId: string;
}

export function ConversationProvider({ 
  children, 
  initialConversations, 
  selectedConversation, 
  tenantId, 
  chatbotId 
}: ConversationProviderProps) {
  const { data: session } = useSession();

  const [state, send, conversationService] = useMachine(conversationMachine, {
    input: {
      initialConversations,
      selectedConversation,
    },
  });

  return (
    <ConversationContext.Provider value={{ state, send, conversationService }}>
      {children}
    </ConversationContext.Provider>
  );
}

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return [context.state, context.send, context.conversationService] as const;
};
