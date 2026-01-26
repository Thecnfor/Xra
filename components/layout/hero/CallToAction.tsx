import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

type BubbleHintState = {
  open: boolean;
  hint: string;
};

const BUBBLE_HINTS: readonly string[] = [
  "今天也要好好对话。",
  "Xra 正在生成…",
  "把问题说短一点。",
  "按住 Xra：打开聊天",
];

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function useBubbleHint(): BubbleHintState {
  const [open, setOpen] = React.useState(false);
  const [hintIndex, setHintIndex] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    let idx = 0;

    const run = async () => {
      await sleep(900);
      while (!cancelled) {
        idx = (idx + 1) % BUBBLE_HINTS.length;
        setHintIndex(idx);
        setOpen(true);
        await sleep(3800);
        setOpen(false);
        await sleep(1200);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { open, hint: BUBBLE_HINTS[hintIndex] ?? BUBBLE_HINTS[0] ?? "" };
}

const STAGE_SIZE = "clamp(320px, 60vmin, 720px)";
const BUBBLE_ANCHOR_STYLE = { width: 0, height: 0, "--stage-size": STAGE_SIZE } as React.CSSProperties;

export function CallToAction({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const { open: bubbleOpen, hint: bubbleHint } = useBubbleHint();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) {
    return (
      <div
        aria-hidden="true"
        className="fixed left-0 right-0 z-[80] top-[calc(env(safe-area-inset-top)+4.25rem)] pointer-events-none px-4"
      >
        <div className={["flex justify-center", prefersReducedMotion ? "" : "animate-[xra-float_6.8s_ease-in-out_infinite]"].join(" ")}>
          <AnimatePresence initial={false}>
            {bubbleOpen ? (
              <motion.div
                key={bubbleHint}
                initial={{ opacity: 0, scale: 0.96, y: -6, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, y: -10, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 520, damping: 36 }}
                className="relative max-w-[min(22rem,calc(100vw-2rem))] rounded-[999px] surface-glass px-4 py-2 text-[13px] leading-snug text-foreground/88 shadow-sm shadow-black/5 dark:shadow-black/30"
                style={{ borderRadius: 9999 }}
              >
                <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-linear-to-r from-transparent via-foreground/14 to-transparent" />
                <span className="whitespace-nowrap">{bubbleHint}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed left-1/2 top-1/2 z-[75] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={BUBBLE_ANCHOR_STYLE}
    >
      <div
        style={{
          transform:
            "translate(calc(var(--stage-size) / 2 - 3.75rem), calc(var(--stage-size) / -2 + 3.25rem))",
        }}
      >
        <div className={prefersReducedMotion ? "" : "animate-[xra-float_6.8s_ease-in-out_infinite]"}>
          <AnimatePresence initial={false}>
            {bubbleOpen ? (
              <motion.div
                key={bubbleHint}
                initial={{ opacity: 0, scale: 0.96, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, y: -8, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 520, damping: 36 }}
                className="relative max-w-[min(18rem,calc(100vw-4rem))] rounded-[999px] surface-glass px-4 py-2 text-[13px] leading-snug text-foreground/88 shadow-sm shadow-black/5 dark:shadow-black/30"
                style={{ borderRadius: 9999 }}
              >
                <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-linear-to-r from-transparent via-foreground/14 to-transparent" />
                <span className="whitespace-nowrap">{bubbleHint}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
