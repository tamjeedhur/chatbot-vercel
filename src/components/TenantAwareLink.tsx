'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createTenantRoute } from '@/utils/tenant-routing';

interface TenantAwareLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  chatbotId?: string;
  [key: string]: any;
}

/**
 * A Link component that automatically includes the tenantId in the URL
 */
export function TenantAwareLink({ 
  href, 
  children, 
  className, 
  chatbotId, 
  ...props 
}: TenantAwareLinkProps) {
  const params = useParams();
  const tenantId = params?.tenantId as string;
  const currentChatbotId = chatbotId || (params?.selectedChatbotId as string);
  
  // If we're already in a tenant context, build the tenant-aware URL
  let finalHref = href;
  if (tenantId) {
    // Remove leading slash from href if present
    const cleanHref = href.startsWith('/') ? href.slice(1) : href;
    finalHref = createTenantRoute(tenantId, cleanHref, currentChatbotId);
  }
  
  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  );
}

/**
 * Hook to get tenant-aware routing functions
 */
export function useTenantAwareRouting() {
  const params = useParams();
  const tenantId = params?.tenantId as string;
  const chatbotId = params?.selectedChatbotId as string;
  
  const createRoute = (path: string, useChatbotId?: boolean) => {
    if (!tenantId) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return createTenantRoute(tenantId, cleanPath, useChatbotId ? chatbotId : undefined);
  };
  
  return {
    tenantId,
    chatbotId,
    createRoute,
    // Common routes
    routes: {
      dashboard: createRoute('dashboard', true),
      createChatbot: createRoute('create-chatbot'),
      settings: createRoute('settings', true),
      conversations: createRoute('conversations', true),
      dataSources: createRoute('data-sources', true),
      analytics: createRoute('dashboard-analytics', true),
      appearance: createRoute('appearance', true),
      apiManagement: createRoute('api-management', true),
      embedCode: createRoute('embeded', true),
      leadForms: createRoute('lead-forms', true),
      subscription: createRoute('subscription', true),
      profile: createRoute('profile', true),
    }
  };
}