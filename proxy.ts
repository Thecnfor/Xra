import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// 登录态 Cookie 名称：后续你接入真实鉴权（如 next-auth / 自研 session）时，改成实际使用的 cookie key。
const SESSION_COOKIE_NAME = "session";

// 后台真实 URL 前缀：只对该前缀下的路由做拦截。
const ADMIN_PREFIX = "/admin";

// 后台登录页：需要放行，否则会出现“未登录 → 跳登录 → 又被拦截”的死循环。
const ADMIN_LOGIN_PATH = "/admin/login";

// Proxy（原 middleware）会在路由渲染前执行，用来做轻量级的重定向/重写/头部处理。
// 这里实现一个最小的“后台必须登录”拦截：没有 session cookie 就跳转到 /login。
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 非后台路由：直接放行，不影响公开页面和静态资源。
  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  // 登录页本身：放行。
  if (pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next();
  }

  // 从请求 Cookie 里读取登录态。
  // 注意：这里仅检查“是否存在”，不做 session 校验/续期；后续应接入服务端校验（查库/查 Redis）。
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 未登录：重定向到 /login，并携带 from 参数，便于登录后跳回原页面。
  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // 已登录：放行。
  return NextResponse.next();
}

// matcher 决定本文件在哪些路径上执行；尽量只匹配页面路由，避免拦截 _next 等内部资源。
export const config = {
  matcher: ["/admin/:path*"],
};