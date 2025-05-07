import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { MFA_ENABLED } from "~/app";

const isMFARoute = createRouteMatcher(["/auth/mfa(.*)"]);
const isSignInRoute = createRouteMatcher(["/auth/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!MFA_ENABLED) return;
  const { sessionClaims, userId } = await auth();

  // Redirect to homepage if the user is signed in and on the sign-in page
  if (userId !== null && isSignInRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect to MFA setup page if MFA is not enabled
  if (userId !== null && !isMFARoute(req)) {
    if (sessionClaims.isMfa === undefined) {
      console.error("You need to add the `isMfa` claim to your session token.");
    }
    if (sessionClaims.isMfa === false) {
      return NextResponse.redirect(new URL("/auth/mfa", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
