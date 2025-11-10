# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands you’ll use often

- Install deps (npm is the default; Bun also works per README)
  - npm install
  - bun install
- Start dev server
  - npm run dev
  - Open browser: npm run dev -- --open
- Build and preview
  - npm run build
  - npm run preview
- Typecheck
  - npm run check
  - Watch: npm run check:watch
- Lint and format
  - Lint (Prettier check + ESLint): npm run lint
  - Format (Prettier write): npm run format

### Tests
- Run all unit tests (Vitest workspaces: client=jsdom for Svelte, server=node)
  - npm run test:unit           # watch mode
  - npm run test:unit -- --run  # run once (CI-style)
- Run a single unit test file
  - npm run test:unit -- src/routes/page.svelte.test.ts
- Filter by test name
  - npm run test:unit -- src/routes/page.svelte.test.ts -t "should render h1"
- Run only the client or server Vitest workspace
  - Client (Svelte + jsdom): npm run test:unit -- --project client
  - Server (Node):           npm run test:unit -- --project server

- End-to-end tests (Playwright; server auto-built via config)
  - All: npm run test:e2e
  - Single spec: npm run test:e2e -- e2e/demo.test.ts
  - By title: npm run test:e2e -- -g "home page has expected h1"

### Database (PostgreSQL via Docker + Drizzle)
- Start DB (docker compose up): npm run db:start
- Apply schema (Drizzle Kit push): npm run db:push
- Run generated migrations: npm run db:migrate
- Open Drizzle Studio: npm run db:studio

Environment required for DB/Drizzle commands (see .env.example):
- DATABASE_URL must be set (e.g. postgres://root:mysecretpassword@localhost:5432/local)

## Architecture overview

- Framework/runtime
  - SvelteKit (Svelte 5 runes) with adapter-auto (Node during dev; adapter picked at build time).
  - Vite config (vite.config.ts) loads @sveltejs/kit and @tailwindcss/vite. Vitest is configured as a multi-project workspace:
    - client project: jsdom, @testing-library/svelte, setup file vitest-setup-client.ts
    - server project: node environment for non-Svelte tests
- Styling/UI
  - Tailwind CSS v4 (no tailwind.config file needed) imported in src/app.css along with Skeleton UI theme/presets.
  - Light/dark toggle implemented via routes/components/LightSwitch.svelte (stores mode in localStorage and data-mode attribute).
- Routing/layout
  - src/routes/+layout.svelte imports global styles and renders LightSwitch, then {@render children()} for page content.
  - Public pages:
    - / (root) shows session-aware welcome and sign-in/out controls
    - /login offers Google and GitHub OAuth sign-in buttons
    - /dashboard is protected and requires an active session
- Authentication
  - better-auth is configured in src/lib/auth.ts with the Drizzle adapter. Social providers: GitHub and Google; secrets loaded from process.env (dotenv/config is imported there for dev).
  - SvelteKit integration via src/hooks.server.ts using svelteKitHandler({ event, resolve, auth }). This wires up the better-auth routes (e.g. /api/auth/*) and session handling on the server.
  - Client helpers in src/lib/auth-client.ts expose createAuthClient(), signOut(), and useSession().
- Data layer
  - Drizzle ORM with postgres-js client. Connection configured in src/lib/server/db/index.ts using $env/dynamic/private.DATABASE_URL.
  - Schema in src/lib/server/db/schema.ts defines user, session, account, verification tables aligned with better-auth.
  - Drizzle Kit config in drizzle.config.ts (schema path, dialect=postgresql, DATABASE_URL from process.env).
- Testing
  - Unit tests: Vitest workspaces
    - Client Svelte example at src/routes/page.svelte.test.ts
    - Generic example at src/demo.spec.ts
    - JSDOM setup and matchMedia shim in vitest-setup-client.ts
  - E2E tests: Playwright with testDir=e2e, webServer builds then previews the app; example: e2e/demo.test.ts
- Linting/formatting
  - Flat ESLint config in eslint.config.js combining @eslint/js, typescript-eslint, eslint-plugin-svelte, and eslint-config-prettier. Prettier runs via scripts with svelte and tailwind plugins installed.
- Config and env
  - svelte.config.js uses adapter-auto and vitePreprocess.
  - tsconfig.json extends .svelte-kit/tsconfig.json and enables strict TS.
  - .env.example documents required variables for auth and DB.

## Notes for future agents
- Default package manager: npm (package-lock.json is present). README also documents Bun usage; commands above provide npm first with Bun alternatives where relevant.
- For DB/Drizzle commands, ensure DATABASE_URL is present in the shell environment or a .env file at repo root. docker-compose.yml spins up a local Postgres compatible with .env.example.
- Auth callbacks must match your BETTER_AUTH_URL (see .env.example) and your provider dashboard settings. The app expects the default development origin http://localhost:5173.
