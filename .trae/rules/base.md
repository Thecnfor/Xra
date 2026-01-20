# 项目开发规范 (Project Development Rules)

## 1. 核心原则 (Core Principles)

- **包管理器**: 使用 `pnpm`。
  - ⚠️ **重要**: 永远不自动安装依赖。如果需要引入新库，请分析利弊并建议用户安装。
- **语言**: 代码命名使用英文，注释和文档使用中文。
- **技术栈**: Next.js (App Router), TypeScript, Tailwind CSS.
不要pnpm dev，只要pnpm lint和pnpm build即可

## 2. Xra 项目是一个综合型全栈网站

- 对外展示页、API 接口、数据库、用户认证等功能。
- 后台存在HomeAssistant 插件接口，用于与 HomeAssistant 集成。