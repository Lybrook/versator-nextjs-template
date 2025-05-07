"use client";

import { useState } from "react";

import { Button } from "~/ui/primitives/button";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    const res = await fetch("/api/stripe/generate-checkout", {
      method: "POST",
    });
    const data = (await res.json()) as { url?: string };
    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
      alert("failed to start checkout");
    }
  }

  return (
    <Button
      className="h-12 px-8"
      disabled={loading}
      onClick={handleSubscribe}
      size="lg"
      variant="secondary"
    >
      {loading ? "Redirecting..." : "Subscribe"}
    </Button>
  );
}
