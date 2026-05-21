import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/mock-login',
  '/api/webhooks/clerk',
  '/api/chat',
  '/api/uploadthing(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return;
  }
  
  // Check for mock auth cookie
  const cookies = req.headers.get('cookie') || '';
  if (cookies.includes('mock_auth')) {
    return;
  }
  
  // Check Clerk auth for real users
  const authResult = await auth();
  if (!authResult.userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};