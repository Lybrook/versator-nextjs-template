"use server";

import { getCurrentUserOrRedirect } from "~/lib/auth";
import { kv } from "~/lib/kv";
import { stripe } from "~/lib/stripe";

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!;
const DOMAIN = process.env.NEXT_PUBLIC_APP_URL!;

export async function createStripeCheckoutSession() {
  const user = await getCurrentUserOrRedirect();

  // Ensure user is logged in before proceeding
  if (!user) {
    throw new Error("User must be logged in to create a checkout session.");
  }

  // try to get existing stripe customer id from kv
  let customerId = await kv.get<string>(`stripe:user:${user.id}`);

  // if not found, create stripe customer and store mapping
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await kv.set(`stripe:user:${user.id}`, customerId);
    await kv.set(`stripe:customer:${customerId}:user`, user.id);
  }

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    cancel_url: `${DOMAIN}/dashboard/billing`,
    customer: customerId,
    line_items: [
      {
        price: STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    subscription_data: {
      metadata: { userId: user.id },
    },
    success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  return { url: session.url };
}
