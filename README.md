# Tic Tac Toe

A configurable tic-tac-toe game with two modes:

- **Local** — two players on one screen, pure client-side, deployable as a static site.
- **Online multiplayer** — accounts, matchmaking, real-time play over WebSockets, persisted games.

Variable board size (3×3 to NxN) and configurable consecutive-marks-to-win make it more than the textbook version. The interesting part isn't the game — it's how the same game logic powers both a static SPA and an authoritative multiplayer server without forking the code.

## Demo

[react-tic-tac-toe-eta.vercel.app](https://react-tic-tac-toe-eta.vercel.app/) (local mode only — multiplayer needs the backend running)

## Why this exists

It started as a React Compiler / Vite 8 / oxlint sandbox — a small enough project to try a stack on without burning a weekend on incidental complexity. Then I wanted to see how cleanly I could bolt online multiplayer onto a finished SPA without the rewrite spiral those projects usually trigger. The constraints were:

- **Game logic stays pure and shared.** Win-detection runs identically on the client (for optimistic rendering) and the server (as the authority). One source of truth, zero duplication.
- **Local mode never regresses.** It must keep working without a backend, deployable as static files.
- **Server is authoritative.** The client is never trusted — every move is validated server-side. The optimistic client render is just UX.
- **Auth is real, not stubbed.** Email/password + OAuth (Google/GitHub), proper sessions, CSRF — outsourced to a battle-tested service rather than rolled by hand.

## Architecture

```
                                ┌──────────────────────────────────────┐
                                │  shared/                             │
                                │  ─ game/functions.ts                 │
                                │  ─ game/strategies/*                 │
                                │  ─ game/online.ts (next-state)       │
                                │  ─ schemas.ts (zod, shared protocol) │
                                └──────────────────────────────────────┘
                                  ▲                              ▲
                                  │ imported by both             │
                                  │                              │
                  ┌───────────────┴────────┐        ┌────────────┴──────────────┐
                  │  client/  (React 19)   │        │  server/  (Bun + Fastify) │
                  │                        │        │                           │
                  │  TanStack Router       │        │  REST: /api/games, /api/me│
                  │  TanStack Query        │ ◀─ZOD─▶│  WS:   /ws/:gameId        │
                  │  TanStack Form         │        │                           │
                  │  shadcn/ui + Tailwind  │        │  RoomManager: in-memory   │
                  │  SuperTokens client    │        │   pub/sub per gameId      │
                  │  use-game / use-online │        │  SuperTokens session auth │
                  └────────────────────────┘        │  Prisma → SQLite / Turso  │
                                                    └───────────────────────────┘
```

Three workspaces, one repo (Bun workspaces):

- **`shared/`** — pure TypeScript. Game logic, win-check strategies, the next-board-state function used by both sides, and zod schemas that double as the wire protocol. No DOM, no Node, no React.
- **`client/`** — React 19 SPA. Vite + React Compiler, TanStack Router for typed routes, TanStack Query for server state, TanStack Form for inputs, shadcn/ui on Tailwind v4. The local-mode hook (`use-game`) and online-mode hook (`use-online-game`) expose the same `GameHandlers` interface, so `Board` doesn't know which one is wired up.
- **`server/`** — Fastify on Bun. REST endpoints for game CRUD and the user profile, a WebSocket endpoint per game, and the `RoomManager` that fans state changes out to subscribers. SuperTokens (self-hosted core) handles sessions. Prisma is the ORM; the schema runs on SQLite locally and Turso (libSQL) in production.

### Key design decisions

**Shared game logic in a workspace, not duplicated.** The `XToWinStrategy` and `getNextBoardState` functions are imported by both the client (for optimistic rendering) and the server (for authoritative validation). This is the whole reason the workspace split exists — if I'd put the logic in `client/`, the server would have to either reimport across the workspace boundary anyway or fork. A single `shared/` package is the cleanest expression of "one source of truth."

**Strategy pattern for win detection.** `GameWinCheckStrategy` is an interface with two implementations (`FullSizeStrategy`, `XToWinStrategy`). Adding a new variant — Misère, Gomoku, Connect-4-style gravity — is a new file, not a rewrite. It also keeps `useGame` agnostic: the hook just calls `strategy.checkWin(...)`.

**Same `GameHandlers` interface for local and online.** `useGame` (local) and `useOnlineGame` (online) both return the same shape: a `Board` component, `onSquareClick`, current player, winner. The `Game` component switches between them based on mode without conditionals leaking into the UI. Adding a third mode (AI opponent) would slot in the same way.

**Server is authoritative; client renders optimistically.** When you click a cell, the client paints your mark immediately and sends `make_move` over WebSocket. The server validates against the persisted state, applies the move, and broadcasts `move_made` to both players. If validation fails, the server sends `error` and the client rolls back. This is the standard split — fast UI, no trust.

**Fastify + `@fastify/websocket`, not bare `Bun.serve()`.** The original plan was bare Bun WebSockets (see `MULTIPLAYER_PLAN.md`). I switched to Fastify because once auth, REST routes for game persistence, CORS, and zod-validated request bodies entered the picture, "300 lines of `Bun.serve()`" was going to become a hand-rolled router. Fastify is the proportionate choice; Bun is still the runtime.

**SuperTokens, not a hand-rolled auth.** Self-hosted, JWT-less session model with rotating refresh tokens, OAuth recipes for Google/GitHub. I'm not interested in being the person who got the password-reset flow wrong on a tic-tac-toe demo. The trade-off is one extra service in `docker-compose`; the upside is sleeping at night.

**Prisma + SQLite locally, Turso in production.** Same Prisma schema, two drivers. The `createDbConnection` factory in `db/client` picks the libSQL adapter when `TURSO_AUTH_TOKEN` is set. Local dev needs zero infra; production gets a managed, replicated SQLite without rewriting the data layer.

**Rooms in memory.** `RoomManager` is a `Map<gameId, Set<{ws, timestamp}>>`. No Redis. With a single-process deployment and games that are intrinsically two-player, the room state *is* the WebSocket connections — there's no second source of truth to coordinate. If the server restarts, clients reconnect and reload state from the DB. Old rooms are GC'd after one hour. If this ever needs to scale horizontally, the answer is sticky sessions or pub/sub at the edge — not a Redis rewrite of the in-memory map.

**Zod schemas as wire protocol.** `shared/schemas.ts` defines `CreateGameSchema`, `PlayerMoveSchema`, etc. The client uses them as TanStack Form validators; the server uses them as request body parsers. The types are derived from the same definition, so client and server can't drift.

### Trade-offs I accepted

- **In-memory rooms = single-instance.** Horizontal scaling needs sticky sessions. For a hobby demo this is correct sizing.
- **No spectator mode, no reconnection-with-replay.** A disconnected player loses their place in the live socket; rejoining loads the persisted state but missed broadcasts aren't replayed. Two-player turn-based games make this fine.
- **Auth depends on a separate SuperTokens core.** That's the point — but it does mean `docker-compose` has two services and a Postgres for SuperTokens itself.

## Project layout

```
.
├── shared/                  # game logic + zod schemas (no React, no Node)
│   ├── game/
│   │   ├── functions.ts
│   │   ├── online.ts        # next-state used by both sides
│   │   ├── strategies/
│   │   ├── use-game.tsx
│   │   └── types.ts
│   └── schemas.ts
├── client/                  # React 19 SPA
│   └── src/
├── server/                  # Fastify + Bun + Prisma
│   ├── server.ts
│   ├── room-manager.ts      # WebSocket room registry
│   ├── handlers/
│   ├── prisma/schema.prisma
│   └── env.ts               # @t3-oss/env-core + zod
├── Dockerfile               # 4-stage: deps → client build → prisma gen → runtime
└── Taskfile.yml
```

## Configuration

`server/env.ts` validates everything via `@t3-oss/env-core`:

| Var                            | Required | Purpose                                       |
| ------------------------------ | -------- | --------------------------------------------- |
| `API_HOST` / `API_PORT`        | no       | bind address (default `0.0.0.0:3001`)         |
| `WEBSITE_DOMAIN`               | no       | client origin (default `http://localhost:5173`)|
| `SUPERTOKENS_CONNECTION_URI`   | **yes**  | URL of the SuperTokens core service           |
| `SUPERTOKENS_API_KEY`          | no       | for authenticated cores                       |
| `GOOGLE_CLIENT_ID/SECRET`      | no       | OAuth                                         |
| `GITHUB_CLIENT_ID/SECRET`      | no       | OAuth                                         |
| `DATABASE_URL`                 | no       | Prisma connection (default `tic-tac-toe.db`)  |
| `TURSO_AUTH_TOKEN`             | no       | enables libSQL/Turso adapter when set         |

## Running locally

You'll need Bun and (optionally) [Task](https://taskfile.dev). For online multiplayer you also need a SuperTokens core (Docker is easiest).

```sh
bun install

# 1. start a SuperTokens core (only needed for online multiplayer)
docker run -p 3567:3567 registry.supertokens.io/supertokens/supertokens-postgresql

# 2. configure env
cp .env.example .env       # set SUPERTOKENS_CONNECTION_URI=http://localhost:3567

# 3. apply migrations
task migrate               # bun prisma migrate dev — creates tic-tac-toe.db

# 4. run server + client (separate terminals)
task server                # Fastify on :3001
task client                # Vite on :5173
```

Open `http://localhost:5173`. Local mode works without any backend; online mode needs steps 1–4.

### Local mode only (no backend)

The client builds and runs as a pure SPA — that's how the Vercel demo is deployed:

```sh
cd client && bun run dev
```

## Running with Docker

The image bundles client + server into one container. SuperTokens and (optionally) Postgres run alongside:

```sh
task docker:build
task docker:run            # binds :3001, persists ./data/tic-tac-toe.db
```

`task docker:run` runs:

```sh
docker run --rm -it --init \
  -p 3001:3001 \
  --env-file .env \
  -v $(pwd)/data:/app/data \
  -e DATABASE_URL=file:/app/data/tic-tac-toe.db \
  ghcr.io/<owner>/react-tic-tac-toe:latest
```

For a full stack including SuperTokens, a `docker-compose.yml` looks like:

```yaml
services:
  app:
    image: ghcr.io/<owner>/react-tic-tac-toe:latest
    ports: ["3001:3001"]
    environment:
      SUPERTOKENS_CONNECTION_URI: http://supertokens:3567
      WEBSITE_DOMAIN: http://localhost:3001
      DATABASE_URL: file:/app/data/tic-tac-toe.db
    volumes: ["./data:/app/data"]
    depends_on: [supertokens]

  supertokens:
    image: registry.supertokens.io/supertokens/supertokens-postgresql
    depends_on: [postgres]
    environment:
      POSTGRESQL_CONNECTION_URI: postgresql://supertokens:supertokens@postgres:5432/supertokens

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: supertokens
      POSTGRES_PASSWORD: supertokens
      POSTGRES_DB: supertokens
    volumes: ["./data/postgres:/var/lib/postgresql/data"]
```

Multi-arch publish:

```sh
task docker:push           # buildx, linux/amd64 + linux/arm64 → ghcr.io
```

The Dockerfile is four stages: shared deps install → client build (TanStack Router codegen + Vite) → Prisma client generation → runtime image (Bun alpine, runs `prisma migrate deploy` then `bun run server.ts`).

## Stack

**Shared:** TypeScript, zod, Ramda.
**Client:** React 19 (with React Compiler), Vite 8, TanStack Router/Query/Form, shadcn/ui, Tailwind v4, Emotion, SuperTokens web SDK.
**Server:** Bun, Fastify, `@fastify/websocket`, SuperTokens Node SDK, Prisma, SQLite/libSQL.
**Tooling:** Bun workspaces, oxlint/oxfmt, Vitest, Task, Docker buildx.
