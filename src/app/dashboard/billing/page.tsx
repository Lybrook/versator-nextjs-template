import { Suspense } from "react";

import BillingPageClient from "./page.client";

export default function BillingPage() {
  return (
    <Suspense fallback={<div>loading billing info...</div>}>
      <BillingPageClient />
    </Suspense>
  );
}
