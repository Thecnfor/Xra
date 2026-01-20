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
  const [store] = React.useState(() => createAppStore(initState));

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
