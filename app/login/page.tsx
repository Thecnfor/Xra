import { loginAction } from "@/lib/auth/actions";
import { LoginCard } from "@/components/features/loginCard";

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
