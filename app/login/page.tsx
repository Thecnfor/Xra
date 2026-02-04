import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { getSessionCookieName, getSessionMaxAge, hashPassword, signSession, verifyPassword } from "@/lib/auth";
import { LoginCard } from "@/components/features/loginCard";

async function loginAction(_prevState: any, formData: FormData) {
  "use server";
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();
  const from = (formData.get("from") as string) || "/home";
  
  if (!username || !password) return { error: "请输入用户名和密码" };

  const existing = await prisma.user.findUnique({ where: { username } });

  let user;
  if (existing) {
    const result = await verifyPassword(password, existing.passwordHash);
    if (!result) return { error: "密码错误" };
    const { isValid, needsRehash } = result;
    if (!isValid) return { error: "密码错误" };
    
    // 如果参数升级需要重新哈希，静默更新数据库
    if (needsRehash) {
      const newHash = await hashPassword(password);
      await prisma.user.update({
        where: { id: existing.id },
        data: { passwordHash: newHash },
      });
    }
    user = existing;
  } else {
    const passwordHash = await hashPassword(password);
    user = await prisma.user.create({
      data: { username, passwordHash },
    });
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

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : "/home";

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <LoginCard loginAction={loginAction} from={from} />
    </main>
  );
}
