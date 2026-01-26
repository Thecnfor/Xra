import * as React from "react";

export type SubtitleLine = {
  id: string;
  text: string;
  typed: number;
  done: boolean;
};

export type UseSubtitleStreamOptions = {
  script: readonly string[];
  maxLines: number;
  charsPerSecond?: number;
  lineGapMs?: number;
  initialDelayMs?: number;
  activityEventName?: string;
  activityThrottleMs?: number;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

export function useSubtitleStream({
  script,
  maxLines,
  charsPerSecond = 22,
  lineGapMs = 780,
  initialDelayMs = 360,
  activityEventName = "xra:hero-stream",
  activityThrottleMs = 50,
}: UseSubtitleStreamOptions) {
  const [lines, setLines] = React.useState<SubtitleLine[]>([]);
  const maxLinesRef = React.useRef(maxLines);
  const throttleRef = React.useRef({ lastAt: 0, lastTyped: -1, lineId: "" });

  React.useEffect(() => {
    maxLinesRef.current = maxLines;
  }, [maxLines]);

  React.useEffect(() => {
    let cancelled = false;
    let scriptIndex = 0;

    const emitActivity = (lineId: string, typed: number) => {
      const now = performance.now();
      const state = throttleRef.current;
      const deltaChars = state.lineId !== lineId ? typed : Math.max(0, typed - state.lastTyped);
      const shouldEmit =
        state.lineId !== lineId ||
        typed !== state.lastTyped &&
          (now - state.lastAt >= activityThrottleMs || typed - state.lastTyped >= 3);
      if (!shouldEmit) return;
      state.lastAt = now;
      state.lastTyped = typed;
      state.lineId = lineId;
      window.dispatchEvent(
        new CustomEvent(activityEventName, {
          detail: {
            at: Date.now(),
            deltaChars,
            cps: charsPerSecond,
          },
        }),
      );
    };

    const typeLine = async (text: string) => {
      const id = createId();
      throttleRef.current = { lastAt: 0, lastTyped: -1, lineId: id };

      setLines((prev) => {
        const next = [...prev, { id, text, typed: 0, done: false }];
        const overflow = next.length - maxLinesRef.current;
        if (overflow <= 0) return next;
        return next.slice(overflow);
      });

      await new Promise<void>((resolve) => {
        const startedAt = performance.now();
        let lastTyped = 0;

        const tick = (now: number) => {
          if (cancelled) return resolve();
          const typed = Math.min(text.length, Math.floor(((now - startedAt) / 1000) * charsPerSecond));
          if (typed !== lastTyped) {
            lastTyped = typed;
            emitActivity(id, typed);
            setLines((prev) => prev.map((l) => (l.id === id ? { ...l, typed } : l)));
          }
          if (typed >= text.length) return resolve();
          window.requestAnimationFrame(tick);
        };

        window.requestAnimationFrame(tick);
      });

      if (cancelled) return;
      setLines((prev) => prev.map((l) => (l.id === id ? { ...l, done: true } : l)));
    };

    const run = async () => {
      await sleep(initialDelayMs);
      while (!cancelled) {
        const text = script[scriptIndex] ?? script[0] ?? "";
        await typeLine(text);
        await sleep(lineGapMs);
        scriptIndex = script.length > 0 ? (scriptIndex + 1) % script.length : 0;
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [activityEventName, activityThrottleMs, charsPerSecond, initialDelayMs, lineGapMs, script]);

  return lines;
}
