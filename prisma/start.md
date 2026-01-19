# Prisma 快速开始指南

本文档旨在帮助开发者快速上手本项目中的 Prisma 数据库操作。

## 1. 环境准备

在开始之前，请确保 `.env` 文件中已正确配置数据库连接字符串：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

## 2. 常用命令速查

以下是项目中常用的 Prisma 命令，请使用 `pnpm` 或 `npx` 执行。

### 初始化与生成

```bash
# 初始化 Prisma (如果尚未初始化)
# 注意：--output 参数指定了 Prisma Client 的生成位置，这在本项目中是必须的
npx prisma init --db --output ./generated/prisma

# 生成 Prisma Client
# 每次修改 schema.prisma 后都需要执行此命令
npx prisma generate
```

### 数据库迁移 (Migration)

```bash
# 创建并执行新的迁移
# 用于开发环境，会自动根据 schema 变化更新数据库结构
npx prisma migrate dev --name <migration_name>
# 例如：
npx prisma migrate dev --name init

# 仅部署迁移 (生产环境)
npx prisma migrate deploy
```

### 数据填充 (Seeding)

```bash
# 运行数据库填充脚本
# 依赖于 prisma/seed.ts 和 package.json 中的 prisma.seed 配置
npx prisma db seed
```

### 可视化管理

```bash
# 启动 Prisma Studio
# 提供一个 Web 界面来查看和编辑数据库数据
npx prisma studio
```

## 3. 项目特定配置说明

### Prisma Client 生成位置
本项目配置了自定义的 Client 输出目录，位于 `prisma/generated/prisma`。这样做是为了避免某些环境下的依赖问题或为了更好地控制项目结构。

### 导入方式
在代码中导入 `PrismaClient` 时，请使用 `tsconfig.json` 中配置的别名（如果可用）或相对路径。

推荐配置 `tsconfig.json` 路径映射：
```json
"paths": {
  "@/prismaClient": ["./prisma/generated/prisma"]
}
```
使用示例：
```typescript
import { PrismaClient } from '@/prismaClient';
const prisma = new PrismaClient();
```
