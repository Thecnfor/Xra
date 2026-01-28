export { default as XraBackground } from "./background/XraBackground.client";
export type { XraBackgroundProps } from "./background/XraBackground.client";

export { XraCenterStage } from "./stage/XraCenterStage.client";
export type { XraCenterStageProps } from "./stage/XraCenterStage.client";

export { XraBootShell } from "./boot/XraBootShell.client";
export type { XraBootShellProps } from "./boot/XraBootShell.client";

export { XraBootOverlay } from "./boot/XraBootOverlay.client";
export type { XraBootOverlayProps, XraBootOverlayPhase } from "./boot/XraBootOverlay.client";

export { registerXraBootTask, getXraBootTasks } from "./boot/registry.client";
export type { XraBootTask, XraBootContext } from "./boot/types";
