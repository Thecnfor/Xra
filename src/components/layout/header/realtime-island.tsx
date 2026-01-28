"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DynamicIsland, type IslandMessage } from "./dynamic-island";

type IslandEventDetail = Omit<IslandMessage, "id" | "summary"> & {
  id?: string;
  summary: string;
};

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeMessage(detail: IslandEventDetail): IslandMessage {
  return {
    id: detail.id ?? createId(),
    title: detail.title,
    summary: detail.summary,
    detail: detail.detail,
    href: detail.href,
    receivedAt: detail.receivedAt ?? Date.now(),
  };
}

export function RealtimeIsland() {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const device = isDesktop ? "desktop" : "mobile";

  const [messages, setMessages] = React.useState<IslandMessage[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [phase, setPhase] = React.useState<"ball" | "pill">("pill");
  const [interacting, setInteracting] = React.useState(false);

  const activeMessage = React.useMemo(
    () => messages.find((m) => m.id === activeId) ?? null,
    [messages, activeId],
  );
  const activeMessageId = activeMessage?.id ?? null;

  const dismissActive = React.useCallback(() => {
    setExpanded(false);
    setPhase("pill");
    setMessages((prev) => {
      if (!activeId) return prev;
      const next = prev.filter((m) => m.id !== activeId);
      const fallback = next.at(0)?.id ?? null;
      setActiveId(fallback);
      if (fallback) {
        setPhase(isDesktop ? "pill" : "ball");
      }
      return next;
    });
  }, [activeId, isDesktop]);

  React.useEffect(() => {
    const onPush = (e: Event) => {
      const evt = e as CustomEvent<IslandEventDetail>;
      const msg = normalizeMessage(evt.detail);

      setMessages((prev) => [msg, ...prev].slice(0, 20));
      setActiveId(msg.id);
      setExpanded(false);
      setInteracting(false);
      setPhase(isDesktop ? "pill" : "ball");
    };

    window.addEventListener("xra:island", onPush as EventListener);
    return () => window.removeEventListener("xra:island", onPush as EventListener);
  }, [isDesktop]);

  React.useEffect(() => {
    if (!activeMessageId) return;
    if (device === "desktop") {
      setPhase("pill");
      return;
    }
    setPhase("ball");
    const t = window.setTimeout(() => setPhase("pill"), 260);
    return () => window.clearTimeout(t);
  }, [activeMessageId, device]);

  React.useEffect(() => {
    if (!activeMessageId) return;
    if (expanded) return;
    if (interacting) return;
    if (phase !== "pill") return;

    const t = window.setTimeout(() => dismissActive(), 8000);
    return () => window.clearTimeout(t);
  }, [activeMessageId, dismissActive, expanded, interacting, phase]);

  if (!activeMessage) return null;

  return (
    <DynamicIsland
      message={activeMessage}
      recentMessages={messages}
      phase={phase}
      expanded={expanded}
      device={device}
      onExpand={() => setExpanded(true)}
      onCollapse={() => setExpanded(false)}
      onDismiss={dismissActive}
      onSelectMessage={(id) => setActiveId(id)}
      onInteractionChange={setInteracting}
    />
  );
}
