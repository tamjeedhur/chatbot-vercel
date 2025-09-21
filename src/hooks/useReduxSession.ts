'use client';

import { useSelector } from 'react-redux';
import { 
  selectUser,
  selectTenantId,
  selectAccessToken, 
  selectRefreshToken
} from '@/redux/slices/userSlice';
import { selectChatbots, selectSelectedChatbot } from '@/redux/slices/chatbotSlice';

export const useReduxSession = () => {
  const user = useSelector(selectUser);
  const tenantId = useSelector(selectTenantId);
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);
  const chatbots = useSelector(selectChatbots);
  const selectedChatbot = useSelector(selectSelectedChatbot);

  return {
    user,
    tenantId,
    accessToken,
    refreshToken,
    chatbots,
    selectedChatbot,
    isAuthenticated: !!user && !!accessToken,
  };
};