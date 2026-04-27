import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in', 
  '/sign-up', 
  '/mock-login',
  '/api/webhooks/clerk',
  '/api/appointments',
  '/api/requests'
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return;
  }
  
  // Check for mock auth cookie
  const cookies = req.headers.get('cookie') || '';
  if (cookies.includes('mock_auth')) {
    return; // Allow mock users
  }
  
  // Check Clerk auth for real users
  const authResult = await auth();
  if (!authResult.userId) {
    return new Response('Unauthorized', { status: 401 });
  }
});

export const config = {
  matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};