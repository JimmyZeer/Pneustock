import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInventoryContext } from '../hooks/InventoryContext';
import { TireProduct, Season, formatDimension, getSeasonLabel, getStockStatus } from '../types';
import { ProductDrawer } from '../components/ProductDrawer';
import { MovementModal } from '../components/MovementModal';
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory, clearSearchHistory, haptic } from '../utils/mobile';

// Parse flexible search input - case insensitive, supports many formats
function parseSearchQuery(query: string): {
    width?: number;
    aspectRatio?: number;
    diameter?: number;
    text?: string;
    partialDimension?: boolean;
} {
    // Normalize: lowercase, remove extra spaces
    const cleaned = query.trim().toLowerCase().replace(/\s+/g, ' ');

    // Pattern 1: Full dimension like "205/55 R16", "205/55R16", "205 / 55 R 16"
    const pattern1 = /(\d{3})\s*\/?\s*(\d{2})\s*r?\s*(\d{2})/i;

    // Pattern 2: Space-separated "205 55 16"
    const pattern2 = /^(\d{3})\s+(\d{2})\s+(\d{2})$/;

    // Pattern 3: Concatenated "2055516"
    const pattern3 = /^(\d{3})(\d{2})(\d{2})$/;

    // Pattern 4: Partial - just width "205"
    const patternWidth = /^(\d{3})$/;

    // Pattern 5: Partial - width and aspect "205 55" or "205/55"
    const patternPartial = /^(\d{3})\s*\/?\s*(\d{2})$/;

    let match = cleaned.match(pattern1);
    if (match) {
        return { width: parseInt(match[1]), aspectRatio: parseInt(match[2]), diameter: parseInt(match[3]) };
    }

    match = cleaned.match(pattern2);
    if (match) {
        return { width: parseInt(match[1]), aspectRatio: parseInt(match[2]), diameter: parseInt(match[3]) };
    }

    match = cleaned.match(pattern3);
    if (match) {
        return { width: parseInt(match[1]), aspectRatio: parseInt(match[2]), diameter: parseInt(match[3]) };
    }

    // Partial dimension matches
    match = cleaned.match(patternPartial);
    if (match) {
        return { width: parseInt(match[1]), aspectRatio: parseInt(match[2]), partialDimension: true };
    }

    match = cleaned.match(patternWidth);
    if (match) {
        return { width: parseInt(match[1]), partialDimension: true };
    }

    // Text search (brand, model, etc.) - already lowercase
    return { text: cleaned };
}

export function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, getProduct } = useInventoryContext();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [seasonFilter, setSeasonFilter] = useState<Season | 'all'>('all');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [movementModal, setMovementModal] = useState<{ product: TireProduct; type: 'IN' | 'OUT' } | null>(null);

    // Load search history
    useEffect(() => {
        setSearchHistory(getSearchHistory());
    }, []);

    // Update URL when searching
    useEffect(() => {
        if (searchQuery) {
            setSearchParams({ q: searchQuery });
        } else {
            setSearchParams({});
        }
    }, [searchQuery, setSearchParams]);

    // Handle search submit
    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            addToSearchHistory(searchQuery.trim());
            setSearchHistory(getSearchHistory());
            setShowHistory(false);
            haptic('light');
        }
    };

    // Handle history item click
    const handleHistoryClick = (query: string) => {
        setSearchQuery(query);
        setShowHistory(false);
        haptic('light');
    };

    // Handle remove from history
    const handleRemoveHistory = (query: string, e: React.MouseEvent) => {
        e.stopPropagation();
        removeFromSearchHistory(query);
        setSearchHistory(getSearchHistory());
        haptic('light');
    };

    // Handle clear all history
    const handleClearHistory = () => {
        clearSearchHistory();
        setSearchHistory([]);
        haptic('medium');
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery) {
            const parsed = parseSearchQuery(searchQuery);

            if (parsed.width || parsed.aspectRatio || parsed.diameter) {
                result = result.filter(p => {
                    if (parsed.width && p.width !== parsed.width) return false;
                    if (parsed.aspectRatio && p.aspectRatio !== parsed.aspectRatio) return false;
                    if (parsed.diameter && p.rimDiameter !== parsed.diameter) return false;
                    return true;
                });
            } else if (parsed.text) {
                result = result.filter(p =>
                    p.brand.toLowerCase().includes(parsed.text!) ||
                    p.model.toLowerCase().includes(parsed.text!) ||
                    formatDimension(p).toLowerCase().includes(parsed.text!)
                );
            }
        }

        if (seasonFilter !== 'all') {
            result = result.filter(p => p.season === seasonFilter);
        }

        if (availableOnly) {
            result = result.filter(p => (p.qtyOnHand - p.qtyReserved) > 0);
        }

        if (searchParams.get('filter') === 'low') {
            result = result.filter(p => p.qtyOnHand <= p.reorderThreshold);
        }

        return result;
    }, [products, searchQuery, seasonFilter, availableOnly, searchParams]);

    const selectedProduct = selectedProductId ? getProduct(selectedProductId) : null;

    return (
        <div className="page-enter">
            {/* Search Input */}
            <div className="py-2">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Rechercher (ex: 205 55 16, Michelin...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowHistory(true)}
                        onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    />
                </div>

                {/* Search History Dropdown */}
                {showHistory && searchHistory.length > 0 && !searchQuery && (
                    <div className="search-history">
                        <div className="search-history-header">
                            <span className="search-history-title">Recherches récentes</span>
                            <button className="search-history-clear" onClick={handleClearHistory}>
                                Effacer
                            </button>
                        </div>
                        {searchHistory.slice(0, 5).map((query, i) => (
                            <div
                                key={i}
                                className="search-history-item"
                                onClick={() => handleHistoryClick(query)}
                            >
                                <span className="search-history-icon">🕐</span>
                                <span className="search-history-text">{query}</span>
                                <button
                                    className="search-history-remove"
                                    onClick={(e) => handleRemoveHistory(query, e)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Chips */}
            <div className="filter-chips">
                <button
                    className={`filter-chip ${seasonFilter === 'all' ? 'active' : ''}`}
                    onClick={() => { setSeasonFilter('all'); haptic('light'); }}
                >
                    Toutes
                </button>
                <button
                    className={`filter-chip ${seasonFilter === 'summer' ? 'active' : ''}`}
                    onClick={() => { setSeasonFilter('summer'); haptic('light'); }}
                >
                    ☀️ Été
                </button>
                <button
                    className={`filter-chip ${seasonFilter === 'winter' ? 'active' : ''}`}
                    onClick={() => { setSeasonFilter('winter'); haptic('light'); }}
                >
                    ❄️ Hiver
                </button>
                <button
                    className={`filter-chip ${seasonFilter === 'allseason' ? 'active' : ''}`}
                    onClick={() => { setSeasonFilter('allseason'); haptic('light'); }}
                >
                    🍂 4S
                </button>
                <button
                    className={`filter-chip ${availableOnly ? 'active' : ''}`}
                    onClick={() => { setAvailableOnly(!availableOnly); haptic('light'); }}
                >
                    En stock
                </button>
            </div>

            {/* Results count */}
            <p className="text-sm text-muted mb-3">
                {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
            </p>

            {/* Results */}
            {filteredProducts.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3 className="empty-state-title">Aucun résultat</h3>
                        <p className="empty-state-description">
                            Modifiez vos critères de recherche
                        </p>
                    </div>
                </div>
            ) : (
                <div className="stock-list">
                    {filteredProducts.map((product, index) => {
                        const status = getStockStatus(product);
                        const available = product.qtyOnHand - product.qtyReserved;

                        return (
                            <div
                                key={product.id}
                                className="stock-item list-item-enter stagger-item"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="stock-item-header">
                                    <div>
                                        <p className="stock-dimension">{formatDimension(product)}</p>
                                        <p className="stock-brand">{product.brand} {product.model}</p>
                                    </div>
                                    <div className="stock-qty">
                                        <p
                                            className="stock-qty-value"
                                            style={{
                                                color: status === 'rupture' ? 'var(--color-danger)' :
                                                    status === 'faible' ? 'var(--color-warning)' : 'inherit'
                                            }}
                                        >
                                            {available}
                                        </p>
                                        <p className="stock-qty-label">unités</p>
                                    </div>
                                </div>

                                <div className="stock-item-footer">
                                    <span className={`stock-badge ${product.season}`}>
                                        {getSeasonLabel(product.season)}
                                    </span>
                                    <span className={`stock-badge ${status === 'ok' ? 'ok' : status === 'faible' ? 'low' : 'out'}`}>
                                        {status === 'ok' ? 'En stock' : status === 'faible' ? 'Faible' : 'Rupture'}
                                    </span>
                                    {product.location && (
                                        <span className="stock-location">📍 {product.location}</span>
                                    )}
                                </div>

                                <div className="stock-actions">
                                    <button
                                        className="stock-action-btn out"
                                        onClick={() => { setMovementModal({ product, type: 'OUT' }); haptic('medium'); }}
                                        disabled={available <= 0}
                                    >
                                        ↗️ Sortie
                                    </button>
                                    <button
                                        className="stock-action-btn in"
                                        onClick={() => { setMovementModal({ product, type: 'IN' }); haptic('medium'); }}
                                    >
                                        ↙️ Entrée
                                    </button>
                                    <button
                                        className="stock-action-btn details"
                                        onClick={() => { setSelectedProductId(product.id); haptic('light'); }}
                                    >
                                        👁️ Détails
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Product Drawer */}
            {selectedProduct && (
                <ProductDrawer
                    product={selectedProduct}
                    onClose={() => setSelectedProductId(null)}
                    onCreateMovement={() => {
                        const p = selectedProduct;
                        setSelectedProductId(null);
                        setMovementModal({ product: p, type: 'OUT' });
                    }}
                />
            )}

            {/* Movement Modal */}
            {movementModal && (
                <MovementModal
                    onClose={() => setMovementModal(null)}
                    prefillProduct={movementModal.product}
                    prefillType={movementModal.type}
                />
            )}
        </div>
    );
}
