import { Chatbot } from '@/types/chatbotConfiguration';

/**
 * Finds the default chatbot from a list of chatbots
 * Falls back to the first chatbot if no default is found
 */
export function getDefaultChatbot(chatbots: Chatbot[] | null): Chatbot | null {
  if (!chatbots || chatbots.length === 0) {
    return null;
  }
  
  // Find the chatbot marked as default
  const defaultChatbot = chatbots.find((chatbot) => chatbot.isDefault === true);
  
  // Fall back to the first chatbot if no default is found
  return defaultChatbot || chatbots[0];
}

/**
 * Validates if a user has access to a specific chatbot
 */
export function validateChatbotAccess(
  userChatbots: Chatbot[] | null,
  chatbotId: string
): boolean {
  if (!userChatbots || userChatbots.length === 0) {
    return false;
  }
  
  return userChatbots.some((chatbot) => chatbot._id === chatbotId);
}

/**
 * Gets the chatbot redirect URL based on tenant and chatbot
 */
export function getChatbotRedirectUrl(
  tenantId: string,
  chatbot: Chatbot | null,
  defaultPage: string = 'dashboard'
): string {
  if (!chatbot) {
    return `/${tenantId}/create-chatbot`;
  }
  
  return `/${tenantId}/${chatbot._id}/${defaultPage}`;
}

/**
 * Filters active chatbots from a list
 */
export function getActiveChatbots(chatbots: Chatbot[] | null): Chatbot[] {
  if (!chatbots) {
    return [];
  }
  
  return chatbots.filter((chatbot) => chatbot.status === 'active');
}