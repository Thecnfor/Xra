# 数据层规范 (Data Layer Rules)

## 1. 核心技术栈

- **数据库**: PostgreSQL
- **ORM**: Prisma
- **包管理器**: `pnpm` (严禁使用 npm/yarn)

## 2. Prisma 配置规范

### 2.1 文件结构
```
prisma/
├── schema.prisma      # 数据库模型定义
├── seed.ts            # 数据填充脚本
├── migrations/        # 数据库迁移历史
└── generated/         # 生成的代码目录
    └── prisma/        # Prisma Client 输出目录 (自定义)
```

### 2.2 Schema 定义
- **位置**: `prisma/schema.prisma`
- **Client 生成器配置**:
  必须指定 `output` 为 `./generated/prisma`，以配合项目构建配置。
  ```prisma
  generator client {
    provider = "prisma-client"
    output   = "./generated/prisma"
  }
  ```

### 2.3 Client 导入
- 严禁直接从 `@prisma/client` 导入（因为使用了自定义 output）。
- **必须** 使用 `tsconfig.json` 中定义的别名 `@/prismaClient` 进行导入。
  ```typescript
  // ✅ 正确
  import { PrismaClient } from '@/prismaClient';
  
  // ❌ 错误
  import { PrismaClient } from '@prisma/client';
  ```

## 3. 开发流程规范

### 3.1 数据库变更
1. 修改 `prisma/schema.prisma` 模型定义。
2. 运行 `npx prisma migrate dev --name <描述>` 生成并应用迁移。
3. **禁止** 手动修改数据库结构，一切变更必须通过 Prisma Migration 进行。

### 3.2 代码生成
- 每次运行 `migrate` 后，Prisma 会自动重新生成 Client。
- 如果只是拉取了代码（包含新的 schema），需要手动运行 `npx prisma generate`。

### 3.3 数据填充 (Seeding)
- 填充逻辑编写在 `prisma/seed.ts` 中。
- 使用 `tsx` 执行 TypeScript 脚本。
- 需确保 `package.json` 中包含 seed 配置：
  ```json
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
  ```

## 4. 最佳实践

- **单例模式**: 在 Next.js 开发环境下，为避免热重载导致连接数耗尽，应使用单例模式实例化 `PrismaClient`。
- **环境隔离**: 确保 `.env` 文件未提交到版本控制系统，且包含正确的 `DATABASE_URL`。
