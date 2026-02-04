"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconUpload } from "@tabler/icons-react";

interface DropZoneProps {
  isDragging: boolean;
}

export function DropZone({ isDragging }: DropZoneProps) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm pointer-events-none"
        >
          <div className="flex flex-col items-center gap-4 p-8 md:p-12 rounded-2xl md:rounded-3xl bg-background/80 border-2 border-dashed border-primary shadow-2xl mx-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <IconUpload className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <p className="text-lg md:text-xl font-bold">释放以开始上传</p>
            <p className="text-xs md:text-sm text-muted-foreground text-center">
              支持文件和文件夹直接拖入
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
