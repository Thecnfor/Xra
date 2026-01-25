import { RouteLoadingBridge } from "@/components/layout/XRA/route-loading/RouteLoadingBridge.client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] pointer-events-auto">
      <RouteLoadingBridge />
      <div className="absolute inset-0 xra-loading-scrim" aria-hidden="true" />
      <div className="absolute inset-0 xra-loading-wipe" aria-hidden="true" />
      <div className="absolute inset-0 flex justify-center px-6 pt-[calc(env(safe-area-inset-top)+6.25rem)]">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div
              className="text-xs tracking-[0.35em]"
              style={{ color: "color-mix(in oklab, var(--xra-loading-fg-raw) 55%, transparent)" }}
            >
              XRA
            </div>
            <div
              className="mt-3 text-sm"
              style={{ color: "color-mix(in oklab, var(--xra-loading-fg-raw) 70%, transparent)" }}
            >
              加载中
            </div>
            <div className="relative mt-10 h-10 w-10">
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--xra-loading-fg-raw)" }}
              />
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--xra-loading-fg-raw) 35%, transparent)",
                }}
              />
            </div>
            <div className="mt-10 h-px w-36 xra-loading-divider" />
          </div>
        </div>
      </div>
    </div>
  );
}
