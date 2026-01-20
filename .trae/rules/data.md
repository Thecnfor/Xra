---
alwaysApply: false
description: 开发前端数据库时
---
# 数据层规范 (Data Layer Rules)

### 2.3 Client 导入
- 严禁直接从 `@prisma/client` 导入（因为使用了自定义 output）。
- **必须** 使用 `tsconfig.json` 中定义的别名 `@/prismaClient` 进行导入。
  ```typescript
  // ✅ 正确
  import { PrismaClient } from '@/prismaClient';
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