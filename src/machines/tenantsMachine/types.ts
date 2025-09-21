import { Tenant } from "@/redux/slices/tenantSlice";

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

// Member-related interfaces
export interface MemberPreferences {
  notifications?: boolean;
  theme?: 'light' | 'dark';
}

export interface MemberProfile {
  avatar: string;
  title: string;
  department: string;
  phone: string;
  timezone: string;
  preferences: MemberPreferences;
}

export interface MemberActivity {
  loginCount: number;
  lastLoginAt?: string;
  chatCount: number;
  tokenUsage: number;
}

export interface Member {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  joinedAt: string;
  lastActiveAt: string;
  profile: MemberProfile;
  activity: MemberActivity;
}

// Input types for the machine
export interface TenantMachineInput {
  tenantId: string;
  tenant: Tenant;
}

// Context types
export interface TenantMachineContext {
  tenant: Tenant;
  isLoading: boolean;
  error: string | null;
  tenantId: string | null;
  members: (Member | Invitation)[];
  apiKeys: APIKey[];
  deletingInvitationId?: string;
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
  email: string;
  name: string;
  role: string;
  status: string;
  joinedAt: string;
  lastActiveAt: string;
  profile: MemberProfile;
  activity: MemberActivity;
}

// Event types
export type TenantMachineEvents =
  | { type: 'UPDATE_TENANT'; updates: Partial<Tenant> }
  | { type: 'UPDATE_FIELD'; path: string; value: any; base?: Tenant }
  | { type: 'UPDATE_FIELD_AND_SAVE'; path: string; value: any; base?: Tenant }
  | { type: 'SYNC_TENANT'; data: Tenant }
  | { type: 'INVITE_MEMBER'; email: string; role: string; message: string }
  | { type: 'DELETE_MEMBER'; invitationId: string }
  | { type: 'LOAD_API_KEYS' }
  | { type: 'CREATE_API_KEY'; name: string; permissions: APIKeyPermission[]; expiresAt?: string }
  | { type: 'DELETE_API_KEY'; keyId: string }
  | { type: 'REVOKE_API_KEY'; keyId: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' };
