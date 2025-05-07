import type {
  DeletedObjectJSON,
  UserJSON,
  WebhookEvent,
} from "@clerk/nextjs/server";

import { eq } from "drizzle-orm";
import { headers as getHeaders } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import type { NewUser } from "~/db/schema";

import { SVIX_ENABLED } from "~/app";
import { db } from "~/db";
import { userTable } from "~/db/schema/users/tables";

export async function POST(req: Request) {
  try {
    // read raw body for signature verification
    const rawBody = await getRawBody(req);

    // only attempt svix verification if enabled
    if (SVIX_ENABLED) {
      const isValid = await verifyClerkSignature(req, rawBody);
      if (!isValid) {
        // log invalid signature
        console.error("clerk webhook: invalid signature (svix enabled)");
        return NextResponse.json(
          { error: "invalid signature" },
          { status: 401 },
        );
      }
    }

    // parse and type event
    const event = JSON.parse(rawBody.toString()) as WebhookEvent;
    if (!event || !event.type || !event.data) {
      return NextResponse.json({ error: "invalid event" }, { status: 400 });
    }

    // handle only user.created and user.updated
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const user = event.data as UserJSON;
        const now = new Date();
        const dbUser = mapClerkUserToDb(user, now);
        await db
          .insert(userTable)
          .values(dbUser)
          .onConflictDoUpdate({
            set: {
              ...dbUser,
              createdAt: undefined, // don't overwrite createdAt on update
            },
            target: userTable.id,
          });
        return NextResponse.json({ success: true });
      }
      case "user.deleted": {
        const deleted = event.data as DeletedObjectJSON;
        // ensure deleted.id is a string
        if (!deleted.id || typeof deleted.id !== "string") {
          console.error(
            "clerk webhook: missing or invalid user id in user.deleted event",
            deleted,
          );
          return NextResponse.json(
            { error: "invalid user id" },
            { status: 400 },
          );
        }
        // delete user from db by id
        await db.delete(userTable).where(eq(userTable.id, deleted.id));
        console.log(`user deleted from db: ${deleted.id}`);
        return NextResponse.json({ success: true });
      }
      default:
        // ignore other events
        return NextResponse.json({ ignored: true });
    }
  } catch (err) {
    // log error for debugging
    console.error("clerk webhook error:", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}

// helper to read raw body from request
async function getRawBody(req: Request): Promise<Buffer> {
  const arrayBuffer = await req.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function mapClerkUserToDb(user: UserJSON, now: Date) {
  // maps clerk user object to db userTable shape
  const userMap: NewUser = {
    createdAt: user.created_at ? new Date(user.created_at) : now,
    email: user.email_addresses?.[0]?.email_address ?? "",
    emailVerified:
      user.email_addresses?.[0]?.verification?.status === "verified",
    firstName: user.first_name ?? null,
    id: user.id,
    image: user.image_url ?? null,
    lastName: user.last_name ?? null,
    name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
    stripeCustomerId: null,
    subscriptionPlan: "free",
    twoFactorEnabled: user.two_factor_enabled ?? null,
    updatedAt: user.updated_at ? new Date(user.updated_at) : now,
  };

  return userMap;
}

async function verifyClerkSignature(
  req: Request,
  rawBody: Buffer,
): Promise<boolean> {
  // note: this function is only called if SVIX_ENABLED is true
  const svixSecret = process.env.CLERK_WEBHOOK_SECRET; // TODO: 🤔 maybe we should have SVIX_SECRET_KEY...
  if (!svixSecret) {
    console.error(
      "clerk webhook: missing CLERK_WEBHOOK_SECRET env var (svix enabled)",
    );
    return false;
  }
  const webhook = new Webhook(svixSecret);
  const headers = await getHeaders();
  const svixId = headers.get("svix-id") || "";
  const svixTimestamp = headers.get("svix-timestamp") || "";
  const svixSignature = headers.get("svix-signature") || "";
  try {
    webhook.verify(rawBody, {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp,
    });
    return true;
  } catch (err) {
    console.error("clerk webhook: signature verification failed", err);
    return false;
  }
}
