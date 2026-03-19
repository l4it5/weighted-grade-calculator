function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
