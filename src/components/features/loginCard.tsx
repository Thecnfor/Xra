"use client";

import { useActionState } from "react";

interface LoginCardProps {
  loginAction: (prevState: any, formData: FormData) => Promise<{ error?: string } | void>;
  from: string;
}

export function LoginCard({ loginAction, from }: LoginCardProps) {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h1 className="text-xl font-semibold tracking-tight">登录</h1>
      <p className="mt-1 text-sm text-muted-foreground">首次登录将自动注册</p>
      
      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="from" value={from} />
        
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            用户名
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="输入用户名"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="输入密码"
          />
        </div>

        {state?.error && (
          <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="h-10 w-full rounded-md border border-transparent bg-foreground text-background text-sm font-medium transition-all hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "登录中..." : "登录"}
        </button>
      </form>
    </div>
  );
}