import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  tenantId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  tenantId: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{
      user: any;
      tenantId: string;
      accessToken: string;
      refreshToken: string;
    }>) => {
      state.user = action.payload.user;
      state.tenantId = action.payload.tenantId;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.tenantId = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setUser, clearUser, setUserLoading, setUserError } = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectTenantId = (state: { user: UserState }) => state.user.tenantId;
export const selectAccessToken = (state: { user: UserState }) => state.user.accessToken;
export const selectRefreshToken = (state: { user: UserState }) => state.user.refreshToken;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;