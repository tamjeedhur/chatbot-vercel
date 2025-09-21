// General Settings Types
export interface WorkspaceSettings {
  name: string;
  url: string;
  description: string;
  isPublic?: boolean;
}

export interface NotificationSettings {
  email: {
    newTeamMember: boolean;
  };
}

export interface TenantSettings {
  workspace: WorkspaceSettings;
  notifications: NotificationSettings;
}

export interface Tenant {
  id: string;
  name: string;
  settings: TenantSettings;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralSettingsData {
  tenant: Tenant;
  settings: TenantSettings;
}

// API Response Types
export interface TenantSettingsResponse {
  success: boolean;
  data: Tenant;
  message: string;
}

export interface UpdateTenantSettingsRequest {
  settings: Partial<TenantSettings>;
}

// Form State Types
export interface WorkspaceFormState {
  name: string;
  url: string;
  description: string;
}

export interface PreferencesFormState {
  emailNotifications: boolean;
  publicWorkspace: boolean;
}

// Error Types
export interface SettingsError {
  message: string;
  field?: string;
  code?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
