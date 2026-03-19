var STORAGE_KEY = 'weightedGradeState';

function loadState() {
    try {
        var saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
}
