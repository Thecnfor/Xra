import { useState, useCallback, useEffect } from "react";

export interface ContextMenuState {
  x: number;
  y: number;
  path: string;
  isDir: boolean;
  name: string;
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const openMenu = useCallback((e: React.MouseEvent | { x: number; y: number }, data: Omit<ContextMenuState, 'x' | 'y'>) => {
    if ('clientX' in (e as React.MouseEvent)) {
      const mouseEvent = e as React.MouseEvent;
      setContextMenu({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
        ...data
      });
    } else {
      const pos = e as { x: number; y: number };
      setContextMenu({
        x: pos.x,
        y: pos.y,
        ...data
      });
    }
  }, []);

  const closeMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return {
    contextMenu,
    setContextMenu,
    openMenu,
    closeMenu,
  };
}
