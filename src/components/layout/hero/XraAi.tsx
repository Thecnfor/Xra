"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

const DEFAULT_SCRIPT: readonly string[] = [
  "Xra 正在对齐感知流…",
  "把注意力放在中心：那不是图标，是一颗会呼吸的介质。",
  "AI 不在屏幕里，它在你与世界之间。",
  "具身智能：输入不是指令，是意图；输出不是答案，是行动。",
  "让字幕像呼吸一样出现，让消失像记忆一样退场。",
  "按住 Xra：打开聊天；轻触：唤醒。",
];

type Token = {
  id: string;
  text: string;
  isWhitespace: boolean;
  isPunct: boolean;
};

function tokenizeForStream(input: string): Token[] {
  const parts =
    input.match(/(\s+|[A-Za-z0-9]+(?:[’'_-][A-Za-z0-9]+)*|[\u4E00-\u9FFF]|[^\s])/g) ?? [];

  return parts.map((text, index) => {
    const isWhitespace = /^\s+$/.test(text);
    const isPunct = !isWhitespace && /^[，。！？；：、,.!?;:…—-]$/.test(text);
    return {
      id: `${index}-${text}`,
      text,
      isWhitespace,
      isPunct,
    };
  });
}

function randInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function CodePathDisplay({
  lines = DEFAULT_SCRIPT,
  activityEventName = "xra:hero-stream",
  cps = 22,
  initialDelayMs = 360,
  align = "left",
}: {
  lines?: readonly string[];
  activityEventName?: string;
  cps?: number;
  initialDelayMs?: number;
  align?: "left" | "center";
}) {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [visible, setVisible] = React.useState<ReadonlyArray<{ id: string; tokens: readonly Token[] }>>([]);
  const streamRef = React.useRef<{ line: number; token: number; cycle: number }>({ line: 0, token: 0, cycle: 0 });
  const tokensByLine = React.useMemo(() => lines.map((l) => tokenizeForStream(l)), [lines]);

  React.useEffect(() => {
    streamRef.current = { line: 0, token: 0, cycle: 0 };
    if (tokensByLine.length === 0) {
      setVisible([]);
      return;
    }
    if (prefersReducedMotion) {
      const initialCount = Math.min(2, tokensByLine.length);
      setVisible(
        Array.from({ length: initialCount }, (_, i) => ({
          id: `${i}-0`,
          tokens: tokensByLine[i] ?? [],
        })),
      );
      return;
    }
    setVisible([{ id: "0-0", tokens: [] }]);

    let cancelled = false;
    let timer = 0;

    const emitActivity = (deltaChars: number) => {
      window.dispatchEvent(new CustomEvent(activityEventName, { detail: { deltaChars, cps } }));
    };

    const scheduleNext = (delay: number) => {
      timer = window.setTimeout(tick, delay);
    };

    const tick = () => {
      if (cancelled) return;
      const pos = streamRef.current;
      const lineTokens = tokensByLine[pos.line];
      if (!lineTokens) return;

      const token = lineTokens[pos.token];
      if (!token) {
        const nextLine = (pos.line + 1) % tokensByLine.length;
        const nextCycle = nextLine === 0 ? pos.cycle + 1 : pos.cycle;
        streamRef.current = { line: nextLine, token: 0, cycle: nextCycle };
        setVisible((prev) => {
          const next = [...prev, { id: `${nextLine}-${nextCycle}`, tokens: [] as const }];
          return next.length > 2 ? next.slice(next.length - 2) : next;
        });
        scheduleNext(randInt(140, 260) + (nextLine === 0 ? 180 : 0));
        return;
      }

      streamRef.current = { line: pos.line, token: pos.token + 1, cycle: pos.cycle };
      setVisible((prev) => {
        if (prev.length === 0) return prev;
        const lastIndex = prev.length - 1;
        const current = prev[lastIndex];
        if (!current) return prev;
        const updated = { ...current, tokens: [...current.tokens, token] };
        const next = prev.slice();
        next[lastIndex] = updated;
        return next.length > 2 ? next.slice(next.length - 2) : next;
      });

      if (!token.isWhitespace) {
        const deltaChars = token.text.replace(/\s+/g, "").length || 1;
        emitActivity(deltaChars);
      }

      const base = token.isWhitespace ? randInt(6, 18) : randInt(35, 85);
      const punctExtra = token.isPunct ? randInt(90, 180) : 0;
      scheduleNext(base + punctExtra);
    };

    timer = window.setTimeout(tick, initialDelayMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activityEventName, cps, initialDelayMs, prefersReducedMotion, tokensByLine]);

  const rowHeightPx = 13;
  const rowGapPx = 4;
  const secondRowY = rowHeightPx + rowGapPx;
  const containerHeight = rowHeightPx * 2 + rowGapPx;

  return (
    <div
      className="relative w-full overflow-hidden font-mono text-[10px] leading-tight text-muted-foreground/60 select-none"
      style={{ height: containerHeight }}
    >
      <AnimatePresence initial={false}>
        {visible.map((line, index) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 10, filter: "blur(10px)", clipPath: "inset(0 0% 0 0%)" }}
            animate={{
              opacity: 1,
              y: index === 0 ? 0 : secondRowY,
              filter: "blur(0px)",
              clipPath: "inset(0 0% 0 0%)",
            }}
            exit={{
              opacity: 0,
              y: -10,
              filter: "blur(10px)",
              clipPath: "inset(0 100% 0 0%)",
            }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
            className={[
              "absolute inset-x-0 top-0 overflow-hidden text-ellipsis whitespace-nowrap will-change-transform",
              align === "center" ? "text-center" : "text-left",
            ].join(" ")}
          >
            {line.tokens.map((t, tokenIndex) => (
              <motion.span
                key={`${line.id}-${t.id}-${tokenIndex}`}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.36, ease: "easeOut" }}
                className="inline-block will-change-[filter,opacity]"
              >
                {t.text}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
