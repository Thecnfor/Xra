---
alwaysApply: false
description: 写前端样式时
---
# Overlays 规则（UI 覆盖层）
- 统一入口：业务侧只从 components/ui/overlays 导入（禁止深路径）。
- 统一行为：关闭触发 onClose；遮罩点击/按钮点击/路由切换都走同一 onClose。
- Esc：默认支持 Esc 关闭；特殊场景才显式关闭 closeOnEscape。
- 锁滚：默认 useLockBodyScroll；不要在业务里重复写 body overflow。
- 焦点：打开时聚焦 initialFocusRef/指定元素；关闭后恢复到打开前焦点。
- 退场：需要退场动画时，用 usePresence(open, exitMs) 控制卸载时机。
- exitMs 必须与 CSS 退场时长一致（避免闪烁/卡住）。
- Portal：需要脱离布局/避免裁剪时用 ResponsivePortal；否则就地渲染。
- 组件拆分：OverlayRoot 管理状态；Backdrop/Content 只做渲染与样式。
- 交互一致：Backdrop 只负责点击关闭与透明度动画，不承载业务内容。
- 动效一致：面板滑入/滑出使用统一 side（top/right/left/bottom）语义。
- 可访问性：Content 需要可聚焦（tabIndex 或可聚焦子元素），避免键盘陷入。
- 性能：open=false 时尽量不渲染重内容；用 shouldRender 控制挂载边界。
- 目录约定：行为 hooks 放 hooks/overlays.ts；组件聚合导出放 components/ui/overlays/index.ts。
- 测试点：Esc/遮罩点击/锁滚/焦点恢复/退场卸载都要可复现。
