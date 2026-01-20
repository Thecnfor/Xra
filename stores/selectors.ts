import type { AppState } from "./store";

export const selectTheme = (state: AppState) => state.theme;
export const selectSetTheme = (state: AppState) => state.setTheme;

export const selectMenuOpen = (state: AppState) => state.menuOpen;
export const selectSetMenuOpen = (state: AppState) => state.setMenuOpen;
export const selectToggleMenuOpen = (state: AppState) => state.toggleMenuOpen;

