import { FullScreenContainer } from "@/features/full-screen-container";
import { SOCIAL_LINKS } from "@/lib/social";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* 主体内容层 */}
      <FullScreenContainer className="hidden min-h-dvh justify-center pt-[calc(env(safe-area-inset-top)+6.5rem)] pb-[calc(env(safe-area-inset-bottom)+3rem)] min-[760px]:flex">
        <div className="h-1 w-1" aria-hidden="true" />
        <nav
          aria-label="社交媒体"
          className="absolute left-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20"
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
        <footer className="h-9 pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-10 flex items-center justify-center px-4">
          <p className="text-xs tracking-wide text-muted-foreground/80">
            © {year} Xra. All rights reserved.
          </p>
        </footer>
      </FullScreenContainer>
    </>
  );
}
