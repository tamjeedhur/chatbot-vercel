import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chatbot } from '@/machines/chatBotMachine/types';
 

interface ChatbotState {
  chatbots: Chatbot[];
  selectedChatbot: Chatbot | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatbotState = {
  chatbots: [],
  selectedChatbot: null,
  isLoading: false,
  error: null,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    // Set all chatbots from server
    setChatbots: (state, action: PayloadAction<Chatbot[]>) => {
      state.chatbots = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Set selected chatbot
    setSelectedChatbot: (state, action: PayloadAction<Chatbot | null>) => {
      state.selectedChatbot = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Update partial selected chatbot data
    updateSelectedChatbot: (state, action: PayloadAction<Partial<Chatbot>>) => {
      if (state.selectedChatbot) {
        state.selectedChatbot = { ...state.selectedChatbot, ...action.payload };
      }
      state.isLoading = false;
      state.error = null;
    },
    
    // Clear all chatbot data
    clearChatbots: (state) => {
      state.chatbots = [];
      state.selectedChatbot = null;
      state.isLoading = false;
      state.error = null;
    },
    
    // Clear selected chatbot only
    clearSelectedChatbot: (state) => {
      state.selectedChatbot = null;
      state.isLoading = false;
      state.error = null;
    },
    
    // Set loading state
    setChatbotLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    // Set error state
    setChatbotError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear error
    clearChatbotError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setChatbots,
  setSelectedChatbot,
  updateSelectedChatbot,
  clearChatbots,
  clearSelectedChatbot,
  setChatbotLoading,
  setChatbotError,
  clearChatbotError,
} = chatbotSlice.actions;

// Selectors
export const selectChatbots = (state: { chatbot: ChatbotState }) => state.chatbot.chatbots;
export const selectSelectedChatbot = (state: { chatbot: ChatbotState }) => state.chatbot.selectedChatbot;
export const selectChatbotLoading = (state: { chatbot: ChatbotState }) => state.chatbot.isLoading;
export const selectChatbotError = (state: { chatbot: ChatbotState }) => state.chatbot.error;
export const selectChatbotState = (state: { chatbot: ChatbotState }) => state.chatbot;

export default chatbotSlice.reducer;
