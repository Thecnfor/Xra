import { SOCIAL_LINKS } from "@/lib/social";
import { HomeHero } from "@/components/layout/hero/HomeHero";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className={cn(
      "relative z-10 flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-4",
      "pt-[calc(env(safe-area-inset-top)+5.25rem)] pb-[calc(env(safe-area-inset-bottom)+2.25rem)]",
      "md:pt-[calc(env(safe-area-inset-top)+6.5rem)] md:pb-[calc(env(safe-area-inset-bottom)+3rem)]"
    )}>
      <h1 className="sr-only">Xra</h1>

      <HomeHero />

      <div className="w-full">
        <div className="hidden md:block">
          <nav
            aria-label="社交媒体"
            className="home-footer absolute left-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-60"
          >
            <div className="relative flex flex-wrap items-center gap-1.5 min-[760px]:gap-2">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-[color] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/60 active:bg-foreground/10 min-[760px]:h-10 min-[760px]:w-10"
                  >
                    <Icon size={18} stroke={1.7} />
                  </a>
                );
              })}
            </div>
          </nav>

          <footer className="home-footer h-9 pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-50 flex items-center justify-center px-4">
            <p className="text-xs tracking-wide text-muted-foreground/80">
              © {new Date().getFullYear()} Xra. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
