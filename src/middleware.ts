import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Define routes that were intended to be public
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

// Define routes that should be ignored by Clerk altogether (usually static assets)
// Note: The config.matcher below often handles this sufficiently.
// const isIgnoredRoute = createRouteMatcher([
//   '/api/webhooks(.*)', 
// ]);

export default clerkMiddleware((auth, req: NextRequest) => {
  // TEMPORARILY REMOVED PROTECTION FOR DEBUGGING
  // if (!isPublicRoute(req)) {
  //   auth().protect();
  // }
  
  // Allow all requests to proceed for now
});

export const config = {
  matcher: [
    // Match all routes except specific static files and Next.js internals
    '/((?!.+\.[\w]+$|_next).*)', 
    '/', 
    '/(api|trpc)(.*)'
  ],
}; 