# 开发规范 (Development Rules)

基于 `package.json` 依赖分析，本项目采用以下开发规范。

## 1. 技术栈概览 (Tech Stack Overview)

- **核心框架**: [Next.js 16] (App Router) + [React 19]
- **编程语言**: [TypeScript]
- **样式方案**: [Tailwind CSS v4]
- **状态管理**:
  - 服务端状态: [@tanstack/react-query]
  - 客户端全局状态: [Zustand]
- **数据层**:
  - 数据库 ORM: [Prisma]
  - 缓存: Redis (驱动: `ioredis`)
  - 客户端存储: IndexedDB (封装: `dexie`)
- **表单与验证**: [React Hook Form] + [Zod]

## 2. 前端开发规范 (Frontend Guidelines)

### 2.1 组件与架构

- **React 19**: 充分利用 React 19 新特性（如 Server Actions, `useActionState`, `useOptimistic`）。
- **组件优先**: 默认使用 Server Components，仅在需要交互（hooks, event listeners）时使用 `"use client"`。
- **目录结构**: 遵循 Next.js App Router 规范。

### 2.3 状态管理 (State Management)

- **服务端数据**: 优先使用 `@tanstack/react-query` 获取和缓存 API 数据，避免在 `useEffect` 中手动 fetch。
- **全局状态**: 使用 `zustand` 管理跨组件的客户端状态（如 UI 状态、用户偏好）。
- **本地持久化**: 对于需要在客户端大量存储的数据，使用 `dexie`。
