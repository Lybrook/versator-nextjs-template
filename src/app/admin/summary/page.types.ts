import type { MediaUpload } from "~/db/schema/uploads/types";
import type { UserDbType } from "~/lib/auth-types";

// The shape of the data expected by the table
// Includes user details and their uploads
export type UserWithUploads = UserDbType & {
  uploads: MediaUpload[];
};
