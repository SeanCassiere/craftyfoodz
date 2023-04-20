import React from "react";
import Link from "next/link";
import { Command } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UI_CONFIG } from "@/lib/config";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const SiteHeader = () => {
  return (
    <div
      className={cn(
        "relative z-40 border-b px-3 font-sans sm:px-8",
        fontSans.variable,
      )}
    >
      <header className="relative mx-auto max-w-[1440px]">
        <div className="flex items-center pb-4 pt-3 md:pb-4 md:pt-6">
          <div className="mr-1 flex shrink-0 items-center">
            <Link href="/dashboard" aria-label="Go to dashboard">
              <Command className="mr-2 h-8 w-8" />
            </Link>
          </div>
          <div className="flex flex-grow items-center">
            <Link
              href="/dashboard"
              className="text-primary hidden items-center rounded p-1 text-lg font-medium leading-3 transition sm:flex"
            >
              Admin - {UI_CONFIG.company_name}
            </Link>
          </div>
          <div className="flex flex-none items-center">
            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/6.x/fun-emoji/svg?seed=Sean"
                alt="@seancassiere"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="-mb-px flex space-x-3 overflow-x-auto sm:space-x-0">
          <Link
            href="/dashboard"
            className="text-primary whitespace-nowrap border-b border-gray-600 pb-4 pt-1 font-semibold leading-none transition sm:px-2"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="text-primary whitespace-nowrap border-b border-transparent pb-4 pt-1 leading-none transition hover:border-gray-300 dark:hover:border-gray-600 sm:px-2"
          >
            Settings
          </Link>
        </div>
      </header>
    </div>
  );
};
