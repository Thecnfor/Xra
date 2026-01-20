import type { StoreApi } from "zustand/vanilla";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeSlice {
  theme: "light" | "dark" | "system";
  setTheme: (theme: ThemeMode) => void;
}

export type ThemeSliceInit = Partial<Pick<ThemeSlice, "theme">>;

export function createThemeSlice<T extends ThemeSlice>(
  set: StoreApi<T>["setState"],
  _get: StoreApi<T>["getState"],
  init?: ThemeSliceInit,
): ThemeSlice {
  return {
    theme: init?.theme ?? "system",
    setTheme: (theme) => set({ theme } as Partial<T>),
  };
}
