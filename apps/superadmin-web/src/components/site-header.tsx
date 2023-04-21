import React, { type ReactNode } from "react";
import Link from "next/link";
import { Command } from "lucide-react";

import { api } from "@/lib/utils/api";
import { UI_CONFIG } from "@/lib/config";
import { fontSans } from "@/lib/fonts";
import { cn, makeProfileImageUrl } from "@/lib/utils";
import { UserAvatarNavigation } from "./user-avatar-navigation";

export const SiteHeader = ({ pathname }: { pathname: string }) => {
  const userQuery = api.auth.getUser.useQuery();

  const isSuperAdmin = userQuery.data?.role === "super_admin";

  const onFeaturesTab = (() => {
    return pathname.toLowerCase().startsWith("/features");
  })();
  const osRestaurantsTab = (() => {
    return pathname.toLowerCase().startsWith("/restaurants");
  })();
  const onSettingsTab = (() => {
    return pathname.toLowerCase().startsWith("/settings");
  })();

  return (
    <div
      className={cn(
        "relative z-40 border-b px-4 font-sans sm:px-8",
        fontSans.variable,
      )}
    >
      <header className="relative mx-auto max-w-[1440px]">
        <div className="flex items-center pb-4 pt-4 md:pb-6 md:pt-6">
          <div className="mr-1 flex shrink-0 items-center">
            <Link href="/restaurants" aria-label="Go to the restaurants page">
              <Command className="mr-2 h-8 w-8" />
            </Link>
          </div>
          <div className="flex flex-grow items-center">
            <Link
              href="/restaurants"
              className="hidden items-center rounded p-1 text-lg font-medium leading-3 transition sm:flex"
            >
              Admin - {UI_CONFIG.company_name}
            </Link>
          </div>
          <div className="flex flex-none items-center">
            <UserAvatarNavigation
              avatarImageUrl={makeProfileImageUrl(userQuery.data?.name || "")}
              avatarFallback={"UA"}
              name={userQuery.data?.name || ""}
              email={userQuery.data?.email || ""}
            />
          </div>
        </div>
        <div className="-mb-px flex space-x-4 overflow-x-auto sm:space-x-0">
          <NavLink href="/restaurants" active={osRestaurantsTab}>
            Restaurants
          </NavLink>

          {isSuperAdmin && (
            <>
              <NavLink href="/features" active={onFeaturesTab}>
                Features
              </NavLink>
            </>
          )}

          <NavLink href="/settings" active={onSettingsTab}>
            Settings
          </NavLink>
        </div>
      </header>
    </div>
  );
};

const NavLink = ({
  href,
  children,
  active,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "select-none whitespace-nowrap border-b pb-4 pt-1 leading-none transition sm:px-2",
        active
          ? "border-gray-600 font-semibold"
          : "hover:border-gray-300 dark:hover:border-gray-600",
      )}
    >
      {children}
    </Link>
  );
};
