export interface FileItem {
  name: string;
  isDir: boolean;
  size: number;
  path: string;
}

const BASE_URL = "http://localhost:8080/api";

export async function listFiles(path: string = ""): Promise<FileItem[]> {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const res = await fetch(`${BASE_URL}/list/${normalizedPath}`);
  if (!res.ok) throw new Error("Failed to list files");
  return res.json();
}

export function getPreviewUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/view/${normalizedPath}`;
}

export function getDownloadUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/download/${normalizedPath}`;
}

export async function uploadFile(file: File, path: string = ""): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload file");
}
