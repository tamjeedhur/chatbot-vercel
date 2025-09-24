import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import chatbotReducer from './slices/chatbotSlice';
import tenantReducer from './slices/tenantSlice';
import scrapReducer from './slices/scrapSlice';
import dataSourcesReducer from './slices/datasourcesSlice';

export const makeStore = () => {
  const rootReducer = {
    auth: authReducer,
    user: userReducer,
    chatbot: chatbotReducer,
    tenant: tenantReducer,
    scrap: scrapReducer,
    dataSources: dataSourcesReducer,
  } as const;

  return configureStore({
    reducer: rootReducer as unknown as any,
  });
};

// For client-side usage
export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
