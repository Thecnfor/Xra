import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookieName, verifySession } from "@/lib/auth";

// Proxy（原 middleware）会在路由渲染前执行，用来做轻量级的重定向/重写/头部处理。
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 获取登录态
  const cookieName = getSessionCookieName();
  const token = request.cookies.get(cookieName)?.value;
  const userId = token ? verifySession(token) : null;

  // 1. 已登录逻辑
  if (userId) {
    // 如果访问登录页，直接去 home
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // 如果访问根路径 /
    if (pathname === "/") {
      const referer = request.headers.get("referer");
      const host = request.headers.get("host");
      
      // 如果没有 referer（直接输入网址）或者 referer 不是来自本站
      // 则跳转到 /home；否则（站内跳转，比如点击 Logo）允许访问 /
      if (!referer || !host || !referer.includes(host)) {
        return NextResponse.redirect(new URL("/home", request.url));
      }
    }
  }

  // 其他情况（未登录访问所有页面，或已登录访问非拦截页面）全部放行
  return NextResponse.next();
}

// matcher 决定本文件在哪些路径上执行
export const config = {
  matcher: ["/", "/login"],
};