import type { AppState } from "./store";

export const selectTheme = (state: AppState) => state.theme;
export const selectSetTheme = (state: AppState) => state.setTheme;

export const selectSidePanelActiveId = (state: AppState) => state.sidePanelActiveId;
export const selectOpenSidePanel = (state: AppState) => state.openSidePanel;
export const selectCloseSidePanel = (state: AppState) => state.closeSidePanel;
export const selectToggleSidePanel = (state: AppState) => state.toggleSidePanel;
export const selectAnySidePanelOpen = (state: AppState) => state.sidePanelActiveId != null;

export const selectIsRouteLoading = (state: AppState) => state.isRouteLoading;
export const selectSetRouteLoading = (state: AppState) => state.setRouteLoading;

export const selectIsXraBranchActive = (state: AppState) => state.isXraBranchActive;
export const selectSetXraBranchActive = (state: AppState) => state.setXraBranchActive;

export const selectIsSidebarDrawerOpen = (state: AppState) => state.isSidebarDrawerOpen;
export const selectSetSidebarDrawerOpen = (state: AppState) => state.setSidebarDrawerOpen;
export const selectToggleSidebarDrawer = (state: AppState) => state.toggleSidebarDrawer;

export const selectMenuOpen = (state: AppState) => state.sidePanelActiveId === "menu";
export const selectSetMenuOpen = (state: AppState) => (open: boolean) => {
  if (open) state.openSidePanel("menu");
  else state.closeSidePanel();
};
export const selectToggleMenuOpen = (state: AppState) => () => state.toggleSidePanel("menu");

export const selectChatOpen = (state: AppState) => state.sidePanelActiveId === "chat";
export const selectOpenChat = (state: AppState) => () => state.openSidePanel("chat");

export const selectIslandMessages = (state: AppState) => state.islandMessages;
export const selectIslandActiveId = (state: AppState) => state.islandActiveId;
export const selectIslandExpanded = (state: AppState) => state.islandExpanded;
export const selectPushIslandMessage = (state: AppState) => state.pushIslandMessage;
export const selectDismissIslandActive = (state: AppState) => state.dismissIslandActive;
export const selectSetIslandExpanded = (state: AppState) => state.setIslandExpanded;
export const selectSetIslandActiveId = (state: AppState) => state.setIslandActiveId;
export const selectClearIslandMessages = (state: AppState) => state.clearIslandMessages;
