import type { AppInitState } from "@/stores/store";

export type XraBootContext = {
  startedAt: number;
  pathname: string;
  signal: AbortSignal;
  addInitState: (patch: AppInitState) => void;
};

export type XraBootTask = {
  id: string;
  run: (ctx: XraBootContext) => void | Promise<void>;
};

