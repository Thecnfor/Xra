import * as React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/layout/header";
import SiteMenu from "@/components/layout/menu";
import { themeInitScript } from "@/lib/theme-init-script";
import { XraBootShell } from "@/components/layout/XRA";
import XrakCarrierOverlay from "@/components/layout/XRA/carrier/XrakCarrierOverlay.lazy";
import { ReactQueryProvider } from "@/lib/storage/queryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const sourceHanSans = localFont({
  src: [
    {
      path: "../public/fonts/harmonyos-sans/SourceHanSansSC-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/harmonyos-sans/SourceHanSansSC-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/harmonyos-sans/SourceHanSansSC-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/harmonyos-sans/SourceHanSansSC-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-source-han-sans",
  display: "swap",
  preload: false,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "Xra",
  description: "Xra 新一代全栈平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceHanSans.variable}`}
    >
      <head>
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ReactQueryProvider>
          <XraBootShell>
            <div className="xra-invert-on-loading">
              <SiteHeader />
              <SiteMenu />
              {children}
            </div>
            <XrakCarrierOverlay />
          </XraBootShell>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
