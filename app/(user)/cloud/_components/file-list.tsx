"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    IconLoader2,
    IconX,
    IconCloud,
    IconFolder,
    IconFile,
    IconEye,
    IconDownload,
    IconTrash,
    IconCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/features/meta/button";
import { cn } from "@/lib/utils";

interface FileItem {
    path: string;
    name: string;
    isDir: boolean;
    size: number;
}

interface FileListProps {
    files: FileItem[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    selectedPaths: Set<string>;
    isSelectionMode: boolean;
    isMobile: boolean;
    isDeleting: boolean;
    deletingPath: string | null;
    onRefresh: () => void;
    onFileClick: (file: FileItem) => void;
    onContextMenu: (e: React.MouseEvent, file: FileItem) => void;
    onTouchStart: (file: FileItem) => void;
    onTouchEnd: () => void;
    onDelete: (file: FileItem) => void;
    onPreview: (path: string) => void;
    onDownload: (path: string) => void;
    formatSize: (bytes: number) => string;
}

export function FileList({
    files,
    isLoading,
    isError,
    error,
    selectedPaths,
    isSelectionMode,
    isMobile,
    isDeleting,
    deletingPath,
    onRefresh,
    onFileClick,
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    onDelete,
    onPreview,
    onDownload,
    formatSize,
}: FileListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
                <IconLoader2 className="w-8 h-8 animate-spin mb-4" />
                <p>加载中...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                    <IconX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">加载失败</h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    {error?.message || "连接服务器时发生未知错误，请检查网络连接或 API 地址。"}
                </p>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={onRefresh} className="rounded-full px-6">
                        重试
                    </Button>
                    <Button variant="ghost" onClick={() => window.location.reload()} className="rounded-full px-6">
                        刷新页面
                    </Button>
                </div>
            </div>
        );
    }

    if (files?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
                <IconCloud className="w-12 h-12 opacity-20 mb-4" />
                <p>暂无文件</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
                {files?.map((file, index) => (
                    <motion.div
                        key={file.path}
                        layout="position"
                        initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: {
                                delay: index * 0.1,
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                            },
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            filter: "blur(10px)",
                            transition: { duration: 0.2 },
                        }}
                        className={cn(
                            "group flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 transition-colors cursor-pointer select-none",
                            selectedPaths.has(file.path) ? "bg-primary/10" : "hover:bg-foreground/4"
                        )}
                        onClick={() => onFileClick(file)}
                        onContextMenu={(e) => onContextMenu(e, file)}
                        onTouchStart={() => onTouchStart(file)}
                        onTouchEnd={onTouchEnd}
                        onTouchMove={onTouchEnd}
                    >
                        {/* Checkbox for selection mode */}
                        <AnimatePresence>
                            {isSelectionMode && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    className="mr-1 md:mr-2"
                                >
                                    <div
                                        className={cn(
                                            "w-4 h-4 md:w-5 md:h-5 rounded-md border-2 transition-all flex items-center justify-center",
                                            selectedPaths.has(file.path)
                                                ? "bg-primary border-primary text-background"
                                                : "border-muted-foreground/30"
                                        )}
                                    >
                                        {selectedPaths.has(file.path) && (
                                            <IconCheck className="w-3 md:w-3.5 h-3 md:h-3.5" />
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="shrink-0">
                            {file.isDir ? (
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <IconFolder className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-foreground/5 flex items-center justify-center text-muted-foreground">
                                    <IconFile className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                            )}
                        </div>

                        <div className="grow min-w-0">
                            <span
                                className={cn(
                                    "text-xs md:text-sm font-medium truncate block w-full text-left transition-colors",
                                    file.isDir ? "group-hover:text-primary" : ""
                                )}
                            >
                                {file.name}
                            </span>
                            <div className="flex items-center gap-2 md:gap-3 mt-0.5 text-[10px] md:text-xs text-muted-foreground">
                                {!file.isDir && <span>{formatSize(file.size)}</span>}
                                {file.isDir && <span>文件夹</span>}
                            </div>
                        </div>

                        {!isMobile && !isSelectionMode && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!file.isDir && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPreview(file.path);
                                            }}
                                            title="预览"
                                        >
                                            <IconEye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDownload(file.path);
                                            }}
                                            title="下载"
                                        >
                                            <IconDownload className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(file);
                                    }}
                                    disabled={isDeleting}
                                    title="删除"
                                >
                                    {isDeleting && deletingPath === file.path ? (
                                        <IconLoader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <IconTrash className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
