/**
 * Syncs the current user with the database
 * This ensures the user exists in the database after sign-up/sign-in
 */
export async function syncUser() {
  try {
    const res = await fetch("/api/users/sync", {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error("Failed to sync user");
    }
    return true;
  } catch (err) {
    console.error("Error syncing user:", err);
    return false;
  }
}
