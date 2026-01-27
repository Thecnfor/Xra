import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodePathDisplay } from "./XraAi";
import { TextAnimate } from "@/components/features/meta/text-animate";

export function HomeHero() {
  return (
    <section className="relative w-full flex-1 flex flex-col justify-center md:flex md:items-stretch md:justify-stretch">
      {/* Mobile Layout: Flex Column */}
      <div className="flex flex-col relative items-center justify-center gap-8 px-6 text-center md:hidden">
        <div className="space-y-3">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            XRA STUDIO
          </h2>
          <h1 className="text-5xl font-bold tracking-tighter text-foreground">
            Digital
            <br />
            Nexus
          </h1>
        </div>

        <p className="max-w-[280px] text-muted-foreground text-sm leading-relaxed">
          <TextAnimate as="span" animation="blurInUp" by="character">
            以精准与极简，构建沉浸式网络体验的未来。
          </TextAnimate>
        </p>

        <Link
          href="/explore"
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-all hover:bg-foreground/90 active:scale-95"
        >
          Initialize
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <div className="w-full flex justify-center">
          <CodePathDisplay align="center" />
        </div>
      </div>

      {/* 桌面布局：网格 */}
      {/* 网格结构：12 列，4 行 */}
      {/* 避让区域：第 2-3 行，第 5-8 列（居中 4×2 块） */}
      <div className="hidden h-full w-full grid-cols-12 grid-rows-4 gap-4 md:absolute md:inset-0 md:grid">

        {/* 左侧内容区域：第 2-3 行，第 1-4 列 */}
        <div className="col-start-1 col-end-5 row-start-1 row-end-3 flex flex-col justify-center pl-12 lg:pl-20 relative">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs font-mono text-muted-foreground/60">01 / INTRODUCTION</p>
              <h1 className="text-6xl font-bold tracking-tighter lg:text-7xl xl:text-8xl">
                XRA
              </h1>
            </div>
            <p className="max-w-[260px] text-lg text-muted-foreground font-light leading-snug">
              <TextAnimate as="span" animation="blurInUp" by="character">
                以极简设计重塑边界，实现最大影响力。
              </TextAnimate>
            </p>
          </div>
          <div className="absolute bottom-0 w-full">
            <CodePathDisplay />
          </div>
        </div>

        {/* 右侧内容区域：第 2-3 行，第 9-12 列 */}
        {/* 右下角：版本号 + 快速入口 */}
        <div className="col-start-9 col-end-13 row-start-3 row-end-4 flex flex-col items-end justify-center pt-50 pr-12 lg:pr-20 text-right">
          <div className="flex flex-col items-end gap-6">
            {/* 版本信息 */}
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                Build
              </p>
              <p className="text-sm font-medium">v4.5.0</p>
            </div>

            {/* 快速入口 */}
            <Link
              href="/about"
              className="group flex items-center gap-3 text-lg font-medium transition-colors hover:text-muted-foreground"
            >
              关于我们
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 transition-colors group-hover:border-foreground/50 group-hover:bg-foreground/5">
                <ArrowRight className="h-4 w-4 -rotate-45 transition-transform group-hover:rotate-0" />
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
