import { Suspense } from "react";

import { Skeleton } from "~/ui/primitives/skeleton";

import { SuccessClientContent } from "./page.client";

export default function SuccessPage() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto my-8 h-6 w-48" />}>
      <SuccessClientContent />
    </Suspense>
  );
}
