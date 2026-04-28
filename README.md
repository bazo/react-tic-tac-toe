# Tic Tac Toe

A configurable tic-tac-toe game built with React 19. Supports variable board sizes and a configurable number of consecutive marks needed to win.

## Demo

[Demo](https://react-tic-tac-toe-eta.vercel.app/)

## Getting Started

```sh
bun install
bun run dev
```

## Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `bun run dev`    | Start Vite dev server               |
| `bun run build`  | Type-check and build for production |
| `bun run test`   | Run tests in watch mode (Vitest)    |
| `bun run lint`   | Lint with oxlint                    |
| `bun run format` | Format with oxfmt                   |

## Architecture

### Overview

```
src/
├── main.tsx                         # App entry point
└── game/
    ├── game.tsx                     # Root Game component
    ├── use-game.tsx                 # Game state hook
    ├── functions.ts                 # Pure board utility functions
    ├── types.ts                     # Shared types and constants
    ├── __tests__/
    │   └── game.test.ts             # Tests for board utilities
    ├── components/
    │   ├── board.tsx                # Board grid rendering
    │   ├── game-panel.tsx           # Layout shell and global styles
    │   ├── player-symbol.tsx        # Current player indicator
    │   └── settings-form.tsx        # Board size / to-win config form
    └── strategies/
        ├── full-size-strategy.ts    # Classic NxN win detection
        ├── x-to-win-strategy.ts     # Consecutive-marks win detection
        └── __tests__/
            └── strategies.test.ts   # Tests for both strategies
```

### Data Flow

```
Game (game.tsx)
 │
 ├── useGame hook (use-game.tsx)
 │    ├── owns board state, current player, winner, draw, settings
 │    ├── creates board as flat array of length size²
 │    ├── instantiates win-check strategy from settings
 │    └── handles square clicks: place mark → check win → check draw → next player
 │
 ├── SettingsForm → updates settings → triggers board reset
 ├── Board → renders grid, highlights winning fields
 └── PlayerIndicator → shows whose turn it is
```

### Board Representation

The board is a flat array of length `size²`. A cell's row and column are derived from its index:

- **Row:** `Math.floor(index / size)`
- **Column:** `index % size`
- **Index from (row, col):** `row * size + column`

Each cell holds `Player.CROSS`, `Player.CIRCLE`, or `undefined` (empty).

### Win Detection Strategies

Win detection is pluggable via the `GameWinCheckStrategy` interface, which requires:

- `checkWin(boardState, currentPlayer, index)` — check if the last move at `index` wins
- `getWinningFields()` — return the winning cell indices for highlighting

Two implementations exist:

| Strategy             | Logic                                                                                          | Used by     |
| -------------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| **FullSizeStrategy** | Wins require filling an entire row, column, or diagonal (classic rules)                        | Tests only  |
| **XToWinStrategy**   | Wins require `toWin` consecutive marks in any direction (row, column, diagonal, anti-diagonal) | Active game |

Both check outward from the last-clicked cell rather than scanning the full board.

### Styling

- **Emotion** (`@emotion/styled`) for component-scoped styles
- **Global reset** via `emotion-reset` applied in `GamePanel`
- **Dark mode** supported via `prefers-color-scheme: dark` media query
- Board auto-sizes to fit the viewport on initial load (`calculateBoardSizeToFit`)

### Key Libraries

| Library              | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| React 19             | UI with React Compiler enabled via Babel plugin |
| Vite 8               | Dev server and bundler                          |
| Emotion              | CSS-in-JS styling                               |
| @tanstack/react-form | Settings form state management                  |
| Ramda                | Utility functions (`repeat`, `times`)           |
| Vitest               | Unit testing                                    |
| oxlint / oxfmt       | Linting and formatting (not ESLint/Prettier)    |
