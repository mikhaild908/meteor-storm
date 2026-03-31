# Copilot Instructions

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) then production build
npm run lint      # ESLint on all .ts/.tsx files
npm run preview   # Serve production build locally
```

No test framework is configured.

## Architecture

This is a React + TypeScript browser game rendered on an HTML5 Canvas. React is used only for component structure and lifecycle management — all game rendering is imperative via the Canvas 2D API.

**Component tree:**
```
App.tsx          — holds config constants (canvas size, meteor count, tick rate)
└── GameCanvas.tsx   — owns the entire game loop, all entity refs, input handling
    └── GameOverLightbox.tsx  — modal shown on collision
```

**Game loop:** `setInterval` at `timerTick` ms (25ms default). The loop runs entirely outside React's render cycle. When the game ends, the interval is cleared and `setGameOver(true)` triggers the only React re-render.

**Dual state pattern:** React `useState` is used only for `gameOver` (controls modal visibility). Everything else — the rocket, meteors, score, timer ID — is stored in `useRef` so mutations don't trigger re-renders. This is intentional: game state must be readable inside the `setInterval` closure without stale values.

**Entity classes** (`Rocket.ts`, `Meteor.ts`, `ScoreBoard.ts`) are plain TypeScript classes. Each has a `move()` method responsible for calling `clearRect` on the old position, updating coordinates, then calling `drawImage` for the new position. They hold their own `HTMLImageElement` loaded in the constructor.

**Collision detection:** AABB overlap check (`rectsOverlap()` in `GameCanvas.tsx`) run every tick between the rocket and every meteor.

**Meteor respawn:** When a meteor exits the left edge, it is repositioned to the right edge at a random Y that doesn't overlap existing meteors (up to 20 attempts).

**Assets** (sprites, background) live in `public/` and are referenced by path string in entity constructors. The canvas is fixed at 640×480, defined as constants in `App.tsx`.

## Key Conventions

- **`.tsx`** for React components, **`.ts`** for game classes and types.
- Props are typed with an inline `type Props = { ... }` inside the component file — no interfaces for props.
- Union string literals for action types (see `ActionType.ts`), not enums.
- Named exports throughout; no default exports on components.
- CSS files are co-located with their component and imported directly (no CSS Modules, no CSS-in-JS).
- TypeScript strict mode is fully enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`). Keep zero `any` types.
- ESLint uses the v9 flat config format (`eslint.config.js`).

## Rendering Pattern

To move an entity on canvas:
1. `ctx.clearRect(entity.x, entity.y, entity.width, entity.height)` — erase old position
2. Update `entity.x` / `entity.y`
3. `ctx.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height)` — draw new position

Adding new rendered elements should follow this same pattern inside the entity's `move()` method or the game loop in `GameCanvas.tsx`.
