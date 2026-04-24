# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `bun run dev` (Vite)
- **Build:** `bun run build` (tsc + vite build)
- **Test all:** `bun run test` (vitest, runs in watch mode)
- **Test single file:** `bunx vitest run src/game/__tests__/game.test.ts`
- **Lint:** `bun run lint` (oxlint)
- **Format:** `bun run format` (oxfmt)

## Tooling

- **Runtime/package manager:** Bun (bun.lock)
- **Bundler:** Vite 8 with React Compiler via `@rolldown/plugin-babel` + `babel-plugin-react-compiler`
- **Linter:** oxlint (not ESLint) — config in `.oxlintrc.json`
- **Formatter:** oxfmt — config in `.oxfmtrc.json` (tabs, tab width 4, LF line endings)
- **Test framework:** Vitest
- **TypeScript:** 6.x, target es2023, `verbatimModuleSyntax` enabled (use `type` keyword for type-only imports)

## Architecture

Single-feature React 19 app — a configurable tic-tac-toe game with variable board size and "X-to-win" setting.

All game code lives under `src/game/`. Entry point is `src/main.tsx` → `Game` component.

### Core pattern: Strategy-based win detection

The `GameWinCheckStrategy` interface (`types.ts`) defines a pluggable win-checking algorithm. Two implementations exist:

- **`FullSizeStrategy`** — wins require filling an entire row/column/diagonal (classic NxN rules). Not currently used by the game but tested.
- **`XToWinStrategy`** — wins require `toWin` consecutive marks in any direction. This is the active strategy, instantiated in `use-game.tsx` based on settings.

Both strategies check from the last-clicked index outward (row, column, diagonal, anti-diagonal).

### State management

`useGame` hook owns all game state (board, current player, winner, draw, settings). It returns a bound `Board` component and control functions. No external state library — pure React hooks.

### Styling

Emotion (`@emotion/styled` + `@emotion/react`) with `styled` components. Global reset via `emotion-reset` in `GamePanel`. Dark mode via `prefers-color-scheme` media query.

### Forms

Settings form uses `@tanstack/react-form`. The "to win" field max is dynamically bound to the board size.

### Conventions

- **File naming:** kebab-case for all files
- **Exports:** components use both named export and default export
- **Types:** const object + derived type pattern (e.g., `Player` is both a const object and a type)
- **Board representation:** flat array of length `size²`, indexed as `row * size + column`
