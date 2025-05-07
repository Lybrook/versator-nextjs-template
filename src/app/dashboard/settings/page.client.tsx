"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Label } from "~/ui/primitives/label";
import { Skeleton } from "~/ui/primitives/skeleton";
import { Switch } from "~/ui/primitives/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/primitives/tabs";

export function SettingsPageClient() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div
        className={`
          container space-y-6 p-4
          md:p-8
        `}
      >
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  if (!isSignedIn || !user) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/sign-in";
    }
    return null;
  }

  async function handleDeleteAccount() {
    if (!user) return;
    const confirmed = window.confirm(
      "are you sure you want to delete your account? this cannot be undone.",
    );
    if (!confirmed) return;
    const res = await fetch("/api/delete-account", { method: "POST" });
    if (res.ok) {
      router.push("/");
    } else {
      alert("failed to delete account");
    }
  }

  return (
    <div
      className={`
        container space-y-6 p-4
        md:p-8
      `}
    >
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs className="space-y-4" defaultValue="profile">
        <TabsList>
          <TabsTrigger className="flex items-center gap-2" value="profile">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-2"
            value="notifications"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="security">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  defaultValue={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
                  id="name"
                  placeholder="Enter your name"
                  readOnly
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  defaultValue={user.emailAddresses?.[0]?.emailAddress || ""}
                  id="email"
                  placeholder="Enter your email"
                  readOnly
                  type="email"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch id="email-notifications" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <Switch id="marketing-emails" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="order-updates">Order Updates</Label>
                <Switch defaultChecked id="order-updates" />
              </div>
              <button className="btn" type="button">
                Save Preferences
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="space-y-4" value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <button
          className={`
            rounded bg-red-600 px-4 py-2 text-white
            hover:bg-red-700
          `}
          onClick={handleDeleteAccount}
          type="button"
        >
          delete my account
        </button>
      </div>
    </div>
  );
}
