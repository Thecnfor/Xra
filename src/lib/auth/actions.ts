"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getSessionCookieName,
  getSessionMaxAge,
  signSession,
  verifySession,
} from "./session/index";
import { hashPassword, verifyPassword } from "./passwordHash";
import {
  getUserByUsername,
  getUserById,
  createUser,
  updateUser,
} from "./user/index";

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUser() {
  const cookieName = getSessionCookieName();
  const store = await cookies();
  const token = store.get(cookieName)?.value ?? null;
  const userId = token ? verifySession(token) : null;

  if (!userId) return null;

  const user = await getUserById(userId);
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}

/**
 * 登录/注册 Action
 */
export async function loginAction(_prevState: { error?: string } | void | null, formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();
  const from = (formData.get("from") as string) || "/home";

  if (!username || !password) return { error: "请输入用户名和密码" };

  const existing = await getUserByUsername(username);

  let user;
  if (existing) {
    const result = await verifyPassword(password, existing.passwordHash);
    if (!result) return { error: "密码错误" };
    const { isValid, needsRehash } = result;
    if (!isValid) return { error: "密码错误" };

    if (needsRehash) {
      const newHash = await hashPassword(password);
      await updateUser(existing.id, { passwordHash: newHash });
    }
    user = existing;
  } else {
    const passwordHash = await hashPassword(password);
    user = await createUser(username, passwordHash);
  }

  const token = signSession(String(user.id));
  const name = getSessionCookieName();
  const store = await cookies();
  store.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionMaxAge(),
  });

  redirect(from);
}
