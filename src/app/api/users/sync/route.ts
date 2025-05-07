import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "~/db";
import { userTable } from "~/db/schema/users/tables";
import { auth } from "~/lib/auth";

export async function POST() {
  try {
    // get current user from clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // check if user exists in db
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .execute();

    // if user exists, return success
    if (existingUser.length > 0) {
      return NextResponse.json({ success: true });
    }

    // if user doesn't exist, create them
    // note: this is just a placeholder until the webhook creates the full user
    const now = new Date();
    await db.insert(userTable).values({
      createdAt: now,
      email: "", // webhook will update this
      emailVerified: false,
      firstName: null,
      id: userId,
      image: null,
      lastName: null,
      name: "",
      stripeCustomerId: null,
      subscriptionPlan: "free",
      twoFactorEnabled: null,
      updatedAt: now,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error syncing user:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
