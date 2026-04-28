# Project Index: react-tic-tac-toe

Generated: 2026-04-28

## Project Structure

```
.
├── client/              # React 19 SPA (Vite 8)
│   └── src/
│       ├── components/  # Shared UI (shadcn, theme)
│       ├── game/        # Core game logic & components
│       │   ├── components/   # Board, GamePanel, PlayerSymbol, SettingsForm
│       │   ├── strategies/   # Win-detection strategies
│       │   └── __tests__/    # Game logic tests
│       ├── lib/         # Utility functions
│       └── routes/      # TanStack Router file-based routes
├── server/              # Fastify API server
│   ├── db/              # Prisma DB client
│   ├── generated/       # Prisma generated code
│   ├── prisma/          # Schema definition (SQLite)
│   └── rooms/           # (empty — planned multiplayer rooms)
├── shared/              # Shared package (placeholder)
├── Taskfile.yml         # Task runner (task server, task client)
└── CLAUDE.md            # Dev instructions
```

## Monorepo Layout

Bun workspaces: `client`, `server`, `shared`

## Entry Points

- **Client:** `client/src/main.tsx` — React root, SuperTokens init, TanStack Router + Query providers
- **Server:** `server/server.ts` — Fastify, CORS, SuperTokens auth, Prisma DB, API routes
- **Dev:** `task server` + `task client` (or `bun run dev` in each workspace)

## Routes (TanStack Router, file-based)

| Route          | File                     | Description                        |
| -------------- | ------------------------ | ---------------------------------- |
| `/`            | `routes/index.tsx`       | Redirects to `/local-game`         |
| `/local-game`  | `routes/local-game.tsx`  | Main game (Game component)         |
| `/online-game` | `routes/online-game.tsx` | Auth-gated, stub (not implemented) |
| `/auth/*`      | `routes/auth/`           | SuperTokens auth UI                |

## Core Modules

### Game Engine (`client/src/game/`)

- **types.ts** — `Player`, `SymbolText`, `BoardState`, `GameWinCheckStrategy`, `Settings`
- **functions.ts** — `createBoard`, `getNextPlayer`, `isBoardFilled`, `calculateBoardSizeToFit`, `playerSymbol`
- **use-game.tsx** — `useGame` hook: owns board state, player turns, win/draw detection, settings
- **game.tsx** — `Game` component: orchestrates settings form, board, reset, win/draw display

### Win Strategies (`client/src/game/strategies/`)

- **x-to-win-strategy.ts** — Active strategy. Wins require `toWin` consecutive marks in any direction
- **full-size-strategy.ts** — Classic NxN rules (entire row/col/diag). Tested but not used in-game

### UI Components

- **Board** (`game/components/board.tsx`) — Grid rendering, click handling, winning field highlights
- **GamePanel** (`game/components/game-panel.tsx`) — Layout wrapper with Emotion styling
- **SettingsForm** (`game/components/settings-form.tsx`) — TanStack Form for size/toWin
- **PlayerSymbol** (`game/components/player-symbol.tsx`) — Current player indicator
- **Shared UI** (`components/ui/`) — shadcn components: Button, Field, Input, Label, Separator

### Server (`server/`)

- **server.ts** — Fastify app with 3 API endpoints: `GET /api/me`, `GET /api/rooms`, `POST /api/rooms` (all session-gated)
- **supertokens.ts** — Auth config: EmailPassword + ThirdParty (Google, GitHub)
- **db/client.ts** — Prisma client with libSQL/better-sqlite3 adapter
- **prisma/schema.prisma** — `Room` model: id, size, toWin, creatorId (SQLite)

## Auth

SuperTokens (self-hosted or managed). EmailPassword enabled on both client/server. ThirdParty (Google, GitHub) configured on server, commented out on client.

## Configuration

| File                          | Purpose                                            |
| ----------------------------- | -------------------------------------------------- |
| `.oxlintrc.json`              | Oxlint config                                      |
| `.oxfmtrc.json`               | Oxfmt config (tabs, width 4, LF)                   |
| `Taskfile.yml`                | Dev task runner                                    |
| `client/components.json`      | shadcn UI config                                   |
| `client/vite.config.ts`       | Vite + React Compiler + TanStack Router + Tailwind |
| `server/prisma.config.ts`     | Prisma config                                      |
| `server/prisma/schema.prisma` | DB schema                                          |

## Key Dependencies

| Package                     | Version | Purpose                                    |
| --------------------------- | ------- | ------------------------------------------ |
| react                       | 19.x    | UI framework                               |
| vite                        | 8.x     | Bundler                                    |
| @tanstack/react-router      | 1.x     | File-based routing                         |
| @tanstack/react-form        | 1.x     | Settings form                              |
| @tanstack/react-query       | 5.x     | Server state (wired, not heavily used yet) |
| @emotion/styled             | 11.x    | Game board styling                         |
| tailwindcss                 | 4.x     | Utility CSS (shadcn components)            |
| supertokens-auth-react      | 0.51.x  | Client auth                                |
| fastify                     | 5.x     | Server framework                           |
| supertokens-node            | 24.x    | Server auth                                |
| prisma                      | 7.x     | ORM (SQLite via libSQL)                    |
| vitest                      | 4.x     | Test framework                             |
| typescript                  | 6.x     | Type checking                              |
| babel-plugin-react-compiler | 1.x     | React Compiler                             |

## Tests

- **2 test files**, 201 lines total
- `game/__tests__/game.test.ts` — Game logic (board creation, player switching, board fill)
- `game/strategies/__tests__/strategies.test.ts` — Win detection for both strategies
- Run: `bun run test` (vitest, watch mode) or `bunx vitest run <file>`

## Quick Start

1. `bun install`
2. `task server` (starts Fastify API)
3. `task client` (starts Vite dev server)
4. Tests: `bun run test`
5. Lint: `bun run lint` | Format: `bun run format`
