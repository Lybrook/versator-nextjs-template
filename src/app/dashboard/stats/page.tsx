import { getCurrentUserOrRedirect } from "~/lib/auth";

import { DashboardPageClient } from "./page.client";

export default async function DashboardPage() {
  const user = await getCurrentUserOrRedirect();

  return <DashboardPageClient user={user} />;
}
