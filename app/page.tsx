import { FullScreenContainer } from "@/features/full-screen-container";
import { HomeHero } from "@/components/layout/hero/hero";

export default function Home() {
  return (
    <>
      {/* 主体内容层 */}
      <FullScreenContainer className="min-h-dvh justify-center pt-[calc(env(safe-area-inset-top)+6.5rem)] pb-[calc(env(safe-area-inset-bottom)+3rem)]">
        <HomeHero />
      </FullScreenContainer>
    </>
  );
}
