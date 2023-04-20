import React from "react";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={cn("min-h-screen font-sans", fontSans.variable)}>
      {children}
    </main>
  );
};
