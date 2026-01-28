"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const XrakCarrierOverlayClient = dynamic(() => import("./XrakCarrierOverlay.client"), { ssr: false });

type IdleCallbackOptions = { timeout?: number };
type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: IdleCallbackOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};
type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

export default function XrakCarrierOverlayLazy() {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData ?? false;
    if (reducedMotion || saveData) return;

    let cancelled = false;
    const enable = () => {
      if (cancelled) return;
      setEnabled(true);
    };

    window.addEventListener("pointerdown", enable, { once: true, passive: true });
    window.addEventListener("keydown", enable, { once: true, passive: true });

    const w = window as unknown as IdleWindow;
    const idleHandle =
      w.requestIdleCallback?.(enable, { timeout: 2500 }) ?? window.setTimeout(enable, 2500);

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      w.cancelIdleCallback?.(idleHandle);
      window.clearTimeout(idleHandle);
    };
  }, []);

  return enabled ? <XrakCarrierOverlayClient /> : null;
}
