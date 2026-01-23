import Link from "next/link";
import { Container } from "@/features/container";
import { Section } from "@/features/section";
import { buttonVariants } from "@/features/meta/button";
import { cn } from "@/lib/utils";

export default function VANeuxsPage() {
  return (
    <Section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-foreground/70 backdrop-blur-sm">
              VANeuxs
              <span className="h-1 w-1 rounded-full bg-foreground/25" />
              MODULE
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              一个更偏“作品集 + 产品实验场”的子站点
            </h1>

            <p className="mt-5 max-w-[60ch] text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
              这里用来承载独立的视觉语言、交互原型与信息架构实验，并与 Xra 的全栈
              能力保持同一套工程与组件体系。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "shadow-sm shadow-black/10 dark:shadow-black/40",
                )}
              >
                返回首页
              </Link>
              <Link
                href="#overview"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "bg-background/30 backdrop-blur-sm",
                )}
              >
                了解模块
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[2rem] border border-border/60 bg-background/40 p-6 backdrop-blur-2xl dark:bg-background/28">
              <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground">
                OVERVIEW
              </div>

              <div id="overview" className="mt-5 space-y-3 scroll-mt-32">
                <div className="rounded-3xl bg-foreground/4 p-4 dark:bg-white/6">
                  <div className="text-sm font-medium tracking-tight">
                    视觉与排版
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    以更克制的层次与对比，强调“阅读节奏”和“空间关系”。
                  </div>
                </div>

                <div className="rounded-3xl bg-foreground/4 p-4 dark:bg-white/6">
                  <div className="text-sm font-medium tracking-tight">
                    交互与动效
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    默认 CSS 动效，优先 reduced-motion 降级，必要时才引入最小 Client
                    交互。
                  </div>
                </div>

                <div className="rounded-3xl bg-foreground/4 p-4 dark:bg-white/6">
                  <div className="text-sm font-medium tracking-tight">
                    工程与复用
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    与主站共享组件原子、浮层系统与状态架构，避免重复造轮子。
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl surface-glass px-5 py-4 text-xs text-muted-foreground">
                这里先落地基础页面与布局，后续再逐步补充真实内容与交互原型。
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
