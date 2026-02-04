import { useState, useCallback, useMemo } from "react";

export function useFileNavigation(initialPath: string = "") {
  const [currentPath, setCurrentPath] = useState(initialPath);

  const navigateTo = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

  const navigateBack = useCallback(() => {
    setCurrentPath((prev) => {
      const parts = prev.split("/").filter(Boolean);
      parts.pop();
      return parts.length > 0 ? `/${parts.join("/")}` : "";
    });
  }, []);

  const breadcrumbs = useMemo(() => 
    currentPath.split("/").filter(Boolean)
  , [currentPath]);

  return {
    currentPath,
    setCurrentPath,
    navigateTo,
    navigateBack,
    breadcrumbs,
  };
}
