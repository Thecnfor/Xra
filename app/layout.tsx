import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/layout/header";
import SiteMenu from "@/layout/menu";
import { AppStoreProvider } from "@/stores";
import { ThemeSync } from "@/features/meta/theme-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

const themeInitScript = `(() => {
  const storageKey = "theme";
  const root = document.documentElement;
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const normalizeMode = (value) =>
    value === "light" || value === "dark" || value === "system" ? value : "system";
  const getSystemResolved = () => (mql.matches ? "dark" : "light");
  const applyResolved = (resolved, mode) => {
    root.classList.toggle("dark", resolved === "dark");
    root.classList.toggle("light", resolved === "light");
    root.dataset.themeMode = mode;
    root.dataset.themeResolved = resolved;
    root.style.colorScheme = resolved;
  };
  const readStoredMode = () => {
    try {
      return normalizeMode(localStorage.getItem(storageKey));
    } catch {
      return "system";
    }
  };
  const applyMode = (mode) => {
    const resolved = mode === "system" ? getSystemResolved() : mode;
    applyResolved(resolved, mode);
  };

  applyMode(readStoredMode());

  const onSystemChange = () => {
    const mode = readStoredMode();
    if (mode !== "system") return;
    applyMode("system");
  };

  if (mql.addEventListener) mql.addEventListener("change", onSystemChange);
  else mql.addListener(onSystemChange);

  window.addEventListener("storage", (e) => {
    if (e.key !== storageKey) return;
    applyMode(normalizeMode(e.newValue));
  });
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sourceHanSans.variable}`}
      >
        <AppStoreProvider>
          <ThemeSync />
          <SiteHeader />
          <SiteMenu />
          {children}
        </AppStoreProvider>
      </body>
    </html>
  );
}
