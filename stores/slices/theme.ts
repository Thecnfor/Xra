import type { StoreApi } from "zustand/vanilla";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeSlice {
  theme: "light" | "dark" | "system";
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
    theme: init?.theme ?? "system",
    resolvedTheme: init?.resolvedTheme ?? "light",
    setTheme: (theme) => set({ theme } as Partial<T>),
    setResolvedTheme: (resolvedTheme) =>
      set({ resolvedTheme } as Partial<T>),
  };
}
