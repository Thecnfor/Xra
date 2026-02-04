"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconChecks, IconDownload, IconLoader2, IconTrash, IconX } from "@tabler/icons-react";
import { Button } from "@/components/features/meta/button";

interface SelectionActionBarProps {
  selectedCount: number;
  isDeleting: boolean;
  onDownload: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function SelectionActionBar({
  selectedCount,
  isDeleting,
  onDownload,
  onDelete,
  onClear,
}: SelectionActionBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          className="fixed bottom-6 md:bottom-8 left-1/2 z-50 flex items-center gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-foreground text-background rounded-xl md:rounded-2xl shadow-2xl border border-foreground/10 max-w-[90vw]"
        >
          <div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-4 border-r border-background/20">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-background/10 flex items-center justify-center hidden sm:flex">
              <IconChecks className="w-3 md:w-4 h-3 md:h-4" />
            </div>
            <span className="font-bold whitespace-nowrap text-xs md:text-sm">
              {selectedCount} 项
            </span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-background hover:bg-background/10 gap-1.5 md:gap-2 h-8 md:h-9 px-2 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-sm"
              onClick={onDownload}
            >
              <IconDownload className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">批量下载</span>
              <span className="sm:hidden">下载</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-background hover:bg-red-500/20 hover:text-red-400 gap-1.5 md:gap-2 h-8 md:h-9 px-2 md:px-4 rounded-lg md:rounded-xl text-[10px] md:text-sm"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <IconLoader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
              ) : (
                <IconTrash className="w-3.5 h-3.5 md:w-4 md:h-4" />
              )}
              <span className="hidden sm:inline">批量删除</span>
              <span className="sm:hidden">删除</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-background hover:bg-background/10 h-8 w-8 md:h-9 md:w-9 rounded-lg md:rounded-xl ml-1 md:ml-2"
              onClick={onClear}
            >
              <IconX className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
