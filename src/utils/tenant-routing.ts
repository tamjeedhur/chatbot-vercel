import { CustomSession } from '@/types/interfaces';

/**
 * Tenant-aware routing utilities
 */

export interface TenantRouteParams {
  tenantId: string;
  chatbotId?: string;
  [key: string]: string | undefined;
}

/**
 * Generate a tenant-aware route path
 */
export function createTenantRoute(
  tenantId: string, 
  path: string, 
  chatbotId?: string
): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (chatbotId) {
    return `/${tenantId}/${chatbotId}/${cleanPath}`;
  }
  
  return `/${tenantId}/${cleanPath}`;
}

/**
 * Generate tenant routes for common paths
 */
export function getTenantRoutes(tenantId: string, chatbotId?: string) {
  return {
    dashboard: createTenantRoute(tenantId, 'dashboard', chatbotId),
    createChatbot: createTenantRoute(tenantId, 'create-chatbot'),
    settings: createTenantRoute(tenantId, 'settings', chatbotId),
    conversations: createTenantRoute(tenantId, 'conversations', chatbotId),
    dataSources: createTenantRoute(tenantId, 'data-sources', chatbotId),
    analytics: createTenantRoute(tenantId, 'dashboard-analytics', chatbotId),
    appearance: createTenantRoute(tenantId, 'appearance', chatbotId),
    apiManagement: createTenantRoute(tenantId, 'api-management', chatbotId),
    embedCode: createTenantRoute(tenantId, 'embeded', chatbotId),
    leadForms: createTenantRoute(tenantId, 'lead-forms', chatbotId),
    subscription: createTenantRoute(tenantId, 'subscription', chatbotId),
    profile: createTenantRoute(tenantId, 'profile', chatbotId),
  };
}

/**
 * Extract tenant and chatbot IDs from current path
 */
export function parseTenantPath(pathname: string): {
  tenantId: string | null;
  chatbotId: string | null;
  remainingPath: string;
} {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return { tenantId: null, chatbotId: null, remainingPath: '' };
  }

  const tenantId = segments[0];
  const chatbotId = segments[1] || null;
  const remainingPath = segments.slice(chatbotId ? 2 : 1).join('/');

  return {
    tenantId: tenantId.length === 24 ? tenantId : null,
    chatbotId,
    remainingPath
  };
}

/**
 * Validate if a tenant ID is valid format (24 character hex string)
 */
export function isValidTenantId(tenantId: string): boolean {
  return /^[a-f0-9]{24}$/.test(tenantId);
}

/**
 * Get tenant ID from session
 */
export function getTenantIdFromSession(session: CustomSession | null): string | null {
  return session?.user?.tenantId || session?.tenantId || null;
}

/**
 * Redirect to tenant-aware route helper
 */
export function redirectToTenant(tenantId: string, path: string = 'dashboard'): string {
  return `/${tenantId}/${path}`;
}

/**
 * Get the current tenant context from URL params
 */
export function useTenantContext(params: any) {
  const tenantId = params?.tenantId;
  const chatbotId = params?.selectedChatbotId;
  
  return {
    tenantId,
    chatbotId,
    isValidTenant: tenantId ? isValidTenantId(tenantId) : false,
    routes: tenantId ? getTenantRoutes(tenantId, chatbotId) : null,
  };
}