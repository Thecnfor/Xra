import { useState, useRef, useCallback } from "react";

async function getAllFilesFromEntry(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    return new Promise((resolve) => {
      fileEntry.file((file: File) => {
        const relativePath = entry.fullPath.startsWith("/") ? entry.fullPath.slice(1) : entry.fullPath;
        Object.defineProperty(file, "webkitRelativePath", {
          value: relativePath,
          writable: false,
        });
        resolve([file]);
      });
    });
  } else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const reader = dirEntry.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve) => {
      reader.readEntries((results) => resolve(results));
    });
    const files = await Promise.all(entries.map(e => getAllFilesFromEntry(e)));
    return files.flat();
  }
  return [];
}

export function useFileDragDrop(onFilesDrop: (files: File[]) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;

    const items = Array.from(e.dataTransfer.items);
    if (items.length > 0) {
      const filePromises = items.map(item => {
        const entry = item.webkitGetAsEntry();
        if (entry) return getAllFilesFromEntry(entry);
        return Promise.resolve([] as File[]);
      });
      const allFiles = (await Promise.all(filePromises)).flat();
      if (allFiles.length > 0) {
        onFilesDrop(allFiles);
      }
    }
  }, [onFilesDrop]);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  return {
    isDragging,
    dragHandlers: {
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
    }
  };
}
