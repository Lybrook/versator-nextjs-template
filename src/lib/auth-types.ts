import type { UserResource as UserRawInfer } from "@clerk/types";

import type { User as UserDbInfer } from "~/db/schema/users/types";

export type UserDbType = UserDbInfer;
export type UserRawType = UserRawInfer;
