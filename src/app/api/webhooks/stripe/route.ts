import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, type WebhookRequiredHeaders } from "svix";

import { SVIX_ENABLED } from "~/app";
import { stripe } from "~/lib/stripe";
import { syncStripeDataToKV } from "~/lib/stripe-sync";

const allowedEvents = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "invoice.marked_uncollectible",
  "invoice.payment_succeeded",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
];

interface StripeWebhookEvent {
  [key: string]: unknown;
  data: {
    object: {
      [key: string]: unknown;
      customer: string;
    };
  };
  type: string;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();

  let event: StripeWebhookEvent;

  if (SVIX_ENABLED) {
    // svix verification logic
    const svixHeaders: WebhookRequiredHeaders = {
      "svix-id": headerPayload.get("svix-id") ?? "",
      "svix-signature": headerPayload.get("svix-signature") ?? "",
      "svix-timestamp": headerPayload.get("svix-timestamp") ?? "",
    };
    if (
      !svixHeaders["svix-id"] ||
      !svixHeaders["svix-timestamp"] ||
      !svixHeaders["svix-signature"]
    ) {
      console.error("[STRIPE HOOK] missing svix headers (svix enabled)");
      return NextResponse.json(
        { error: "missing svix headers" },
        { status: 400 },
      );
    }

    // todo: 🤔 maybe it should be STRIPE_SVIX_WEBHOOK_SECRET/SVIX_WEBHOOK_SECRET with SVIX_TOKEN?
    const svixSecret = process.env.SVIX_WEBHOOK_SECRET; // TODO: we should ensure this holds the svix endpoint secret
    if (!svixSecret) {
      console.error(
        "[STRIPE HOOK] missing SVIX_WEBHOOK_SECRET env var (svix enabled)",
      );
      return NextResponse.json(
        { error: "svix webhook secret not configured" },
        { status: 500 },
      );
    }

    const wh = new Webhook(svixSecret);
    try {
      event = wh.verify(body, svixHeaders) as StripeWebhookEvent;
    } catch (error) {
      console.error("[STRIPE HOOK] svix verification failed", error);
      return NextResponse.json(
        { error: "svix webhook verification failed" },
        { status: 400 },
      );
    }
  } else {
    // native stripe verification logic (fallback)
    const signature = headerPayload.get("stripe-signature");
    if (!signature) {
      console.error(
        "[STRIPE HOOK] missing stripe-signature header (svix disabled)",
      );
      return NextResponse.json(
        { error: "missing stripe signature" },
        { status: 400 },
      );
    }

    // todo: 🤔 maybe it should be STRIPE_SVIX_WEBHOOK_SECRET/SVIX_WEBHOOK_SECRET with SVIX_TOKEN?
    const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET; // TODO: we should ensure this holds the native stripe secret
    if (!stripeSecret) {
      console.error(
        "[STRIPE HOOK] missing STRIPE_WEBHOOK_SECRET env var (svix disabled)",
      );
      return NextResponse.json(
        { error: "stripe webhook secret not configured" },
        { status: 500 },
      );
    }

    try {
      // use stripe's native verification
      // todo: we might need to adjust the type assertion if stripe's event structure differs slightly
      // we cast to unknown first to satisfy typescript
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeSecret,
      ) as unknown as StripeWebhookEvent;
    } catch (error) {
      console.error("[STRIPE HOOK] native stripe verification failed", error);
      // return 400 for errors during verification
      return NextResponse.json(
        { error: "native stripe webhook verification failed" },
        { status: 400 },
      );
    }
  }

  // common event processing logic
  try {
    await processEvent(event);
  } catch (error) {
    console.error("[STRIPE HOOK] error processing event", error);
    // return 500 for processing errors
    return NextResponse.json(
      { error: "failed to process webhook" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

async function processEvent(event: StripeWebhookEvent) {
  if (!allowedEvents.includes(event.type)) return;
  const { customer: customerId } = event.data.object;
  if (typeof customerId !== "string") {
    throw new Error(`[STRIPE HOOK] id isn't string. event type: ${event.type}`);
  }
  return await syncStripeDataToKV(customerId);
}
