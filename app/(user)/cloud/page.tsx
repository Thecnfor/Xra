"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  getDownloadUrl,
  getDownloadDirUrl,
  getPreviewUrl,
  type FileItem,
} from "@/lib/api";
import { getCurrentUser } from "@/lib/auth/actions";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSelection } from "@/hooks/use-selection";
import { useFileNavigation } from "@/hooks/use-file-navigation";
import { useFiles } from "@/hooks/use-files";
import { useFileDragDrop } from "@/hooks/use-file-drag-drop";
import { useContextMenu } from "@/hooks/use-context-menu";

// Sub-components
import { DropZone } from "./_components/drop-zone";
import { SelectionActionBar } from "./_components/selection-action-bar";
import { ContextMenu } from "./_components/context-menu";
import { Header } from "./_components/header";
import { UploadProgress } from "./_components/upload-progress";
import { BreadcrumbNav } from "./_components/breadcrumb-nav";
import { FileList } from "./_components/file-list";

export default function CloudPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const { currentPath, navigateTo, navigateBack, breadcrumbs } = useFileNavigation();
  const {
    files,
    isLoading,
    isError,
    error,
    uploadMutation,
    deleteMutation,
    batchDeleteMutation,
    uploadProgress,
    refresh
  } = useFiles(currentPath);

  const {
    selectedItems: selectedPaths,
    isSelectionMode,
    setIsSelectionMode,
    toggleSelection,
    clearSelection,
  } = useSelection<string>();

  const { contextMenu, openMenu, closeMenu } = useContextMenu();
  const { isDragging, dragHandlers } = useFileDragDrop((files) => uploadMutation.mutate(files));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleLongPress = (file: FileItem) => {
    if (isMobile) {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
      openMenu({
        x: window.innerWidth / 2 - 80,
        y: window.innerHeight / 2 - 100,
      }, {
        path: file.path,
        isDir: file.isDir,
        name: file.name
      });
    }
  };

  const onTouchStart = (file: FileItem) => {
    if (isSelectionMode) return;
    longPressTimer.current = setTimeout(() => handleLongPress(file), 600);
  };

  const onTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    if (isMobile) return;
    openMenu(e, {
      path: file.path,
      isDir: file.isDir,
      name: file.name
    });
  };

  const handleBatchDownload = () => {
    selectedPaths.forEach(path => {
      const link = document.createElement("a");
      link.href = getDownloadUrl(path);
      link.download = path.split("/").pop() || "file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleBatchDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedPaths.size} 个项目吗？`)) {
      batchDeleteMutation.mutate(Array.from(selectedPaths), {
        onSuccess: () => {
          clearSelection();
        }
      });
    }
  };

  const handleFolderClick = (path: string) => {
    if (isSelectionMode) {
      toggleSelection(path);
      return;
    }
    navigateTo(path);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      uploadMutation.mutate(selectedFiles);
    }
    e.target.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <main
      className="relative h-full w-full overflow-hidden bg-background"
      {...dragHandlers}
    >
      <DropZone isDragging={isDragging} />

      <SelectionActionBar
        selectedCount={selectedPaths.size}
        isDeleting={batchDeleteMutation.isPending}
        onDownload={handleBatchDownload}
        onDelete={handleBatchDelete}
        onClear={clearSelection}
      />

      <ContextMenu
        menu={contextMenu}
        onOpen={(path, isDir) => {
          if (isDir) {
            handleFolderClick(path);
          } else {
            window.open(getPreviewUrl(path), "_blank");
          }
        }}
        onDownload={(path, isDir) => {
          if (isDir) {
            window.location.href = getDownloadDirUrl(path);
          } else {
            window.location.href = getDownloadUrl(path);
          }
        }}
        onSelect={(path) => {
          toggleSelection(path);
          setIsSelectionMode(true);
        }}
        onDelete={(path, name) => {
          if (window.confirm(`确定要删除 "${name}" 吗？`)) {
            deleteMutation.mutate(path);
          }
        }}
        onClose={closeMenu}
      />

      <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto px-4 md:px-6">
        <Header
          user={user}
          isUploading={uploadMutation.isPending}
          onRefresh={refresh}
          onUploadFile={() => fileInputRef.current?.click()}
          onUploadFolder={() => folderInputRef.current?.click()}
          fileInputRef={fileInputRef}
          folderInputRef={folderInputRef}
          onFileChange={onFileChange}
        />

        <UploadProgress progress={uploadProgress} />

        <BreadcrumbNav
          currentPath={currentPath}
          breadcrumbs={breadcrumbs}
          onNavigate={navigateTo}
          onBack={navigateBack}
        />

        {/* File List - Scrolling Section */}
        <div className="flex-1 min-h-0 flex flex-col mb-4">
          <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-background/40 backdrop-blur-md scrollbar-thin scrollbar-thumb-border">
            <FileList
              files={files}
              isLoading={isLoading}
              isError={isError}
              error={error}
              selectedPaths={selectedPaths}
              isSelectionMode={isSelectionMode}
              isMobile={isMobile}
              isDeleting={deleteMutation.isPending}
              deletingPath={deleteMutation.variables || null}
              onRefresh={refresh}
              onFileClick={(file) => {
                if (isSelectionMode) {
                  toggleSelection(file.path);
                } else if (file.isDir) {
                  handleFolderClick(file.path);
                } else {
                  window.location.href = getDownloadUrl(file.path);
                }
              }}
              onContextMenu={handleContextMenu}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onDelete={(file) => {
                if (
                  window.confirm(
                    `确定要删除 ${file.isDir ? "文件夹" : "文件"} "${file.name
                    }" 吗？此操作不可撤销。`
                  )
                ) {
                  deleteMutation.mutate(file.path);
                }
              }}
              onPreview={(path) => window.open(getPreviewUrl(path), "_blank")}
              onDownload={(path) => (window.location.href = getDownloadUrl(path))}
              formatSize={formatSize}
            />
          </div>
        </div>

        {/* Info Footer - Fixed Height Section */}
        <div className="pb-6 flex items-center justify-between text-[10px] md:text-xs text-muted-foreground/60 shrink-0">
          <p>共 {files?.length ?? 0} 个项目</p>
          <p>存储空间由 Xra 云提供支持</p>
        </div>
      </div>
    </main>
  );
}

