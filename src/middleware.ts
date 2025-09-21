import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Verify required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set. Please add it to your environment variables.');
}

const publicPaths = [
  '/sign-in',
  '/sign-up',
  '/reset-password',
  '/verify-email',
  '/privacy-policy',
  '/terms',
  '/',
  '/update-password',
  '/forgot-password',
] as const;

type PublicPath = (typeof publicPaths)[number];

// Helper function to check if a path is public
const isPublicPath = (path: string): boolean => {
  return (
    publicPaths.includes(path as PublicPath) ||
    path.startsWith('/_next') ||
    path.startsWith('/api/auth') ||
    path.includes('favicon.ico') ||
    path.startsWith('/static/') ||
    path.includes('.png') ||
    path.includes('.jpg') ||
    path.includes('.svg') ||
    path.includes('.ico') ||
    // Allow all embed URLs (dynamic routes like /embed/[embedKey])
    path.startsWith('/embed/')
  );
};

export async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;

    console.log('Middleware processing path:', path);

    // Allow all API routes except those requiring auth
    if (path.startsWith('/api/') && !path.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    // Get the token early to avoid multiple checks
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log('Token:', token);
    // console.log("Token:", token);

    // Helper functions
    const getTenantId = (token: any): string | null => {
      return token?.user?.tenantId || token?.tenantId || null;
    };

    const isTenantPath = (path: string): boolean => {
      // Pattern: /[tenantId]/... where tenantId is 24 character hex string
      const tenantPathRegex = /^\/[a-f0-9]{24}\//;
      return tenantPathRegex.test(path);
    };

    const shouldRedirectToAuth = (path: string): boolean => {
      return path === '/sign-in' || path === '/sign-up' || path === '/reset-password' || path === '/';
    };

    // Redirect authenticated users away from auth pages to redirect route
    if (token && shouldRedirectToAuth(path)) {
      const tenantId = getTenantId(token);
      if (!tenantId) {
        console.error('No tenantId found in token');
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }

      // Redirect to the tenant redirect route which will handle chatbot selection
      return NextResponse.redirect(new URL(`/${tenantId}/redirect`, req.url));
    }

    // Validate tenant access for tenant-specific routes
    if (token && isTenantPath(path)) {
      const userTenantId = getTenantId(token);
      const pathTenantId = path.split('/')[1];

      if (userTenantId !== pathTenantId) {
        // Redirect to user's correct tenant redirect page for tenant mismatch only
        if (userTenantId) {
          return NextResponse.redirect(new URL(`/${userTenantId}/redirect`, req.url));
        } else {
          return NextResponse.redirect(new URL('/sign-in', req.url));
        }
      }

      // Allow all tenant routes to proceed - let layouts handle routing logic
      return NextResponse.next();
    }

    // Handle public paths
    if (isPublicPath(path)) {
      return NextResponse.next();
    }

    // Protected routes
    if (!token) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Return a basic next response on error to prevent stream issues
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API auth routes (/api/auth/*)
     * - Next.js built-in paths
     * - Static files and assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
