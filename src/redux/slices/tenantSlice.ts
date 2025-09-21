import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// API Key related interfaces
export type APIKeyPermission = 
  | "READ_CHAT_SESSIONS"
  | "CREATE_CHAT_SESSIONS"
  | "READ_ANALYTICS"
  | "WRITE_ANALYTICS"
  | "MANAGE_USERS"
  | "MANAGE_SETTINGS"
  | "FULL_ACCESS";

export interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: APIKeyPermission[];
  lastUsedAt: string | null;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface APIKeyResponse {
  success: boolean;
  data: APIKey[];
  message: string;
}

// Tenant Types
interface TenantSubscription {
  customPricing: Record<string, any>;
  status: string;
  plan: string;
  trialEndsAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  features: {
    maxUsers: number;
    maxChatsPerMonth: number;
    maxStorageGB: number;
    maxTokensPerMonth: number;
    allowedModels: string[];
    customBranding: boolean;
    apiAccess: boolean;
    ssoEnabled: boolean;
    whiteLabel: boolean;
    humanEscalation: boolean;
    analytics: boolean;
    customIntegrations: boolean;
    prioritySupport: boolean;
    dataRetentionDays: number;
    backupFrequency: string;
    slaLevel: string;
  };
}

interface TenantUsage {
  currentMonthChats: number;
  currentMonthTokens: number;
  currentMonthStorage: number;
  currentMonthUsers: number;
  lastResetAt: string;
  historicalUsage: any[];
}

interface TenantBranding {
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  customCSS: string;
  customJS: string;
  companyName: string;
  tagline: string;
  contactEmail: string;
  supportEmail: string;
  website: string;
  hidePoweredBy: boolean;
  customDomain: string;
  sslEnabled: boolean;
}

interface TenantSecurity {
  enforceSSO: boolean;
  require2FA: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAgeDays: number;
  };
  sessionPolicy: {
    maxSessionDuration: number;
    idleTimeout: number;
    concurrentSessions: number;
  };
  mfaMethods: string[];
  auditLogging: boolean;
  dataEncryption: boolean;
  compliance: {
    gdpr: boolean;
    soc2: boolean;
    hipaa: boolean;
    sox: boolean;
  };
  ipWhitelist: string[];
  allowedDomains: string[];
}

interface TenantAnalytics {
  enabled: boolean;
  trackingId: string;
  customEvents: any[];
  dashboards: any[];
  reports: any[];
}

interface TenantSettings {
  workspace: {
    name: string;
    url: string;
    description: string;
    isPublic: boolean;
  };
  notifications: {
    email: {
      newTeamMember: boolean;
      billingUpdates: boolean;
      securityAlerts: boolean;
      weeklyUsageReports: boolean;
    };
    inApp: {
      realTimeUpdates: boolean;
      soundNotifications: boolean;
    };
    push: boolean;
    slack: boolean;
  };
  timezone: string;
  locale: string;
  dateFormat: string;
  timeFormat: string;
  features: {
    maxUsers: number;
    maxChatsPerMonth: number;
    maxStorageGB: number;
    maxTokensPerMonth: number;
    allowedModels: string[];
    customBranding: boolean;
    apiAccess: boolean;
    ssoEnabled: boolean;
    whiteLabel: boolean;
    humanEscalation: boolean;
    analytics: boolean;
    customIntegrations: boolean;
    prioritySupport: boolean;
    dataRetentionDays: number;
    backupFrequency: string;
    slaLevel: string;
  };
}

// Invitation interface for the new API response
export interface Invitation {
  invitationId: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
}

// Member interface for the actual API response
export interface MemberResponse {
  id: string;
  invitationId: string;
  email: string;
  name: string;
  role: string;
  status: string;
  joinedAt: string;
  lastActiveAt: string;
  profile: {
    avatar: string;
    title: string;
    department: string;
    phone: string;
    timezone: string;
    preferences: Record<string, any>;
  };
  activity: {
    loginCount: number;
    lastLoginAt?: string;
    chatCount: number;
    tokenUsage: number;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: string;
  plan: string;
  subscription: TenantSubscription;
  usage: TenantUsage;
  branding: TenantBranding;
  security: TenantSecurity;
  analytics: TenantAnalytics;
  settings: TenantSettings;
  ipWhitelist: boolean;
  sessionTimeout: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantResponse {
  success: boolean;
  data: Tenant;
  message: string;
}

interface TenantState {
  tenant: Tenant | null;
  members: (Invitation | MemberResponse)[];
  apiKeys: APIKey[];
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenant: null,
  members: [],
  apiKeys: [],
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<Tenant>) => {
      state.tenant = action.payload;
      state.loading = false;
      state.error = null;
    },
    setTenantLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTenantError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearTenant: (state) => {
      state.tenant = null;
      state.loading = false;
      state.error = null;
    },
    setTenantsMembers: (state, action: PayloadAction<(Invitation | MemberResponse)[]>) => {
      state.members = action.payload;
    },
    addTenantsMembers: (state, action: PayloadAction<(Invitation | MemberResponse)[]>) => {
      state.members.push(...action.payload);
    },
    removeTenantsMembers: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(member => member?.invitationId !== action.payload);
      state.loading = false;
      state.error = null;
    },
    setTenantAPIKeys: (state, action: PayloadAction<APIKey[]>) => {
      state.apiKeys = action.payload;
    },
    addTenantAPIKey: (state, action: PayloadAction<APIKey>) => {
      state.apiKeys.push(action.payload);
    },
    removeTenantAPIKey: (state, action: PayloadAction<string>) => {
      state.apiKeys = state.apiKeys.filter(key => key.id !== action.payload);
    },
    updateTenantAPIKey: (state, action: PayloadAction<{ keyId: string; updates: Partial<APIKey> }>) => {
      const { keyId, updates } = action.payload;
      const keyIndex = state.apiKeys.findIndex(key => key.id === keyId);
      if (keyIndex !== -1) {
        state.apiKeys[keyIndex] = { ...state.apiKeys[keyIndex], ...updates };
      }
    },
    updateSettingsAndSecurity: (state, action: PayloadAction<{
      settings?: Partial<TenantSettings>;
      security?: Partial<TenantSecurity>;
      ipWhitelist?: boolean;
      sessionTimeout?: boolean;
    }>) => {
      if (state.tenant) {
        const { settings, security, ipWhitelist, sessionTimeout } = action.payload;
        
        if (settings) {
          state.tenant.settings = { ...state.tenant.settings, ...settings };
        }
        
        if (security) {
          state.tenant.security = { ...state.tenant.security, ...security };
        }
        
        if (ipWhitelist !== undefined) {
          state.tenant.ipWhitelist = ipWhitelist;
        }
        
        if (sessionTimeout !== undefined) {
          state.tenant.sessionTimeout = sessionTimeout;
        }
        
        state.loading = false;
        state.error = null;
      }
    },
  },
});

export const { 
  setTenant, 
  setTenantLoading, 
  setTenantError, 
  clearTenant, 
  setTenantsMembers,
  addTenantsMembers,
  removeTenantsMembers,
  setTenantAPIKeys,
  addTenantAPIKey,
  removeTenantAPIKey,
  updateTenantAPIKey,
  updateSettingsAndSecurity
} = tenantSlice.actions;

// Selectors
export const selectTenant = (state: { tenant: TenantState }) =>
  state.tenant.tenant;
export const selectTenantLoading = (state: { tenant: TenantState }) =>
  state.tenant.loading;
export const selectTenantError = (state: { tenant: TenantState }) =>
  state.tenant.error;
export const tenantsMembers = (state: { tenant: TenantState }) =>
  state.tenant.members as (Invitation | MemberResponse)[];
export const selectTenantAPIKeys = (state: { tenant: TenantState }) =>
  state.tenant.apiKeys;

export default tenantSlice.reducer;
