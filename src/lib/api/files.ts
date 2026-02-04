import { api } from "./index";

export interface FileItem {
  name: string;
  isDir: boolean;
  size: number;
  path: string;
}

export async function listFiles(path: string = ""): Promise<FileItem[]> {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return api.get<FileItem[]>(`/files/list/${normalizedPath}`);
}

export function getPreviewUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${api.getBaseUrl()}/files/view/${normalizedPath}`;
}

export function getDownloadUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${api.getBaseUrl()}/files/download/${normalizedPath}`;
}

export function getDownloadDirUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${api.getBaseUrl()}/files/download-dir/${normalizedPath}`;
}

export async function uploadFile(file: File, path: string = ""): Promise<void> {
  const formData = new FormData();
  // 根据用户提供的 curl 示例，字段名应该是 myFile
  formData.append("myFile", file);

  // 如果 file 有 webkitRelativePath (文件夹上传)，则使用它来构造完整路径
  // 否则使用 path (当前目录) + 文件名
  const fullPath = file.webkitRelativePath
    ? (path ? `${path}/${file.webkitRelativePath}` : file.webkitRelativePath)
    : (path ? `${path}/${file.name}` : file.name);

  formData.append("path", fullPath.startsWith("/") ? fullPath.slice(1) : fullPath);

  return api.post<void>("/files/upload", formData);
}

export async function deleteFile(path: string): Promise<void> {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return api.delete<void>(`/files/delete/${normalizedPath}`);
}
