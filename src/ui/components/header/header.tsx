"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SEO_CONFIG } from "~/app";
import { useCurrentUser } from "~/lib/auth-client";
import { cn } from "~/lib/cn";
import { Cart } from "~/ui/components/cart";
import { Button } from "~/ui/primitives/button";
import { Skeleton } from "~/ui/primitives/skeleton";

import { NotificationsWidget } from "../notifications/notifications-widget";
import { ThemeToggle } from "../theme-toggle";
import { HeaderUserDropdown } from "./header-user";

interface HeaderProps {
  children?: React.ReactNode;
  isDashboard?: boolean;
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavigation = [
    { href: "/", name: "Home" },
    { href: "/products", name: "Products" },
  ];

  const dashboardNavigation = [
    // { href: "/dashboard/stats", name: "Stats" }, // TODO: !! enable when clerk-drizzle integration is complete
    { href: "/dashboard/profile", name: "Profile" },
    { href: "/dashboard/settings", name: "Settings" },
    // { href: "/dashboard/uploads", name: "Uploads" }, // TODO: !! enable when clerk-drizzle integration is complete
    { href: "/admin/summary", name: "Admin" },
  ];

  const isDashboard =
    user &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")); // todo: remove /admin when admin role is implemented
  const navigation = isDashboard ? dashboardNavigation : mainNavigation;

  if (!isLoaded) {
    return (
      <header
        className={`
          sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur
          supports-[backdrop-filter]:bg-background/60
        `}
      >
        <div
          className={`
            container mx-auto max-w-7xl px-4
            sm:px-6
            lg:px-8
          `}
        >
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link className="flex items-center gap-2" href="/">
                <span
                  className={cn(
                    `
                      bg-gradient-to-r from-primary to-primary/70 bg-clip-text
                      text-xl font-bold tracking-tight text-transparent
                    `,
                  )}
                >
                  {SEO_CONFIG.name}
                </span>
              </Link>
              <nav
                className={`
                  hidden
                  md:flex
                `}
              >
                <ul className="flex items-center gap-6">
                  <li>
                    <Skeleton className="h-6 w-16" />
                  </li>
                  <li>
                    <Skeleton className="h-6 w-20" />
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  const renderContent = () => (
    <header
      className={`
        sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur
        supports-[backdrop-filter]:bg-background/60
      `}
    >
      <div
        className={`
          container mx-auto max-w-7xl px-4
          sm:px-6
          lg:px-8
        `}
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2" href="/">
              <span
                className={cn(
                  "text-xl font-bold",
                  !isDashboard &&
                    `
                      bg-gradient-to-r from-primary to-primary/70 bg-clip-text
                      tracking-tight text-transparent
                    `,
                )}
              >
                {SEO_CONFIG.name}
              </span>
            </Link>
            <nav
              className={`
                hidden
                md:flex
              `}
            >
              <ul className="flex items-center gap-6">
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));

                  return (
                    <li key={item.name}>
                      <Link
                        className={cn(
                          `
                            text-sm font-medium transition-colors
                            hover:text-primary
                          `,
                          isActive
                            ? "font-semibold text-primary"
                            : "text-muted-foreground",
                        )}
                        href={item.href}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!isDashboard && <Cart />}

            <NotificationsWidget />

            {showAuth && (
              <div
                className={`
                  hidden
                  md:block
                `}
              >
                {isSignedIn ? (
                  <HeaderUserDropdown isDashboard={!!isDashboard} user={user} />
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/auth/sign-in">
                      <Button size="sm" variant="ghost">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button size="sm">Sign up</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {!isDashboard && <ThemeToggle />}

            {/* Mobile menu button */}
            <Button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              size="icon"
              variant="ghost"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-b px-4 py-3">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : `
                        text-foreground
                        hover:bg-muted/50 hover:text-primary
                      `,
                  )}
                  href={item.href}
                  key={item.name}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {showAuth && !isSignedIn && (
            <div className="space-y-1 border-b px-4 py-3">
              <Link
                className={`
                  block rounded-md px-3 py-2 text-base font-medium
                  hover:bg-muted/50
                `}
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                className={`
                  block rounded-md bg-primary px-3 py-2 text-base font-medium
                  text-primary-foreground
                  hover:bg-primary/90
                `}
                href="/auth/sign-up"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );

  return renderContent();
}
