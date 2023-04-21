import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function SideNavigation(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <h2 className="text-base font-medium leading-3">{props.title}</h2>
      <div className="flex flex-col pt-4 md:pt-6">{props.children}</div>
    </div>
  );
}

SideNavigation.Item = SideNavigationItem;

function SideNavigationItem({
  children,
  href,
  active = false,
}: {
  children: React.ReactNode;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "select-none border-l px-4 py-1 text-sm transition",
        active ? "border-gray-600 font-semibold" : "hover:border-gray-400",
      )}
    >
      {children}
    </Link>
  );
}
