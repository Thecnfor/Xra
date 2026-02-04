"use server";

import { cookies } from "next/headers";
import { getSessionCookieName, verifySession } from "./index";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieName = getSessionCookieName();
  const store = await cookies();
  const token = store.get(cookieName)?.value ?? null;
  const userId = token ? verifySession(token) : null;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });

  return user;
}
