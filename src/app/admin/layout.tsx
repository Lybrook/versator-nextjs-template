import type React from "react";

import { redirect } from "next/navigation";

import { auth } from "~/lib/auth";

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      {children}
    </div>
  );
}
