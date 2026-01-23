import type React from "react";
import Link from "next/link";
import {
  Blocks,
  Database,
  Fingerprint,
  PlugZap,
  Radar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/features/container";
import { buttonVariants } from "@/features/meta/button";

type HeroHighlight = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const highlights: HeroHighlight[] = [
  {
    title: "全栈能力",
    description: "展示页、API、数据库、缓存与权限体系一体化。",
    Icon: Blocks,
  },
  {
    title: "数据层",
    description: "Prisma + Postgres + Redis，性能与一致性兼顾。",
    Icon: Database,
  },
  {
    title: "认证与安全",
    description: "可扩展的认证流程，支持面向产品的权限边界。",
    Icon: Fingerprint,
  },
  {
    title: "Home Assistant 集成",
    description: "面向设备与自动化场景的插件接口与联动能力。",
    Icon: PlugZap,
  },
];

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-foreground/70 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Stagger({
  children,
  delayMs = 0,
  className,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out motion-reduce:animate-none",
        className,
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="w-full" aria-label="首页介绍">
      <Container className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-linear-to-br from-foreground/[0.10] via-foreground/[0.04] to-transparent blur-3xl dark:from-white/[0.10] dark:via-white/[0.04]" />
          <div className="absolute -bottom-32 right-[-10%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08)_0%,transparent_65%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_65%)]" />
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Stagger delayMs={80}>
              <div className="flex flex-wrap items-center gap-3">
                <Tag>XRA · FULLSTACK PLATFORM</Tag>
                <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-background/35 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur-sm sm:flex">
                  <Radar className="h-3.5 w-3.5" />
                  <span className="tracking-[0.14em]">NEXT 16 · REACT 19</span>
                </div>
              </div>
            </Stagger>

            <Stagger delayMs={150}>
              <h1 className="mt-6 max-w-[18ch] text-balance text-[clamp(2.45rem,5.8vw,4.6rem)] font-semibold leading-[0.95] tracking-tight">
                <span className="bg-linear-to-br from-foreground via-foreground/75 to-foreground/35 bg-clip-text text-transparent">
                  把产品、数据与自动化，整合进一个全栈平台
                </span>
              </h1>
            </Stagger>

            <Stagger delayMs={220}>
              <p className="mt-6 max-w-[56ch] text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                Xra 是一个综合型全栈网站工程：对外展示、API、数据库、用户认证与
                Home Assistant 集成协同工作，帮你用更少的系统拼装，做出更完整的体验。
              </p>
            </Stagger>

            <Stagger delayMs={300}>
              <nav className="mt-8 flex flex-wrap items-center gap-3" aria-label="首页操作">
                <Link
                  href="#capabilities"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "shadow-sm shadow-black/10 dark:shadow-black/40",
                  )}
                >
                  探索能力
                </Link>
                <Link
                  href="#stack"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "bg-background/30 backdrop-blur-sm",
                  )}
                >
                  查看技术栈
                </Link>

                <div className="ml-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <kbd className="rounded-md border border-border/70 bg-background/40 px-2 py-1 font-mono text-[11px] tracking-tight">
                    Tab
                  </kbd>
                  <span className="hidden sm:inline">快速浏览</span>
                </div>
              </nav>
            </Stagger>

            <div id="capabilities" className="mt-10 scroll-mt-32">
              <div className="grid gap-3 sm:grid-cols-2">
                {highlights.map((item, index) => (
                  <Stagger key={item.title} delayMs={360 + index * 70}>
                    <div className="rounded-3xl border border-border/60 bg-background/35 p-5 backdrop-blur-xl dark:bg-background/25">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-foreground/6 text-foreground dark:bg-white/10">
                          <item.Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium tracking-tight">
                            {item.title}
                          </div>
                          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Stagger>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-12">
            <Stagger delayMs={260} className="lg:sticky lg:top-32">
              <div
                id="stack"
                className="rounded-[2rem] border border-border/60 bg-background/40 p-6 backdrop-blur-2xl dark:bg-background/28"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground">
                      SYSTEM CARD
                    </div>
                    <div className="mt-3 text-lg font-semibold tracking-tight">
                      Xra Runtime
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      App Router · Prisma · Redis · NextAuth
                    </div>
                  </div>
                  <div className="rounded-full border border-border/70 bg-background/40 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-foreground/70">
                    READY
                  </div>
                </div>

                <div className="mt-7 grid gap-3">
                  <div className="rounded-3xl bg-foreground/4 p-4 dark:bg-white/6">
                    <div className="text-xs font-medium tracking-[0.24em] text-muted-foreground">
                      INTEGRATIONS
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Tag className="bg-transparent">Home Assistant</Tag>
                      <Tag className="bg-transparent">Web API</Tag>
                      <Tag className="bg-transparent">Realtime UI</Tag>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-foreground/4 p-4 dark:bg-white/6">
                    <div className="text-xs font-medium tracking-[0.24em] text-muted-foreground">
                      DATA
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Tag className="bg-transparent">Postgres</Tag>
                      <Tag className="bg-transparent">Prisma</Tag>
                      <Tag className="bg-transparent">Redis</Tag>
                      <Tag className="bg-transparent">IndexedDB</Tag>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-foreground/4 p-4 dark:bg-white/6">
                    <div className="text-xs font-medium tracking-[0.24em] text-muted-foreground">
                      SECURITY
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Tag className="bg-transparent">NextAuth</Tag>
                      <Tag className="bg-transparent">Policy Boundaries</Tag>
                      <Tag className="bg-transparent">Session Guard</Tag>
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-3xl surface-glass px-5 py-4 text-xs text-muted-foreground">
                  建议：从 “探索能力” 开始，先确认产品形态，再逐步启用数据层与集成。
                </div>
              </div>
            </Stagger>
          </div>
        </div>
      </Container>
    </section>
  );
}
