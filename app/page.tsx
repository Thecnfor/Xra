import { FullScreenContainer } from "@/features/full-screen-container";
import XraBackground from "@/components/ui/background/XRA/Xra";
import { HomeHero } from "@/components/layout/hero/hero";

export default function Home() {
  return (
    <>
      <XraBackground />
      {/* 主体内容层 */}
      <FullScreenContainer className="min-h-dvh justify-start pt-[calc(env(safe-area-inset-top)+6.5rem)] pb-[calc(env(safe-area-inset-bottom)+3rem)] sm:justify-center">
        <HomeHero />
      </FullScreenContainer>
    </>
  );
}
