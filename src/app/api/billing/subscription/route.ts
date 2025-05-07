import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "~/db";
import { userTable } from "~/db/schema/users/tables";
import { auth } from "~/lib/auth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const user = await db.query.userTable.findFirst({
    columns: {
      stripeCustomerId: true,
      subscriptionPlan: true,
    },
    where: eq(userTable.id, userId),
  });
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  return NextResponse.json({
    stripeCustomerId: user.stripeCustomerId,
    subscriptionPlan: user.subscriptionPlan,
  });
}
