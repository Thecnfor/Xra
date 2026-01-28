import type { Metadata } from "next";
import { XraBranchBridge } from "@/components/layout/route-branch/XraBranchBridge.client";

export const metadata: Metadata = {
  title: {
    template: "%s · Xra",
    default: "Xra",
  },
};

export default function XraGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <XraBranchBridge />
      <div className="relative z-10 min-h-dvh w-full pt-[calc(env(safe-area-inset-top)+6.5rem)] pb-[calc(env(safe-area-inset-bottom)+3rem)]">
        {children}
      </div>
    </>
  );
}
