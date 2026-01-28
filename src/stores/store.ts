import { createStore } from "zustand/vanilla";
import { createThemeSlice, type ThemeSlice, type ThemeSliceInit } from "./slices/theme";
import { createUiSlice, type UiSlice, type UiSliceInit } from "./slices/menu";
import { createIslandSlice, type IslandSlice, type IslandSliceInit } from "./slices/island";

export type AppState = ThemeSlice & UiSlice & IslandSlice;
export type AppStore = ReturnType<typeof createAppStore>;
export type AppInitState = ThemeSliceInit & UiSliceInit & IslandSliceInit;

export function createAppStore(initState?: AppInitState) {
  return createStore<AppState>()((set, get) => ({
    ...createThemeSlice(set, get, initState),
    ...createUiSlice(set, get, initState),
    ...createIslandSlice(set, get, initState),
  }));
}
