import React from "react";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function ContentToContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "min-h-full w-full px-4 font-sans sm:px-8",
        fontSans.variable,
      )}
    >
      <div className={cn("mx-auto max-w-[1248px] pt-6")}>{children}</div>
    </div>
  );
}
