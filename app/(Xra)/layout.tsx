import type { Metadata } from "next";
import { XraBranchBridge } from "@/components/layout/route-branch/XraBranchBridge.client";
import { XraSidebarLayout } from "@/components/layout/sidebar";

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
      <XraSidebarLayout>
        {children}
      </XraSidebarLayout>
    </>
  );
}
