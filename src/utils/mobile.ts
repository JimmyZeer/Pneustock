// Haptic feedback utility for mobile devices
export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
    if (!navigator.vibrate) return;

    const patterns: Record<string, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        warning: [20, 30, 20],
        error: [50, 30, 50, 30, 50]
    };

    navigator.vibrate(patterns[type]);
}

// Search history management
const SEARCH_HISTORY_KEY = 'pneustock_search_history';
const MAX_HISTORY_ITEMS = 10;

export function getSearchHistory(): string[] {
    try {
        const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function addToSearchHistory(query: string): void {
    if (!query.trim()) return;

    const history = getSearchHistory();
    const normalized = query.trim().toLowerCase();

    // Remove if already exists (to move to top)
    const filtered = history.filter(h => h.toLowerCase() !== normalized);

    // Add to beginning
    filtered.unshift(query.trim());

    // Keep only max items
    const limited = filtered.slice(0, MAX_HISTORY_ITEMS);

    try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limited));
    } catch {
        // Storage full or unavailable
    }
}

export function clearSearchHistory(): void {
    try {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {
        // Storage unavailable
    }
}

export function removeFromSearchHistory(query: string): void {
    const history = getSearchHistory();
    const filtered = history.filter(h => h !== query);
    try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered));
    } catch {
        // Storage unavailable
    }
}
