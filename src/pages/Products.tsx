import { useState, useMemo } from 'react';
import { useInventoryContext } from '../hooks/InventoryContext';
import { TireProduct, Season, formatDimension, getSeasonLabel, getStockStatus } from '../types';
import { ProductModal } from '../components/ProductModal';

export function Products() {
    const { products, archiveProduct } = useInventoryContext();

    const [searchQuery, setSearchQuery] = useState('');
    const [seasonFilter, setSeasonFilter] = useState<Season | 'all'>('all');

    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState<TireProduct | undefined>(undefined);

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                formatDimension(p).toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.model.toLowerCase().includes(q)
            );
        }

        if (seasonFilter !== 'all') {
            result = result.filter(p => p.season === seasonFilter);
        }

        return result;
    }, [products, searchQuery, seasonFilter]);

    const handleEdit = (product: TireProduct) => {
        setEditProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditProduct(undefined);
    };

    return (
        <div>
            {/* Header */}
            <div className="page-header flex justify-between items-center">
                <h1 className="page-title">Références</h1>
                <button
                    className="badge badge-primary"
                    style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: '0.75rem' }}
                    onClick={() => setShowModal(true)}
                >
                    + Nouvelle
                </button>
            </div>

            {/* Search */}
            <div className="mb-3">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Chips */}
            <div className="filter-chips mb-3">
                <button
                    className={`filter-chip ${seasonFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setSeasonFilter('all')}
                >
                    Toutes
                </button>
                <button
                    className={`filter-chip ${seasonFilter === 'summer' ? 'active' : ''}`}
                    onClick={() => setSeasonFilter('summer')}
                >
                    ☀️ Été
                </button>
                <button
                    className={`filter-chip ${seasonFilter === 'winter' ? 'active' : ''}`}
                    onClick={() => setSeasonFilter('winter')}
                >
                    ❄️ Hiver
                </button>
                <button
                    className={`filter-chip ${seasonFilter === 'allseason' ? 'active' : ''}`}
                    onClick={() => setSeasonFilter('allseason')}
                >
                    🍂 4S
                </button>
            </div>

            {/* Products List */}
            {filteredProducts.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">🛞</div>
                        <h3 className="empty-state-title">Aucune référence</h3>
                        <p className="empty-state-description">
                            Créez votre première référence de pneu.
                        </p>
                        <button className="btn-primary-full" onClick={() => setShowModal(true)}>
                            Créer une référence
                        </button>
                    </div>
                </div>
            ) : (
                <div className="stock-list">
                    {filteredProducts.map(product => {
                        const status = getStockStatus(product);

                        return (
                            <div key={product.id} className="stock-item" onClick={() => handleEdit(product)}>
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
                                            {product.qtyOnHand}
                                        </p>
                                        <p className="stock-qty-label">stock</p>
                                    </div>
                                </div>

                                <div className="stock-item-footer">
                                    <span className={`stock-badge ${product.season}`}>
                                        {getSeasonLabel(product.season)}
                                    </span>
                                    <span className="stock-location">
                                        Seuil: {product.reorderThreshold}
                                    </span>
                                    {product.location && (
                                        <span className="stock-location">📍 {product.location}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Product Modal */}
            {showModal && (
                <ProductModal onClose={closeModal} editProduct={editProduct} />
            )}
        </div>
    );
}
