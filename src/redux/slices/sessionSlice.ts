import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomSession } from '@/types/interfaces';

interface SessionState {
  session: CustomSession | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  session: null,
  isLoading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<CustomSession | null>) => {
      state.session = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateSession: (state, action: PayloadAction<Partial<CustomSession>>) => {
      if (state.session) {
        state.session = { ...state.session, ...action.payload };
      }
    },
    clearSession: (state) => {
      state.session = null;
      state.isLoading = false;
      state.error = null;
    },
    setSessionLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSessionError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setSession, updateSession, clearSession, setSessionLoading, setSessionError } = sessionSlice.actions;

// Selectors
export const selectSession = (state: { session: SessionState }) => state.session.session;
export const selectSessionUser = (state: { session: SessionState }) => state.session.session?.user;
export const selectAccessToken = (state: { session: SessionState }) => state.session.session?.accessToken;
export const selectRefreshToken = (state: { session: SessionState }) => state.session.session?.refreshToken;
export const selectOrganization = (state: { session: SessionState }) => state.session.session?.organization;
export const selectChatbots = (state: { session: SessionState }) => state.session.session?.chatbots;
export const selectSelectedChatbot = (state: { session: SessionState }) => state.session.session?.selectedChatbot;

export default sessionSlice.reducer;