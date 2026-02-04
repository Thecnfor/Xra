import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookieName, verifySession } from "@/lib/auth";

export const metadata: Metadata = {
    title: {
        template: "%s · Xra",
        default: "用户",
    },
};

export default async function UserGroupLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieName = getSessionCookieName();
    const store = await cookies();
    const token = store.get(cookieName)?.value ?? null;
    const userId = token ? verifySession(token) : null;

    if (!userId) redirect("/login");
    return (
        <div className="h-screen min-w-0 flex-1 pt-[calc(env(safe-area-inset-top)+var(--header-height))]">
            {children}
        </div>
    );
}
