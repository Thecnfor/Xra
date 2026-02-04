"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconFolder,
  IconEye,
  IconDownload,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";

interface ContextMenuProps {
  menu: {
    x: number;
    y: number;
    path: string;
    isDir: boolean;
    name: string;
  } | null;
  onOpen: (path: string, isDir: boolean) => void;
  onDownload: (path: string, isDir: boolean) => void;
  onSelect: (path: string) => void;
  onDelete: (path: string, name: string) => void;
  onClose: () => void;
}

export function ContextMenu({
  menu,
  onOpen,
  onDownload,
  onSelect,
  onDelete,
  onClose,
}: ContextMenuProps) {
  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 5, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.9, y: 5, filter: "blur(10px)" }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          style={{ left: menu.x, top: menu.y }}
          className="fixed z-[60] min-w-[140px] bg-background/95 border border-border/50 rounded-xl shadow-2xl p-1 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1.5 text-[9px] uppercase tracking-wider text-muted-foreground/70 font-bold border-b border-border/30 mb-1 truncate max-w-[180px]">
            {menu.name}
          </div>
          <div className="space-y-0.5">
            <button
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-left group"
              onClick={() => {
                onOpen(menu.path, menu.isDir);
                onClose();
              }}
            >
              {menu.isDir ? (
                <IconFolder className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              ) : (
                <IconEye className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              )}
              {menu.isDir ? "打开文件夹" : "预览文件"}
            </button>
            <button
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-left group"
              onClick={() => {
                onDownload(menu.path, menu.isDir);
                onClose();
              }}
            >
              <IconDownload className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              {menu.isDir ? "打包下载" : "直接下载"}
            </button>
            <button
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-left group"
              onClick={() => {
                onSelect(menu.path);
                onClose();
              }}
            >
              <IconCheck className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              选择此项
            </button>
            <div className="h-px bg-border/30 my-1" />
            <button
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-red-500/10 text-red-500 transition-all text-left group"
              onClick={() => {
                onDelete(menu.path, menu.name);
                onClose();
              }}
            >
              <IconTrash className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              删除项目
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
