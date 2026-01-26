import * as React from "react";
import { cn } from "@/lib/utils";

export type MobileHomeOneScreenProps = {
  className?: string;
};

export function MobileHomeOneScreen({ className }: MobileHomeOneScreenProps) {
  return (
    <section
      aria-label="XRak 移动端首页"
      className={cn("relative w-full flex-1 overflow-hidden", className)}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80vmax 60vmax at 50% 42%, rgba(127,127,127,0.10), transparent 58%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.0))",
          }}
        />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(127,127,127,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(127,127,127,0.28)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(64%_54%_at_50%_44%,#000_62%,transparent_100%)]" />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[28rem] flex-1 flex-col justify-center px-1 text-center">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center rounded-full border border-border/60 bg-background/35 px-3 py-1 text-[11px] font-medium tracking-[0.22em] text-foreground/70 backdrop-blur">
            XRak · 具身智能 × 万物互联
          </div>
        </div>

        <h1 className="mt-5 text-[clamp(28px,7.6vw,40px)] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground">
          把意图接入现实
        </h1>

        <p className="mt-4 text-sm leading-6 text-muted-foreground/90">
          我们用前沿研究驱动产品，以工程交付塑造工业奇迹，并把极致优雅带回每一次交互。
        </p>

        <div className="mt-7 flex items-center justify-center gap-2 text-[11px] font-medium tracking-[0.28em] text-foreground/55">
          <span>RESEARCH</span>
          <span className="h-1 w-1 rounded-full bg-foreground/25" />
          <span>ENGINEERING</span>
          <span className="h-1 w-1 rounded-full bg-foreground/25" />
          <span>SHIPPING</span>
        </div>

        <div className="mt-9 flex items-center justify-center">
          <div className="rounded-full bg-foreground/4 px-4 py-2 text-xs tracking-wide text-foreground/60 backdrop-blur">
            从右上角进入菜单，或在中心岛与我们对话
          </div>
        </div>
      </div>
    </section>
  );
}
