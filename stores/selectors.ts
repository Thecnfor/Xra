import type { AppState } from "./store";

export const selectTheme = (state: AppState) => state.theme;
export const selectSetTheme = (state: AppState) => state.setTheme;

export const selectMenuOpen = (state: AppState) => state.menuOpen;
export const selectSetMenuOpen = (state: AppState) => state.setMenuOpen;
export const selectToggleMenuOpen = (state: AppState) => state.toggleMenuOpen;

export const selectIslandMessages = (state: AppState) => state.islandMessages;
export const selectIslandActiveId = (state: AppState) => state.islandActiveId;
export const selectIslandExpanded = (state: AppState) => state.islandExpanded;
export const selectPushIslandMessage = (state: AppState) => state.pushIslandMessage;
export const selectDismissIslandActive = (state: AppState) => state.dismissIslandActive;
export const selectSetIslandExpanded = (state: AppState) => state.setIslandExpanded;
export const selectSetIslandActiveId = (state: AppState) => state.setIslandActiveId;
export const selectClearIslandMessages = (state: AppState) => state.clearIslandMessages;
