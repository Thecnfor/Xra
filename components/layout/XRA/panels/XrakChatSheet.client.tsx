"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sheet } from "@/overlays";
import { useMediaQuery } from "@/hooks/use-media-query";

export type XrakChatSheetProps = {
  open: boolean;
  onClose: () => void;
  desktopSide?: "left" | "right";
  className?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function XrakChatSheet({
  open,
  onClose,
  desktopSide = "right",
  className,
}: XrakChatSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const side = isDesktop ? desktopSide : "bottom";
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => [
    {
      id: createId(),
      role: "assistant",
      content: "XRak 载体已上线。对话能力正在接入中（当前仅为 UI 骨架）。",
    },
  ]);
  const [input, setInput] = React.useState("");
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const raf = window.requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [open, messages.length]);

  const send = React.useCallback(() => {
    const value = input.trim();
    if (!value) return;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", content: value },
      { id: createId(), role: "assistant", content: "已收到。下一步会接入模型与工具调用。" },
    ]);
  }, [input]);

  return (
    <Sheet
      className={className}
      open={open}
      onClose={onClose}
      side={side}
      label="XRak 聊天"
      overlayClassName={cn(
        "bg-black/16 backdrop-blur-[2px]",
        side === "right"
          ? "bg-linear-to-l from-foreground/10 via-black/12 to-black/8 dark:from-black/55 dark:via-black/30 dark:to-black/18"
          : side === "left"
            ? "bg-linear-to-r from-foreground/10 via-black/12 to-black/8 dark:from-black/55 dark:via-black/30 dark:to-black/18"
            : null,
      )}
      panelClassName={cn(
        "surface-glass shadow-2xl shadow-black/10 dark:shadow-black/40",
        "p-0 overflow-hidden",
        side === "right"
          ? "rounded-l-4xl"
          : side === "left"
            ? "rounded-r-4xl"
            : "rounded-t-4xl",
      )}
    >
      <div className="relative flex h-full flex-col bg-background/55 backdrop-blur-2xl backdrop-saturate-150">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-foreground/14 to-transparent" />

        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/35" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold tracking-tight">XRak</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Embodied Web Carrier</div>
          </div>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-foreground/8 text-foreground"
                    : "bg-background/40 text-foreground/90 border border-border/55",
                )}
              >
                {m.content}
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
          <div className="flex items-end gap-3 rounded-3xl border border-border/60 bg-background/40 backdrop-blur-sm px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的指令（稍后接入模型）"
              rows={1}
              className="min-h-[1.5rem] max-h-28 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/80"
              onKeyDown={(e) => {
                if (e.key !== "Enter" || e.shiftKey) return;
                e.preventDefault();
                send();
              }}
            />
            <button
              type="button"
              onClick={send}
              className="inline-flex h-9 items-center rounded-full bg-foreground/10 px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/14 focus-ring"
            >
              发送
            </button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">仅本地占位；Esc / 点击遮罩可关闭</div>
        </div>
      </div>
    </Sheet>
  );
}
