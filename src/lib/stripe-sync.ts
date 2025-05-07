import type StripeType from "stripe";

import { eq } from "drizzle-orm";

import { db } from "~/db";
import { userTable } from "~/db/schema/users/tables";

import { kv } from "./kv";
import { stripe } from "./stripe";

export type STRIPE_SUB_CACHE =
  | {
      cancelAtPeriodEnd: boolean;
      currentPeriodEnd: null | number;
      currentPeriodStart: null | number;
      paymentMethod: null | {
        brand: null | string;
        last4: null | string;
      };
      priceId: null | string;
      status: StripeType.Subscription.Status;
      subscriptionId: null | string;
    }
  | {
      status: "none";
    };

export async function syncStripeDataToKV(
  customerId: string,
): Promise<STRIPE_SUB_CACHE> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    expand: ["data.default_payment_method"],
    limit: 1,
    status: "all",
  });

  let plan: "free" | "pro" = "free";
  let status: "none" | StripeType.Subscription.Status = "none";

  if (subscriptions.data.length === 0) {
    const subData: STRIPE_SUB_CACHE = { status: "none" };
    await kv.set(`stripe:customer:${customerId}`, subData);
    // downgrade user to free if found
    await db
      .update(userTable)
      .set({ subscriptionPlan: "free" })
      .where(eq(userTable.stripeCustomerId, customerId));
    return subData;
  }

  const subscription = subscriptions.data[0];
  const item = subscription.items.data[0];
  status = subscription.status;
  if (status === "active" || status === "trialing") {
    plan = "pro";
  }

  const subData: STRIPE_SUB_CACHE = {
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: item?.current_period_end ?? null,
    currentPeriodStart: item?.current_period_start ?? null,
    paymentMethod:
      subscription.default_payment_method &&
      typeof subscription.default_payment_method !== "string"
        ? {
            brand: subscription.default_payment_method.card?.brand ?? null,
            last4: subscription.default_payment_method.card?.last4 ?? null,
          }
        : null,
    priceId: item?.price.id ?? null,
    status: subscription.status,
    subscriptionId: subscription.id,
  };
  await kv.set(`stripe:customer:${customerId}`, subData);
  // update user in db
  await db
    .update(userTable)
    .set({
      stripeCustomerId: customerId,
      subscriptionPlan: plan,
    })
    .where(eq(userTable.stripeCustomerId, customerId));
  return subData;
}
