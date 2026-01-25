import type { StoreApi } from "zustand/vanilla";

export type ThemeMode = "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export interface ThemeSlice {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  setResolvedTheme: (resolvedTheme: ResolvedTheme) => void;
}

export type ThemeSliceInit = Partial<Pick<ThemeSlice, "theme" | "resolvedTheme">>;

export function createThemeSlice<T extends ThemeSlice>(
  set: StoreApi<T>["setState"],
  _get: StoreApi<T>["getState"],
  init?: ThemeSliceInit,
): ThemeSlice {
  return {
    theme: init?.theme ?? "light",
    resolvedTheme: init?.resolvedTheme ?? "light",
    setTheme: (theme) => set({ theme } as Partial<T>),
    setResolvedTheme: (resolvedTheme) =>
      set({ resolvedTheme } as Partial<T>),
  };
}
