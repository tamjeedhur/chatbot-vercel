'use client';

import React from 'react';
import { ChatbotConfigurationForm } from '@/components/client/ChatbotConfigurationForm';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { useSelector } from 'react-redux';
import { selectSelectedChatbot } from '@/redux/slices/chatbotSlice';
import { Server_URL } from '@/utils/constants';

interface ChatbotConfigurationPageClientProps {
  selectedChatbotId: string;
  session: any;
}

export function ChatbotConfigurationPageClient({ selectedChatbotId, session }: ChatbotConfigurationPageClientProps) {
  const [state, send] = useChatBotMachineState();
  const reduxSelectedChatbot = useSelector(selectSelectedChatbot);
  const selectedChatbot = (reduxSelectedChatbot as any) || state.context.selectedChatbot;

  const handleChatbotUpdate = (updatedChatbot: any) => {
    send({
      type: 'UPDATE_CHATBOT',
      data: {
        chatbotId: selectedChatbotId,
        chatbotData: updatedChatbot,
      },
    });
  };


  // Add missing properties to match the expected Chatbot type
  const chatbotWithTimestamps = selectedChatbot
    ? ({
        ...selectedChatbot,
        createdAt: (selectedChatbot as any).createdAt || new Date().toISOString(),
        updatedAt: (selectedChatbot as any).updatedAt || new Date().toISOString(),
      } as any)
    : null;
  return (
    <ChatbotConfigurationForm
      selectedChatbot={chatbotWithTimestamps}
      serverUrl={Server_URL}
      accessToken={(session as any)?.accessToken || ''}
      onChatbotUpdate={handleChatbotUpdate}
    />
  );
}
