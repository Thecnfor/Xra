"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type OverlayContentProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "role" | "aria-modal" | "aria-label"
> & {
  label?: string;
};

export const OverlayContent = React.forwardRef<HTMLDivElement, OverlayContentProps>(
  function OverlayContent({ label, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(className)}
        {...props}
      />
    );
  },
);

