import { LogOut, Settings, Shield, Upload, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { UserRawType } from "~/lib/auth-types";

import { cn } from "~/lib/cn";
import { Button } from "~/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/primitives/dropdown-menu";

export function HeaderUserDropdown({
  isDashboard = false,
  user,
}: { isDashboard: boolean; user: UserRawType }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative overflow-hidden rounded-full"
          size="icon"
          variant="ghost"
        >
          {user.hasImage ? (
            <Image
              alt={user.username || "User"}
              className="h-9 w-9 rounded-full object-cover"
              height={36}
              src={user.imageUrl}
              width={36}
            />
          ) : (
            <span
              className={`
                w8 flex h-8 items-center justify-center rounded-full bg-muted
              `}
            >
              <UserIcon className="h-4 w-4" />
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div
            className={`
              w8 flex h-8 items-center justify-center rounded-full bg-primary/10
            `}
          >
            {user.hasImage ? (
              <Image
                alt={user.username || "User"}
                className="h-7 w-7 rounded-full object-cover"
                height={28}
                src={user.imageUrl}
                width={28}
              />
            ) : (
              <UserIcon className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.username || "User"}</p>
            <p
              className={"max-w-[160px] truncate text-xs text-muted-foreground"}
            >
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/dashboard/uploads">
            <Upload className="mr-2 h-4 w-4" />
            Uploads
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href="/admin/summary">
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className={cn(
            "cursor-pointer",
            isDashboard
              ? "text-red-600"
              : `
                txt-destructive
                focus:text-destrctive
              `,
          )}
        >
          <Link href="/auth/sign-out">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
