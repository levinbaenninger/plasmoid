import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from './features/auth/constants';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  // Public paths that don't require authentication
  const isPublicPath = ['/sign-in', '/sign-up'].includes(
    request.nextUrl.pathname,
  );

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Auth routes
    '/sign-in',
    '/sign-up',
    // Protected app routes
    '/',
    '/workspaces/:path*',
  ],
};
