"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  IconFolder,
  IconFile,
  IconArrowLeft,
  IconUpload,
  IconDownload,
  IconEye,
  IconLoader2,
  IconChevronRight,
  IconCloud,
  IconUser,
  IconRefresh,
} from "@tabler/icons-react";
import { Button } from "@/components/features/meta/button";
import { DottedGlowBackground } from "@/components/ui/background/dotted-glow-background";
import { cn } from "@/lib/utils";
import { listFiles, uploadFile, getDownloadUrl, getPreviewUrl, type FileItem } from "@/lib/api/cloud";
import { getCurrentUser } from "@/lib/auth/actions";

export default function CloudPage() {
  const [currentPath, setCurrentPath] = useState("");
  const [user, setUser] = useState<{ username: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const { data: files, isLoading, isError, error } = useQuery({
    queryKey: ["files", currentPath],
    queryFn: () => listFiles(currentPath),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFile(file, currentPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", currentPath] });
    },
  });

  const handleFolderClick = (path: string) => {
    // Remove leading slash for consistency if needed, but listFiles handles it
    setCurrentPath(path);
  };

  const handleBack = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length > 0 ? `/${parts.join("/")}` : "");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <DottedGlowBackground />

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <IconCloud className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">私有云盘</h1>
              <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
                <p>安全地存储和管理您的个人文件</p>
                {user && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1.5 text-foreground/80">
                      <IconUser className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">{user.username}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["files", currentPath] })}
              className="rounded-full h-10 w-10"
              title="刷新"
            >
              <IconRefresh className="w-4 h-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileChange}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="gap-2 h-10 px-5 rounded-full"
            >
              {uploadMutation.isPending ? (
                <IconLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <IconUpload className="w-4 h-4" />
              )}
              {uploadMutation.isPending ? "上传中..." : "上传文件"}
            </Button>
          </div>
        </div>

        {/* Navigation / Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPath("")}
            className={cn(
              "h-9 px-3 rounded-full transition-all",
              currentPath === "" ? "bg-primary/10 text-primary font-medium" : "hover:bg-foreground/5"
            )}
          >
            全部文件
          </Button>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <IconChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const path = "/" + breadcrumbs.slice(0, idx + 1).join("/");
                  setCurrentPath(path);
                }}
                className={cn(
                  "h-9 px-3 rounded-full transition-all",
                  idx === breadcrumbs.length - 1 ? "bg-primary/10 text-primary font-medium" : "hover:bg-foreground/5"
                )}
              >
                {crumb}
              </Button>
            </React.Fragment>
          ))}

          {currentPath && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="ml-auto h-9 px-4 gap-2 rounded-full border-dashed hover:border-solid transition-all"
            >
              <IconArrowLeft className="w-3.5 h-3.5" />
              返回上级
            </Button>
          )}
        </div>

        {/* File List */}
        <div className="rounded-2xl border border-border bg-background/40 backdrop-blur-md overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <IconLoader2 className="w-8 h-8 animate-spin mb-4" />
              <p>加载中...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-24 text-destructive">
              <p>加载失败: {(error as Error).message}</p>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["files", currentPath] })}
                className="mt-4"
              >
                重试
              </Button>
            </div>
          ) : files?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <IconCloud className="w-12 h-12 opacity-20 mb-4" />
              <p>暂无文件</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {files?.map((file) => (
                  <motion.div
                    key={file.path}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group flex items-center gap-4 px-6 py-4 hover:bg-foreground/4 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {file.isDir ? (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <IconFolder className="w-6 h-6 fill-current" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center text-muted-foreground">
                          <IconFile className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <button
                        onClick={() => file.isDir ? handleFolderClick(file.path) : null}
                        className={cn(
                          "text-sm font-medium truncate block w-full text-left transition-colors",
                          file.isDir ? "hover:text-primary cursor-pointer" : "cursor-default"
                        )}
                      >
                        {file.name}
                      </button>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                        {!file.isDir && <span>{formatSize(file.size)}</span>}
                        {file.isDir && <span>文件夹</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!file.isDir && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => window.open(getPreviewUrl(file.path), "_blank")}
                            title="预览"
                          >
                            <IconEye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => window.location.href = getDownloadUrl(file.path)}
                            title="下载"
                          >
                            <IconDownload className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground/60">
          <p>共 {files?.length ?? 0} 个项目</p>
          <p>存储空间由 Xra 云提供支持</p>
        </div>
      </div>
    </main>
  );
}
