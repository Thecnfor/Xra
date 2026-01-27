"use client";

import * as React from "react";
import { useAppStore } from "@/stores/provider";
import { selectSetXraBranchActive } from "@/stores/selectors";

export function XraBranchBridge() {
  const setXraBranchActive = useAppStore(selectSetXraBranchActive);

  React.useEffect(() => {
    setXraBranchActive(true);
    return () => setXraBranchActive(false);
  }, [setXraBranchActive]);

  return null;
}

