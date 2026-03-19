# CLAUDE.md — Project Context for Claude Code

## Project Overview
- **Name:** Weighted Grade Calculator
- **Purpose:** A browser-based tool to calculate weighted grades per semester. The user inputs a final semester grade, selects the number of modules, and fills in each module's prefix, grade (A–E), and ECTS credits. Total ECTS is calculated automatically.
- **Stack:** Vanilla HTML + React 18 (via CDN) + Babel 6 Standalone (no bundler)

## Important Constraints
- **Babel version is 6.26.0** — do NOT use modern JS syntax that Babel 6 doesn't support:
  - No optional chaining `?.`
  - No nullish coalescing `??`
  - No `catch` without a parameter (use `catch (e)`)
  - No ES module `import`/`export` (no bundler available)
- **No bundler** — files are loaded via `<script type="text/babel" src="...">` tags in order. All variables are global.
- **Script load order matters** — assets must load before components. See `assets/index.js`.

## Project Structure
```
weighted-grade/
├── CLAUDE.md
├── steps.md              ← user writes instructions here, Claude executes them
└── src/
    ├── index.html        ← entry point, loads all CSS and JS in order
    ├── assets/
    │   ├── index.js      ← documents load order (no real exports)
    │   ├── base.css      ← shared XP-style classes (xp-input, xp-label, xp-fieldset)
    │   ├── constants.js  ← grades array
    │   ├── load-state.js ← loadState() + STORAGE_KEY
    │   ├── save-state.js ← saveState()
    │   └── calculate.js  ← calculateGrades(modules), gradeMidpoints
    └── components/
        ├── App.js        ← main component, mounts React
        ├── App.css
        ├── ModuleRow.js  ← renders one module row (prefix, grade, Standard ECTS)
        ├── ModuleRow.css
        ├── MathBox.js      ← (removed in step 15, file kept but not loaded)
        ├── MathBox.css     ← (removed in step 15, file kept but not loaded)
        ├── ResultChart.js  ← bar chart showing grade frequency per module (Chart.js)
        └── ResultChart.css
```

## Conventions
- **Font:** monospace everywhere (set globally in `base.css`)
- **Styling:** CSS classes only — no inline styles in JSX
- **CSS location:** each component has its own `.css` file in `components/`
- **Shared styles:** go in `assets/base.css`
- **State persistence:** `localStorage` via `loadState()` / `saveState()` in assets
- **Grade calculation:** `calculateTotalEctsOfGrades()` computes `Σ(grade × ects / 100)`. `calculateGrades()` uses recursive looping (equivalent to nested for loops) to find all combinations where the total equals finalGrade. Results are objects `{ grade, ects, index }`. App paginates at 1000 per page with Prev/Next buttons.
- **var over const/let** in `.js` asset files to avoid Babel 6 scoping issues
- **One component per file** in `components/`

## How We Work
- User writes steps in `steps.md`, Claude reads and executes them
- CLAUDE.md must be kept up to date after each meaningful step
- Ask user before choosing an approach that has multiple options (e.g. storage method)
