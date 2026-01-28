"use client";

import * as React from "react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import type { AppInitState, AppState, AppStore } from "./store";
import { createAppStore } from "./store";

const AppStoreContext = React.createContext<AppStore | null>(null);

export function AppStoreProvider({
  children,
  initState,
}: {
  children: React.ReactNode;
  initState?: AppInitState;
}) {
  // 注意：store 只创建一次，后续通过 setState 合并 initState 补丁，避免为了“延迟初始化”而阻断 SSR。
  const [store] = React.useState<AppStore>(() => createAppStore(initState));

  React.useEffect(() => {
    if (!initState) return;
    store.setState(initState);
  }, [initState, store]);

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore<T>(
  selector: (state: AppState) => T,
  equalityFn?: (a: T, b: T) => boolean,
): T {
  const store = React.useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return useStoreWithEqualityFn(store, selector, equalityFn);
}
