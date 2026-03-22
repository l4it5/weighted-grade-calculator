# Weighted Grade Calculator

A browser-based tool for calculating weighted semester grades. Enter your final semester grade, configure your modules with their grade ranges and ECTS credits, and instantly find every valid combination of module grades that sums to your target.

---

## Features

- **Weighted grade calculation** — finds all module-grade combinations where `Σ(grade × ECTS) / 100 = final semester grade`
- **Grade range support** — each module is assigned a grade band (A–E), constraining the search to valid grade values
- **Paginated results table** — displays up to 1,000 combinations per page with Prev/Next navigation
- **Grade distribution chart** — bar chart (Chart.js) showing frequency of each grade value per module
- **Per-module grade filter** — click a module's colour swatch in the chart legend to open a dropdown; check/uncheck individual grade values to filter both the chart and the visible combination count
- **Frequency stats in filter dropdown** — each grade shows its total frequency across all combinations and its filtered sub-total (accounting for other modules' current selections)
- **State persistence** — all inputs, module data, and chart filter selections are saved to `localStorage` and auto-restored on reload; the calculation reruns automatically on page load
- **Export / Import** — download the current app state as a JSON file or upload a previously exported file to restore it
- **Responsive layout** — two-column layout on desktop (form left, chart + results right); single-column stacked layout on mobile (≤768px)

---

## How It Works

The calculator uses a recursive nested-loop approach to enumerate every possible grade combination across all modules:

```
for each module (outermost → innermost):
    for grade in [module.min .. module.max]:
        if last module:
            if Σ(grade × ECTS / 100) == finalGrade → record combination
        else:
            recurse into next module
```

The formula checked at the innermost level:

```
f(g1, g2, ..., gN) = g1×ECTS1/100 + g2×ECTS2/100 + ... + gN×ECTSN/100 = finalGrade
```

Grade bands map to integer ranges:

| Grade | Range   |
|-------|---------|
| A     | 90–100  |
| B     | 80–89   |
| C     | 70–79   |
| D     | 60–69   |
| E     | 50–59   |

---

## Project Structure

```
weighted-grade/
├── index.html                  ← entry point; loads all CSS and JS in order
├── CLAUDE.md                   ← project context for Claude Code
├── README.md
├── steps.md                    ← build log (user instructions → Claude executions)
└── src/
    ├── assets/
    │   ├── base.css            ← global reset + shared XP-style classes
    │   ├── constants.js        ← grades array (A–E with labels and values)
    │   ├── load-state.js       ← loadState() reads from localStorage
    │   ├── save-state.js       ← saveState() writes to localStorage
    │   └── calculate.js        ← calculateGradesAsync() — core algorithm
    └── components/
        ├── App.js              ← root component; state management, layout
        ├── App.css
        ├── ModuleRow.js        ← single module input row (prefix, ECTS, grade)
        ├── ModuleRow.css
        ├── ResultChart.js      ← Chart.js bar chart + filter legend
        └── ResultChart.css
```

---

## Tech Stack

| Technology | Version | How it's used |
|------------|---------|---------------|
| React | 18.3.1 | UI components (via CDN UMD build) |
| Babel Standalone | 6.26.0 | In-browser JSX transpilation |
| Chart.js | 4.4.0 | Grade distribution bar chart |
| Moment.js | 2.29.1 | Loaded as dependency |
| Vanilla JS / HTML / CSS | — | No bundler; all files loaded via `<script>` tags |

> **No build step required.** Open `index.html` directly in a browser or serve it with any static file server.

---

## Usage

### Running locally

```bash
# Any static server works, e.g.:
npx serve .
# or
python3 -m http.server
```

Then open `http://localhost:3000` (or whichever port) in your browser.

### Entering data

1. Set the **Final Grade of Semester** (0–100)
2. Select the **Number of Modules** (1–10)
3. For each module, enter:
   - **Prefix** — a short identifier (e.g. `CS101`)
   - **ECTS** — the standard credit weight of the module
   - **Grade** — the grade band assigned (A through E)
4. Click **Calculate Expected Grade**

### Reading results

- The **results table** lists every valid grade combination, numbered globally across pages
- The **chart** shows how frequently each grade value appears per module across all valid combinations
- Click a **colour swatch** in the chart legend to open the grade filter for that module
- **Total** column = frequency across all combinations; **Filtered** column = frequency after other modules' filters are applied

### Export / Import

- **Export** — downloads `weighted-grade-state.json` with your current inputs and filter selections
- **Import** — loads a previously exported JSON file and restores all fields

---

## Constraints & Notes

- **Babel 6 compatibility** — no optional chaining (`?.`), no nullish coalescing (`??`), `catch` blocks must have a parameter, no ES module syntax
- **No bundler** — script load order in `index.html` is significant; assets must load before components
- **localStorage limit** — only inputs and filter selections are persisted (not the results array, which can be very large); results are recalculated automatically on page load
- **Synchronous calculation** — the algorithm runs on the main thread; very large search spaces (many modules × wide grade ranges) will block briefly despite the async wrapper

---

## License

Private project. All rights reserved.