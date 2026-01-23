/**
 * Overlays（覆盖层）是用于“浮层/抽屉/顶栏面板”等场景的可复用 UI 原语集合。
 *
 * 设计目标：
 * - 统一交互：遮罩点击关闭、Esc 关闭、锁定 body 滚动、关闭后焦点恢复
 * - 统一动效：支持从 top/right/left/bottom 方向滑入/滑出，并在关闭时保留退场动画
 * - 统一导入：业务侧只从这里 import，避免到处写深路径
 *
 * 推荐搭配：
 * - 组件：SlidePanel（TopSheet / Drawer）
 * - hooks：useOverlayControls（聚合焦点/键盘/滚动控制），usePresence（关闭退场期间保持挂载）
 */
export { default as SlidePanel } from "./slide-panel";
export type { SlidePanelProps, SlidePanelSide } from "./slide-panel";

export {
  useEscapeToClose,
  useLockBodyScroll,
  useOverlayControls,
  usePresence,
  useRestoreFocus,
} from "@/hooks/overlays";
