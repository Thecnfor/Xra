"use client";

import * as React from "react";
import { selectSetRouteLoading, useAppStore } from "@/stores";

export function RouteLoadingBridge() {
  const setRouteLoading = useAppStore(selectSetRouteLoading);

  React.useEffect(() => {
    setRouteLoading(true);
    document.documentElement.dataset.xraRouteLoading = "1";
    document.documentElement.dataset.xraRouteLoadingPhase = "enter";
    const raf = window.requestAnimationFrame(() => {
      document.documentElement.dataset.xraRouteLoadingPhase = "active";
    });

    return () => {
      window.cancelAnimationFrame(raf);
      setRouteLoading(false);
      delete document.documentElement.dataset.xraRouteLoading;
      delete document.documentElement.dataset.xraRouteLoadingPhase;
    };
  }, [setRouteLoading]);

  return null;
}
