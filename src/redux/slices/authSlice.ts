import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '@/types/interfaces';
import { RootState } from '../store';

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

// Helper functions to interact with localStorage
const loadFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const saveToLocalStorage = (key: string, value: string | null) => {
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: loadFromLocalStorage('accessToken'),
    refreshToken: loadFromLocalStorage('refreshToken'),
  },
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      saveToLocalStorage('accessToken', action.payload.accessToken);
      saveToLocalStorage('refreshToken', action.payload.refreshToken);
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      saveToLocalStorage('accessToken', null);
      saveToLocalStorage('refreshToken', null);
    },
    syncWithSession: (state, action: PayloadAction<{ accessToken: string | null; refreshToken: string | null }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.accessToken) {
        saveToLocalStorage('accessToken', action.payload.accessToken);
      }
      if (action.payload.refreshToken) {
        saveToLocalStorage('refreshToken', action.payload.refreshToken);
      }
    },
  },
});

export const { setTokens, clearTokens, syncWithSession } = authSlice.actions;

// Selectors
export const selectAuthTokens = (state: any) => ({
  accessToken: state.auth?.accessToken ?? null,
  refreshToken: state.auth?.refreshToken ?? null,
});

export default authSlice.reducer;
