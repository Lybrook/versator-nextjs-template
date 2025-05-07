"use client";

import { User } from "lucide-react";

import { ClerkUserProfile, useCurrentUser } from "~/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/primitives/card";
import { Input } from "~/ui/primitives/input";
import { Label } from "~/ui/primitives/label";
import { Skeleton } from "~/ui/primitives/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/primitives/tabs";

export function ProfilePageClient() {
  const { isLoaded, isSignedIn, user } = useCurrentUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/sign-in";
    }
    return null;
  }

  return (
    <div
      className={`
        container space-y-6 p-4
        md:p-8
      `}
    >
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Manage your profile and security settings.
        </p>
      </div>

      <Tabs className="space-y-4" defaultValue="general">
        <TabsList>
          <TabsTrigger className="flex items-center gap-2" value="general">
            <User className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="security">
            <User className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="general">
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

        <TabsContent className="space-y-4" value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <ClerkUserProfile />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
