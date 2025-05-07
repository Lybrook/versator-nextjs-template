"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { syncAfterSuccess } from "./page.actions";

export function SuccessClientContent() {
  const [status, setStatus] = useState<"error" | "loading" | "success">(
    "loading",
  );
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    // call sync server action
    syncAfterSuccess(sessionId)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "loading") {
    return <div className="p-8 text-center">syncing your subscription...</div>;
  }
  if (status === "success") {
    return <div className="p-8 text-center">subscription activated! 🎉</div>;
  }
  return (
    <div className="p-8 text-center text-red-600">
      something went wrong. please contact support.
    </div>
  );
}
