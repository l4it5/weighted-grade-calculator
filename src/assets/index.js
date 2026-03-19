// Assets Index
// All assets are loaded globally via <script> tags in index.html
// Load order matters — index.html must load them in this order:
//
// 1. load-state.js   → loadState(), STORAGE_KEY
// 2. save-state.js   → saveState()
// 3. constants.js    → grades, gradeMidpoints
// 4. calculate.js    → calculateGrades(modules)
