import type { StoreApi } from "zustand/vanilla";

export interface UiSlice {
  sidePanelActiveId: string | null;
  isRouteLoading: boolean;
  openSidePanel: (id: string) => void;
  closeSidePanel: () => void;
  toggleSidePanel: (id: string) => void;
  setRouteLoading: (loading: boolean) => void;
}

export type UiSliceInit = Partial<Pick<UiSlice, "sidePanelActiveId" | "isRouteLoading">>;

export function createUiSlice<T extends UiSlice>(
  set: StoreApi<T>["setState"],
  _get: StoreApi<T>["getState"],
  init?: UiSliceInit,
): UiSlice {
  return {
    sidePanelActiveId: init?.sidePanelActiveId ?? null,
    isRouteLoading: init?.isRouteLoading ?? false,
    openSidePanel: (sidePanelActiveId) => set({ sidePanelActiveId } as Partial<T>),
    closeSidePanel: () => set({ sidePanelActiveId: null } as Partial<T>),
    toggleSidePanel: (id) =>
      set((state) => {
        const sidePanelActiveId = state.sidePanelActiveId === id ? null : id;
        return { sidePanelActiveId } as Partial<T>;
      }),
    setRouteLoading: (isRouteLoading) => set({ isRouteLoading } as Partial<T>),
  };
}
