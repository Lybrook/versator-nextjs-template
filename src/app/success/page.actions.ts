"use server";

import { toast } from "sonner";

import { stripe } from "~/lib/stripe";
import { syncStripeDataToKV } from "~/lib/stripe-sync";

export async function syncAfterSuccess(sessionId: string) {
  if (!sessionId) {
    toast.error("missing sessionId");
    throw new Error("missing sessionId");
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session.customer || typeof session.customer !== "string") {
    toast.error("no customer in session");
    throw new Error("no customer in session");
  }
  await syncStripeDataToKV(session.customer);
  return { ok: true };
}
