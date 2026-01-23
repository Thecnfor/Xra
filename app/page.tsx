import { FullScreenContainer } from "@/features/full-screen-container";
import RakLink from "@/components/ui/background/Rak_link";
import { HomeHero } from "@/components/layout/XRAK/hero";

export default function Home() {
  return (
    <>
      {/* 背景层：粒子网络 - RakLink 内部已处理 NoSSR */}
      <RakLink className="opacity-35 mix-blend-multiply dark:opacity-25 dark:mix-blend-screen" />

      <div
        className="fixed inset-0 z-0 pointer-events-none bg-linear-to-b from-background/80 via-background/25 to-background/70 dark:from-background/65 dark:via-background/15 dark:to-background/70"
        aria-hidden="true"
      />

      {/* 主体内容层 */}
      <FullScreenContainer className="min-h-[100dvh] justify-start pt-[calc(env(safe-area-inset-top)+6.5rem)] pb-[calc(env(safe-area-inset-bottom)+3rem)] sm:justify-center">
        <HomeHero />
      </FullScreenContainer>
    </>
  );
}
