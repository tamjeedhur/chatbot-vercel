'use client';

import React, { createContext, useContext} from 'react';
import { useMachine} from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import { useSession } from 'next-auth/react';
import chatBotMachine from '@/machines/chatBotMachine/chatBotMachine';
import type { Session } from 'next-auth';
import { useServerSession } from '@/components/SessionWrapper';
import { useSelector as useReduxSelector } from 'react-redux';
import { selectSelectedChatbot } from '@/redux/slices/chatbotSlice';

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

type ChatBotMachineService = ActorRefFrom<typeof chatBotMachine>;

interface ChatBotMachineContextType {
  chatBotService: ChatBotMachineService;
  state: any;
  send: any;
}

const ChatBotMachineContext = createContext<ChatBotMachineContextType | null>(null); 

export const useChatBotMachineState = () => {
  const context = useContext(ChatBotMachineContext);
  if (!context) {
    throw new Error('useChatBotMachineState must be used within ChatBotMachineProvider');
  }
  return [context.state, context.send, context.chatBotService] as const;
};

interface ChatBotMachineProviderProps {
  children: React.ReactNode;
  tenant?: any;
}

export function ChatBotMachineProvider({ 
  children, 
  tenant,
}: ChatBotMachineProviderProps) {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: string;
  };

  const defaultChatbots = [
    {
      _id: '1',
      name: 'Support Assistant',
      description: 'Customer support chatbot for handling common inquiries',
      status: 'active',
      ui: {
        theme: 'light',
        primaryColor: '#3B82F6',
        botColor: '#000000',
        welcomeMessage: 'Hi! How can I help you today?',
        logoUrl: '',
        position: 'bottom-right',
        customCss: '',
        displayName: 'Support Assistant',
        messagePlaceholder: 'Type your message...',
        suggestedMessages: [],
      },
      widget: {
        enabled: true,
        widgetKey: 'support-assistant',
        allowAnonymous: true,
        allowedOrigins: [],
        autoShowDelay: 0,
        aiChatEnabled: true,
      },
      settings: {
        welcomeMessage: 'Hi! How can I help you today?',
        aiModel: 'gpt-3.5-turbo',
        popupMessage: {
          message: 'Need help? Chat with us!',
          status: true,
        },
        fallbackResponse: {
          message: 'I apologize, but I cannot help with that request.',
          status: true,
        },
        aiChat: true,
        maxMessagesPerConversation: 50,
        autoEscalateThreshold: 3,
        collectFeedback: true,
        allowRegenerate: true,
      },
    },
    {
      _id: '2',
      name: 'Sales Bot',
      description: 'Lead qualification and product information assistant',
      status: 'draft',
      ui: {
        theme: 'light',
        primaryColor: '#10B981',
        botColor: '#000000',
        welcomeMessage: 'Hello! I can help you with product information.',
        logoUrl: '',
        position: 'bottom-right',
        customCss: '',
        displayName: 'Sales Assistant',
        messagePlaceholder: 'Ask about our products...',
        suggestedMessages: [],
      },
      widget: {
        enabled: true,
        widgetKey: 'sales-bot',
        allowAnonymous: true,
        allowedOrigins: [],
        autoShowDelay: 0,
        aiChatEnabled: true,
      },
      settings: {
        welcomeMessage: 'Hello! I can help you with product information.',
        aiModel: 'gpt-3.5-turbo',
        popupMessage: {
          message: 'Learn about our products!',
          status: true,
        },
        fallbackResponse: {
          message: 'I apologize, but I cannot help with that request.',
          status: true,
        },
        aiChat: true,
        maxMessagesPerConversation: 50,
        autoEscalateThreshold: 3,
        collectFeedback: true,
        allowRegenerate: true,
      },
    },
    {
      _id: '3',
      name: 'FAQ Helper',
      description: 'Automated FAQ responses for website visitors',
      status: 'paused',
      ui: {
        theme: 'light',
        primaryColor: '#8B5CF6',
        botColor: '#000000',
        welcomeMessage: 'Hi! I can answer your frequently asked questions.',
        logoUrl: '',
        position: 'bottom-right',
        customCss: '',
        displayName: 'FAQ Helper',
        messagePlaceholder: 'Ask a question...',
        suggestedMessages: [],
      },
      widget: {
        enabled: true,
        widgetKey: 'faq-helper',
        allowAnonymous: true,
        allowedOrigins: [],
        autoShowDelay: 0,
        aiChatEnabled: true,
      },
      settings: {
        welcomeMessage: 'Hi! I can answer your frequently asked questions.',
        aiModel: 'gpt-3.5-turbo',
        popupMessage: {
          message: 'Have questions? Ask me!',
          status: true,
        },
        fallbackResponse: {
          message: 'I apologize, but I cannot help with that request.',
          status: true,
        },
        aiChat: true,
        maxMessagesPerConversation: 50,
        autoEscalateThreshold: 3,
        collectFeedback: true,
        allowRegenerate: true,
      },
    },
  ];

  const serverSession = useServerSession();
  const effectiveSession = session || serverSession;
  const reduxSelectedChatbot = useReduxSelector(selectSelectedChatbot);

  const [state, send, chatBotService] = useMachine(chatBotMachine, {
    input: {
      tenantId: effectiveSession?.tenantId || null,
      userId: effectiveSession?.user?.id || null,
      accessToken: (effectiveSession as any)?.accessToken || (effectiveSession?.user as any)?.accessToken || null,
      chatbots: effectiveSession?.chatbots || null,
      defaultChatbots: defaultChatbots,
      selectedChatbot: (effectiveSession as any)?.selectedChatbot || null,
      error: null,
      isLoading: false,
    },
  });

 
//TODO: Remove this after testing
  // Sync machine with Redux when Redux state changes (like on refresh)
  React.useEffect(() => {
    if (reduxSelectedChatbot && (!state.context.selectedChatbot || 
        (reduxSelectedChatbot as any).updatedAt !== (state.context.selectedChatbot as any)?.updatedAt)) {
      send({ type: 'SYNC_SELECTED_CHATBOT', data: reduxSelectedChatbot as any });
    }
  }, [reduxSelectedChatbot, state.context.selectedChatbot, send]);

  return <ChatBotMachineContext.Provider value={{ state, send, chatBotService }}>{children}</ChatBotMachineContext.Provider>;
};
