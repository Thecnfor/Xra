"use client";

import React from "react";
import { motion } from "motion/react";
import {
  IconBrandApple,
  IconBrandWindows,
  IconBrandUbuntu,
  IconBrandAndroid,
  IconDownload,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconCpu
} from "@tabler/icons-react";
import { Button } from "@/components/features/meta/button";
import { TextAnimate } from "@/components/features/meta/text-animate";
import { cn } from "@/lib/utils";

interface DownloadItem {
  id: string;
  name: string;
  description: string;
  version: string;
  platform: string;
  icon: React.ReactNode;
  downloadUrl: string;
  size?: string;
  badge?: string;
}

const downloadItems: DownloadItem[] = [
  {
    id: "macos-silicon",
    name: "macOS (Apple Silicon)",
    description: "针对 Apple M1/M2/M3 芯片优化，提供最佳性能。",
    version: "v4.5.0",
    platform: "macOS",
    icon: <IconBrandApple className="w-8 h-8" />,
    downloadUrl: "#",
    size: "82.5 MB",
    badge: "推荐"
  },
  {
    id: "macos-intel",
    name: "macOS (Intel)",
    description: "适用于搭载 Intel 处理器的 Mac 设备。",
    version: "v4.5.0",
    platform: "macOS",
    icon: <IconBrandApple className="w-8 h-8" />,
    downloadUrl: "#",
    size: "85.2 MB"
  },
  {
    id: "windows",
    name: "Windows",
    description: "支持 Windows 10 及以上版本，支持 x64 架构。",
    version: "v4.5.0",
    platform: "Windows",
    icon: <IconBrandWindows className="w-8 h-8" />,
    downloadUrl: "#",
    size: "91.0 MB"
  },
  {
    id: "linux",
    name: "Linux (AppImage)",
    description: "通用的 Linux 二进制格式，支持大多数主流发行版。",
    version: "v4.5.0",
    platform: "Linux",
    icon: <IconBrandUbuntu className="w-8 h-8" />,
    downloadUrl: "#",
    size: "78.4 MB"
  },
  {
    id: "android",
    name: "Android",
    description: "随时随地通过手机访问 Xra，支持全功能交互。",
    version: "v4.4.2",
    platform: "Android",
    icon: <IconBrandAndroid className="w-8 h-8" />,
    downloadUrl: "#",
    size: "45.1 MB"
  },
  {
    id: "ios",
    name: "iOS",
    description: "前往 App Store 下载，享受丝滑的 iOS 体验。",
    version: "v4.4.2",
    platform: "iOS",
    icon: <IconDeviceMobile className="w-8 h-8" />,
    downloadUrl: "/app-store-link",
    size: "52.0 MB"
  }
];

export default function DownloadPage() {
  // 模拟下载处理接口
  const handleDownload = (item: DownloadItem) => {
    console.log(`Starting download for ${item.name}...`);
    // 这里预留后端接口调用
    // window.location.href = item.downloadUrl;
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-6xl">
        {/* 头部标题区 */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-medium text-muted-foreground mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>最新版本 v4.5.0 现已发布</span>
            </div>
          </motion.div>

          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            下载 Xra
          </TextAnimate>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-muted-foreground max-w-2xl"
          >
            在所有设备上同步你的数据。选择适合你平台的客户端，开启高效的 AI 协作之旅。
          </motion.p>
        </div>

        {/* 下载列表网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloadItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="group relative"
            >
              <div className={cn(
                "h-full p-8 rounded-3xl border border-foreground/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl",
                "transition-all duration-300 hover:border-foreground/20 hover:shadow-2xl hover:shadow-foreground/5",
                "flex flex-col justify-between"
              )}>
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      {item.icon}
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 rounded-md bg-sky-500/10 text-sky-500 text-[10px] font-bold uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground/60 border-t border-foreground/5 pt-4">
                    <span>版本: {item.version}</span>
                    <span>大小: {item.size}</span>
                  </div>

                  <Button
                    className="w-full justify-between"
                    variant={item.badge === "推荐" ? "default" : "outline"}
                    onClick={() => handleDownload(item)}
                  >
                    <span>立即下载</span>
                    <IconDownload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 text-center space-y-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconCpu className="w-4 h-4" />
              <span>支持 Apple Silicon & Intel</span>
            </div>
            <div className="flex items-center gap-2">
              <IconDeviceDesktop className="w-4 h-4" />
              <span>支持 4K 高分屏显示</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/40">
            下载即表示您同意我们的服务条款和隐私政策。
          </p>
        </motion.div>
      </div>
    </main>
  );
}
