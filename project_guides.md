# 项目指南 (Project Guides)

本文档旨在帮助 AI 助手快速了解本项目，掌握开发规范与流程。

## 1. 项目概览

本项目是一个基于 **SvelteKit** 的现代化全栈应用启动模板，集成了 **Better Auth** 进行身份验证，使用 **Drizzle ORM** 操作 **PostgreSQL** 数据库，并采用 **Tailwind CSS** 进行样式设计。

### 核心技术栈

-   **框架**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5 with runes)
-   **语言**: TypeScript
-   **运行时/包管理**: [Bun](https://bun.sh/) (优先使用 Bun，也支持 npm)
-   **样式**: [Tailwind CSS v4](https://tailwindcss.com/) (无需 tailwind.config.js)
-   **数据库**: PostgreSQL (通过 Docker 运行)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **身份验证**: [Better Auth](https://github.com/davidgatti/better-auth) (支持 GitHub & Google OAuth)
-   **测试**:
    -   单元测试: [Vitest](https://vitest.dev/)
    -   E2E 测试: [Playwright](https://playwright.dev/)

## 2. 常用命令

请优先使用 `bun` 运行命令。

### 开发

-   **安装依赖**: `bun install`
-   **启动开发服务器**: `bun dev` (或 `bun dev -- --open` 自动打开浏览器)
-   **构建生产版本**: `bun run build`
-   **预览生产版本**: `bun preview`

### 数据库 (Drizzle & Docker)

-   **启动数据库**: `bun db:start` (使用 Docker Compose 启动 PostgreSQL)
-   **推送 Schema 变更**: `bun db:push` (修改 `src/lib/server/db/schema.ts` 后运行)
-   **查看数据库 (Studio)**: `bun db:studio`
-   **执行迁移**: `bun db:migrate`

### 测试

-   **运行所有测试**: `bun test`
-   **运行单元测试**: `bun test:unit`
-   **运行 E2E 测试**: `bun test:e2e`

### 代码质量

-   **类型检查**: `bun check`
-   **格式化**: `bun format`
-   **Lint**: `bun lint`

## 3. 项目结构与架构

-   **`src/routes/`**: SvelteKit 路由。
    -   `+layout.svelte`: 全局布局，包含 `LightSwitch` 和全局样式引入。
    -   `/login`: 登录页面。
    -   `/dashboard`: 受保护的仪表盘页面。
-   **`src/lib/server/db/`**: 数据库相关。
    -   `schema.ts`: 定义数据库表结构 (User, Session, Account 等)。
    -   `index.ts`: 数据库连接配置。
-   **`src/lib/auth.ts`**: Better Auth 服务端配置。
-   **`src/lib/auth-client.ts`**: Better Auth 客户端辅助函数 (`createAuthClient`, `signIn`, `signOut` 等)。
-   **`src/app.css`**: 全局样式，引入 Tailwind CSS。

## 4. 关键开发指南

### 数据库变更流程

1.  修改 `src/lib/server/db/schema.ts` 定义表结构。
2.  运行 `bun db:push` 将变更同步到数据库。
3.  (可选) 使用 `bun db:studio` 查看数据。

### 身份验证

-   使用 `better-auth` 处理认证。
-   环境变量配置在 `.env` 中 (参考 `.env.example`)，包括 `BETTER_AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GOOGLE_CLIENT_ID` 等。
-   回调 URL 默认为 `http://localhost:5173/api/auth/callback/github` (或 google)。

### 国际化 (i18n) 方案

本项目计划采用轻量级 i18n 方案 (参考 `i18n-implement.md`)：

-   **路由策略**: 使用可选路由参数 `[[lang=locale]]`，默认语言 (en) 不带前缀，其他语言 (如 zh) 带前缀。
-   **资源文件**: 存放在 `src/lib/i18n/`。
-   **实现方式**: 不依赖第三方重型库，通过 `+layout.server.ts` 加载 JSON 资源，通过 `+layout.svelte` 提供简易 `t` 函数。

### 样式开发

-   使用 Tailwind CSS v4。
-   支持深色模式，通过 `LightSwitch` 组件切换。

## 5. 注意事项

-   **环境**: 确保本地安装了 Docker (用于数据库) 和 Bun。
-   **配置**: 数据库 URL 和 Auth 密钥必须在 `.env` 中正确配置。
-   **测试**: 编写新功能时，请确保添加相应的单元测试或 E2E 测试。
