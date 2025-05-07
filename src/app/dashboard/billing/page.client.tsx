"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { Skeleton } from "~/ui/primitives/skeleton";

import { createStripeCheckoutSession } from "./page.actions";

const PLANS = [
  {
    description: "basic features for everyone",
    id: "free",
    name: "Free",
    price: 0,
  },
  {
    description: "all features, priority support, and more",
    id: "pro",
    name: "Pro",
    price: 12,
    stripePriceId:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
      "pro_price_id_placeholder",
  },
];

interface SubscriptionResponse {
  subscriptionPlan: string;
}

export default function BillingPageClient() {
  const [sub, setSub] = useState<null | SubscriptionResponse>(null);

  useEffect(() => {
    async function fetchSub() {
      const r = await fetch("/api/billing/subscription");
      const data = (await r.json()) as SubscriptionResponse;
      setSub(data);
    }
    void fetchSub();
  }, []);

  if (!sub) {
    return (
      <div className="container mx-auto max-w-xl space-y-8 py-10">
        <Skeleton className="mb-4 h-8 w-1/2" />
        <div className="grid gap-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl space-y-8 py-10">
      <h2 className="mb-4 text-2xl font-bold">Billing & Subscription</h2>
      <div className="grid gap-6">
        {PLANS.map((plan) => {
          const isCurrent = sub.subscriptionPlan === plan.id;
          return (
            <div
              className={
                isCurrent
                  ? `
                    flex flex-col gap-2 rounded-lg border border-blue-600
                    bg-blue-50 p-6
                  `
                  : `flex flex-col gap-2 rounded-lg border border-gray-200 p-6`
              }
              key={plan.id}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{plan.name}</div>
                  <div className="text-gray-500">{plan.description}</div>
                </div>
                <div className="text-2xl font-bold">
                  {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                </div>
              </div>
              {isCurrent ? (
                <span
                  className={`
                    mt-2 inline-block rounded bg-blue-100 px-3 py-1 text-xs
                    text-blue-700
                  `}
                >
                  current plan
                </span>
              ) : plan.id === "pro" ? (
                <UpgradeButton />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpgradeButton() {
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      action={async () => {
        const res = await createStripeCheckoutSession();
        if (res.url) {
          window.location.href = res.url;
        }
      }}
      ref={formRef}
    >
      <button
        className={`
          mt-2 rounded bg-blue-600 px-4 py-2 text-white
          hover:bg-blue-700
          disabled:opacity-50
        `}
        disabled={pending}
        type="submit"
      >
        {pending ? "Redirecting..." : "Upgrade to Pro"}
      </button>
    </form>
  );
}
