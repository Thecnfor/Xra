"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconLoader2 } from "@tabler/icons-react";

interface UploadProgressProps {
  progress: { total: number; current: number } | null;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <AnimatePresence>
      {progress && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginBottom: 0 }}
          animate={{ height: "auto", opacity: 1, marginBottom: 16 }}
          exit={{ height: 0, opacity: 0, marginBottom: 0 }}
          className="overflow-hidden shrink-0"
        >
          <div className="bg-primary/5 border border-primary/10 rounded-xl md:rounded-2xl p-3 md:p-4">
            <div className="flex items-center justify-between mb-2 text-xs md:sm font-medium">
              <div className="flex items-center gap-2">
                <IconLoader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin text-primary" />
                <span>正在上传...</span>
              </div>
              <span className="text-muted-foreground">
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="w-full h-1 md:h-1.5 bg-primary/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
