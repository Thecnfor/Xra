---
alwaysApply: false
description: 写前端组件，UI设计，前端开发时
---
# 样式开发规范 (Style Guidelines)

## 1. 核心工具 (Core Tools)
- **Tailwind CSS v4**: 核心样式引擎，坚持 Utility-First 原则。
- **类名合并**: **必须**使用 `cn()` (`clsx` + `tailwind-merge`) 处理类名冲突与条件渲染。
- **变体管理**: 多态组件（如 Button）**必须**使用 `class-variance-authority` (CVA) 定义样式变体。

## 2. 组件样式 (Component Styling)
- **结构定义**: 参考 `Button` 组件，清晰定义 `variants` (如 `variant`, `size`) 与 `defaultVariants`。

## 3. 性能与最佳实践 (Performance & Best Practices)
- **零运行时**: 避免 CSS-in-JS 运行时开销，利用 Tailwind 原子类。
- **外部扩展**: 组件必须接受 `className` props 并通过 `cn()` 合并到根元素，允许外部微调。
- **动画策略**: 简单交互使用 Tailwind `transition`；复杂编排使用 `motion/react` (Framer Motion)。

## 4. 状态管理 (State Management)
- **边界划分**: Server Components 负责数据获取与拼装；Client Components 承担交互与本地状态。
- **全局 Store**: 全局 UI/偏好用 Zustand；服务端状态/请求缓存优先用 React Query，避免重复造轮子。
- **Provider 位置**: 全局 Provider 仅放在根布局（如 `app/layout.tsx`），避免多处挂载导致状态重置。
- **目录归属**: 业务/模块状态就近放在对应包目录；真正跨域共享的才进入 `stores/`。
