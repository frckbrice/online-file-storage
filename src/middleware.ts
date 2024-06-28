import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

//'/reset-password(.*)', '/change-password(.*)', '/verify-email(.*)',

export default clerkMiddleware((auth, req) => {
    // Add your middleware checks

    if (!isPublicRoute(req)) {
        auth().protect();
    }
}, { debug: true })

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};