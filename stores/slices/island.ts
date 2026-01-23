import type { StoreApi } from "zustand/vanilla";

export type IslandMessage = {
  id: string;
  title?: string;
  summary: string;
  detail?: string;
  href?: string;
  receivedAt?: number;
};

export interface IslandSlice {
  islandMessages: IslandMessage[];
  islandActiveId: string | null;
  islandExpanded: boolean;
  pushIslandMessage: (message: Omit<IslandMessage, "id"> & { id?: string }) => void;
  setIslandExpanded: (expanded: boolean) => void;
  setIslandActiveId: (id: string | null) => void;
  dismissIslandActive: () => void;
  clearIslandMessages: () => void;
}

export type IslandSliceInit = Partial<
  Pick<IslandSlice, "islandMessages" | "islandActiveId" | "islandExpanded">
>;

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createIslandSlice<T extends IslandSlice>(
  set: StoreApi<T>["setState"],
  get: StoreApi<T>["getState"],
  init?: IslandSliceInit,
): IslandSlice {
  return {
    islandMessages: init?.islandMessages ?? [],
    islandActiveId: init?.islandActiveId ?? null,
    islandExpanded: init?.islandExpanded ?? false,
    pushIslandMessage: (message) => {
      const msg: IslandMessage = {
        id: message.id ?? createId(),
        title: message.title,
        summary: message.summary,
        detail: message.detail,
        href: message.href,
        receivedAt: message.receivedAt ?? Date.now(),
      };

      set((state) => {
        const next = [msg, ...(state.islandMessages ?? [])].slice(0, 20);
        return {
          islandMessages: next,
          islandActiveId: msg.id,
          islandExpanded: false,
        } as Partial<T>;
      });
    },
    setIslandExpanded: (islandExpanded) => set({ islandExpanded } as Partial<T>),
    setIslandActiveId: (islandActiveId) =>
      set({ islandActiveId } as Partial<T>),
    dismissIslandActive: () => {
      const { islandActiveId, islandMessages } = get();
      if (!islandActiveId) return;
      const next = (islandMessages ?? []).filter((m) => m.id !== islandActiveId);
      set({
        islandMessages: next,
        islandActiveId: next.at(0)?.id ?? null,
        islandExpanded: false,
      } as Partial<T>);
    },
    clearIslandMessages: () =>
      set({
        islandMessages: [] as IslandMessage[],
        islandActiveId: null,
        islandExpanded: false,
      } as Partial<T>),
  };
}
