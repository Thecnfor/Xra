import { FullScreenContainer } from "@/features/full-screen-container";
import { BrandLogo } from "@/features/meta/brand-logo";
import { Button } from "@/features/meta/button";
import RakLink from "@/components/ui/background/Rak_link";

export default function Home() {
  return (
    <>
      {/* 背景层：粒子网络 - RakLink 内部已处理 NoSSR */}
      <RakLink className="opacity-50 dark:opacity-40" />

      {/* 主体内容层 */}
      <FullScreenContainer>
        {/* 品牌 Logo */}
        <BrandLogo className="mb-12" />

        {/* 交互入口 */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Button
            variant="outline"
            size="lg"
            className="min-w-[140px] rounded-full border-neutral-200/50 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/30 hover:border-neutral-300 dark:border-neutral-700/50 dark:bg-black/10 dark:hover:bg-black/30 dark:hover:border-neutral-600"
          >
            Enter World
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="min-w-[140px] rounded-full text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            About Us
          </Button>
        </div>

        {/* 底部版权信息 */}
        <footer className="absolute bottom-8 text-center text-xs text-neutral-400 dark:text-neutral-600 tracking-wider">
          © {new Date().getFullYear()} XRAK STUDIO. DESIGNED FOR FUTURE.
        </footer>
      </FullScreenContainer>
    </>
  );
}
