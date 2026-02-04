import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listFiles, uploadFile, deleteFile } from "@/lib/api";

export function useFiles(currentPath: string) {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<{ total: number; current: number } | null>(null);

  const filesQuery = useQuery({
    queryKey: ["files", currentPath],
    queryFn: () => listFiles(currentPath),
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      setUploadProgress({ total: files.length, current: 0 });
      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], currentPath);
        setUploadProgress(prev => prev ? { ...prev, current: i + 1 } : null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", currentPath] });
      setTimeout(() => setUploadProgress(null), 2000);
    },
    onError: () => {
      setUploadProgress(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (path: string) => deleteFile(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", currentPath] });
    },
  });

  const batchDeleteMutation = useMutation({
    mutationFn: async (paths: string[]) => {
      for (const path of paths) {
        await deleteFile(path);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", currentPath] });
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["files", currentPath] });
  };

  return {
    files: filesQuery.data,
    isLoading: filesQuery.isLoading,
    isError: filesQuery.isError,
    error: filesQuery.error,
    uploadMutation,
    deleteMutation,
    batchDeleteMutation,
    uploadProgress,
    refresh,
  };
}
