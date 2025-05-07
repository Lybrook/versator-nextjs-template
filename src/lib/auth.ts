import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import type { UserDbType } from "~/lib/auth-types";

import { getUserById } from "~/lib/queries/users";

// clerk's server-side auth helper for
// use in api routes, middleware, etc
export { auth };

/**
 * get the cached current user from clerk
 * returns null or data from the database
 */
export const getCurrentUser = currentUser;

/**
 * redirects to forbiddenUrl if not logged in, unless ignoreForbidden is true.
 * redirects to okUrl if logged in and okUrl is provided.
 * returns null or a DB user object.
 */
export const getCurrentUserOrRedirect = async (
  forbiddenUrl = "/auth/sign-in",
  okUrl = "",
  ignoreForbidden = false,
): Promise<null | UserDbType> => {
  // 1. Check Clerk authentication state
  const clerkUser = await getCurrentUser();

  // 2. Handle not logged in
  if (!clerkUser) {
    // redirect to forbidden url unless explicitly ignored
    if (!ignoreForbidden) {
      redirect(forbiddenUrl);
    }
    // if ignoring forbidden, return null immediately
    // (don't proceed to okUrl check)
    return null;
  }

  // 3. Handle okUrl redirect if logged in (before db query)
  if (okUrl) {
    // if user is found and an okUrl is provided, redirect there
    redirect(okUrl);
  }

  // 4. Fetch the user from the database using the Clerk user ID
  try {
    const dbUser = await getUserById(clerkUser.id);
    // TODO: CREATE A NEW USER IN THE DB IF THEY DON'T EXIST
    // If user exists in Clerk but not DB (e.g., sync issue), treat as not found
    // TODO: UNCOMMENT THE FOLLOWING AFTER USER CREATION IN DB IS IMPLEMENTED
    // console.error(
    //   "[sync issue] user exists in Clerk but not in DB. dbUser:",
    //   dbUser,
    // );
    return dbUser;
  } catch (error) {
    // Log the error, but return null to the caller
    console.error(
      `Failed to fetch user from DB for clerkId ${clerkUser.id}:`,
      error,
    );
    return null;
  }
};
