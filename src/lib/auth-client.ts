import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
  UserProfile,
  useSession,
  useUser,
} from "@clerk/nextjs";

// clerk's main client-side hooks and components for use in the app
export {
  UserProfile as ClerkUserProfile,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
  useSession,
  useUser,
};
/**
 * get the cached current user from clerk (client-side)
 * !! Returns only raw (static) data, use getCurrentUserOrRedirect for data from db
 */
export const useCurrentUser = useUser;

// !! currently not used in the app
/**
 * Redirects to forbiddenUrl if not logged in
 * Redirects to okUrl if logged in
 * !! Returns only raw (static) data, use getCurrentUserOrRedirect for data from db
 */
/* export const useCurrentUserOrRedirect = (
  forbiddenUrl = "/auth/sign-in",
  okUrl = "",
  ignoreForbidden = false,
) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // wait until clerk sdk is loaded and user status is known
    if (!isLoaded) {
      return;
    }

    // if no user and we need to redirect away from this page
    if (!isSignedIn) {
      // redirect to forbidden url unless explicitly ignored
      if (!ignoreForbidden) {
        router.push(forbiddenUrl);
      }
      return; // prevent further checks/redirects in this render cycle
    }

    // if user *does* exist and we need to redirect *away* from this page
    if (okUrl) {
      router.push(okUrl);
    }
    // important: only run effect when loading/signing state changes
    // also depend on redirect urls and the ignore flag
  }, [isLoaded, isSignedIn, router, forbiddenUrl, okUrl, ignoreForbidden]);

  // return the user object, similar to the server-side version
  // note: it might be null initially while loading or if not signed in
  return user;
}; */

// !! currently not used in the app
/**
 * returns the raw session object from clerk's useSession hook.
 * this is a direct wrapper around useSession and returns the same shape.
 *
 * use this when you require advanced session access patterns, e.g.:
 * - you need to fetch the session manually (e.g., with swr, react query, or custom logic).
 * - you need to access the session data directly without using the useSession hook.
 * - you want more control than the useSession hook provides.
 *
 * @example
 * const { data, error } = useRawSession();
 */
// export const useRawSession = useSession;
