import type { StoreApi } from "zustand/vanilla";

export interface UiSlice {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenuOpen: () => void;
}

export type UiSliceInit = Partial<Pick<UiSlice, "menuOpen">>;

export function createUiSlice<T extends UiSlice>(
  set: StoreApi<T>["setState"],
  _get: StoreApi<T>["getState"],
  init?: UiSliceInit,
): UiSlice {
  return {
    menuOpen: init?.menuOpen ?? false,
    setMenuOpen: (menuOpen) => set({ menuOpen } as Partial<T>),
    toggleMenuOpen: () =>
      set((state) => ({ menuOpen: !state.menuOpen }) as Partial<T>),
  };
}
