"use client";

import * as React from "react";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl px-5 pt-[calc(env(safe-area-inset-top)+6.25rem)] pb-16 sm:px-6">
      <div className="flex w-full flex-col items-center text-center">
        <div className="text-xs tracking-[0.35em] text-foreground/55">XRA</div>
        <div className="mt-3 text-2xl font-semibold tracking-tight">发生错误</div>
        <div className="mt-2 text-sm text-muted-foreground">你可以重试，或者返回首页继续浏览。</div>
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-ring"
          >
            重试
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground/90 transition-colors hover:bg-foreground/6 focus-ring"
          >
            返回首页
          </Link>
        </div>
        <div className="mt-10 h-px w-40 bg-linear-to-r from-transparent via-foreground/14 to-transparent" />
      </div>
    </div>
  );
}
