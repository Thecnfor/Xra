"use client";

import * as React from "react";

export function useMenuPresence(open: boolean, exitMs: number) {
  const [present, setPresent] = React.useState(false);
  const shouldRender = open || present;

  React.useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }
    if (!present) return;
    const t = window.setTimeout(() => setPresent(false), exitMs);
    return () => window.clearTimeout(t);
  }, [open, present, exitMs]);

  return shouldRender;
}

export function useRestoreFocus(
  open: boolean,
  focusOnOpenRef?: React.RefObject<HTMLElement | null>,
) {
  const lastActiveRef = React.useRef<HTMLElement | null>(null);
  const wasOpenRef = React.useRef(false);

  React.useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      lastActiveRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      focusOnOpenRef?.current?.focus?.({ preventScroll: true });
      return;
    }
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    lastActiveRef.current?.focus?.({ preventScroll: true });
  }, [open, focusOnOpenRef]);
}

export function useEscapeToClose(open: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
}

export function useLockBodyScroll(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [locked]);
}
