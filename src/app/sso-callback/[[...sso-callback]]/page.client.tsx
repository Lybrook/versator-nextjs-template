"use client";

import type { HandleOAuthCallbackParams } from "@clerk/types";

import { useClerk } from "@clerk/nextjs";
import { Circle } from "lucide-react";
import { useEffect } from "react";

export default function SSOCallback({
  searchParams,
}: {
  searchParams: HandleOAuthCallbackParams;
}) {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    void handleRedirectCallback(searchParams);
  }, [searchParams, handleRedirectCallback]);

  return (
    <div
      aria-describedby="loading-description"
      aria-label="Loading"
      className="flex items-center justify-center"
      role="status"
    >
      <Circle aria-hidden="true" className="w-h-12 animate-caret-blink h-12" />
    </div>
  );
}
