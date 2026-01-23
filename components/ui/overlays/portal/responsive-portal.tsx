"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/hooks/use-media-query";

export type ResponsivePortalProps = {
  children: React.ReactNode;
  query: string;
  whenTrueTargetId: string;
  whenFalseTargetId: string;
};

export function ResponsivePortal({
  children,
  query,
  whenTrueTargetId,
  whenFalseTargetId,
}: ResponsivePortalProps) {
  const matches = useMediaQuery(query);
  if (typeof document === "undefined") return children;

  const target = document.getElementById(
    matches ? whenTrueTargetId : whenFalseTargetId,
  );
  if (!target) return children;

  return createPortal(children, target);
}

