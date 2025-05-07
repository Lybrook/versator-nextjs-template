import type { InferSelectModel } from "drizzle-orm";

import type { userTable } from "./tables";

export type NewUser = Omit<User, "age">;
export type User = InferSelectModel<typeof userTable>;
