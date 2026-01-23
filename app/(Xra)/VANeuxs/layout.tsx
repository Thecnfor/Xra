import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VANeuxs",
  description: "VANeuxs · Xra 子站点",
};

export default function VANeuxsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/85 via-background/25 to-background/70 dark:from-background/70 dark:via-background/20 dark:to-background/70"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
