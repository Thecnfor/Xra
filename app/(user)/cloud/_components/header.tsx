"use client";

import React from "react";
import {
  IconCloud,
  IconUser,
  IconRefresh,
  IconFile,
  IconFolder,
} from "@tabler/icons-react";
import { Button } from "@/components/features/meta/button";

interface HeaderProps {
  user: { username: string } | null;
  isUploading: boolean;
  onRefresh: () => void;
  onUploadFile: () => void;
  onUploadFolder: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  folderInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Header({
  user,
  isUploading,
  onRefresh,
  onUploadFile,
  onUploadFolder,
  fileInputRef,
  folderInputRef,
  onFileChange,
}: HeaderProps) {
  return (
    <div className="pt-8 pb-6 md:pt-12 md:pb-8 shrink-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <IconCloud className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              私有云盘
            </h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <p className="text-sm md:text-base hidden sm:block">
                安全地存储和管理您的个人文件
              </p>
              {user && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-foreground/80">
                    <IconUser className="w-3.5 h-3.5" />
                    <span className="text-xs md:text-sm font-medium">
                      {user.username}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="rounded-full h-9 w-9 md:h-10 md:w-10 shrink-0"
            title="刷新"
          >
            <IconRefresh className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={onFileChange}
            />
            <input
              type="file"
              ref={folderInputRef}
              className="hidden"
              {...({
                webkitdirectory: "",
                directory: "",
              } as React.InputHTMLAttributes<HTMLInputElement> & {
                webkitdirectory: string;
                directory: string;
              })}
              onChange={onFileChange}
            />
            <div className="flex items-center p-1 bg-muted rounded-full">
              <Button
                onClick={onUploadFile}
                disabled={isUploading}
                className="gap-2 h-7 md:h-8 px-3 md:px-4 rounded-full text-[10px] md:text-xs shadow-none"
              >
                <IconFile className="w-3 md:w-3.5 h-3 md:h-3.5" />
                文件
              </Button>
              <Button
                variant="ghost"
                onClick={onUploadFolder}
                disabled={isUploading}
                className="gap-2 h-7 md:h-8 px-3 md:px-4 rounded-full text-[10px] md:text-xs"
              >
                <IconFolder className="w-3 md:w-3.5 h-3 md:h-3.5" />
                文件夹
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
