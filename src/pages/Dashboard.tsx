import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoryContext } from '../hooks/InventoryContext';
import { formatDimension, getSeasonLabel, getMovementTypeLabel, getStockStatus } from '../types';
import { ProductDrawer } from '../components/ProductDrawer';
import { MovementModal } from '../components/MovementModal';
import { ProductModal } from '../components/ProductModal';
import { useLayoutContext } from '../components/Layout';

export function Dashboard() {
    const navigate = useNavigate();
    const { products, getStats, getBelowThresholdProducts, getRecentMovements, getProduct } = useInventoryContext();
    const { openMovementModal } = useLayoutContext();

    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [showMovementModal, setShowMovementModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);

    const stats = getStats();
    const belowThreshold = getBelowThresholdProducts();
    const recentMovements = getRecentMovements(5);

    const selectedProduct = selectedProductId ? getProduct(selectedProductId) : null;

    // Empty state
    if (products.length === 0) {
        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">Dashboard</h1>
                </div>

                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <h3 className="empty-state-title">Aucune référence</h3>
                        <p className="empty-state-description">
                            Commencez par créer votre première référence de pneu.
                        </p>
                        <button className="btn-primary-full" onClick={() => setShowProductModal(true)}>
                            Créer une référence
                        </button>
                    </div>
                </div>

                {showProductModal && (
                    <ProductModal onClose={() => setShowProductModal(false)} />
                )}
            </div>
        );
    }

    return (
        <div>
            {/* New Movement Button */}
            <div className="py-2">
                <button className="btn-primary-full" onClick={openMovementModal}>
                    <span>➕</span>
                    <span>NOUVEAU MOUVEMENT</span>
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <p className="metric-label">Références</p>
                    <div className="flex items-center">
                        <span className="metric-value">{stats.totalReferences}</span>
                    </div>
                </div>

                <div className="metric-card">
                    <p className="metric-label">Stock total</p>
                    <div className="flex items-center">
                        <span className="metric-value primary">{stats.totalStock}</span>
                    </div>
                </div>

                <div className="metric-card danger">
                    <p className="metric-label">Ruptures</p>
                    <div className="flex items-center">
                        <span className="metric-value danger">{stats.outOfStock}</span>
                    </div>
                </div>

                <div className="metric-card warning">
                    <p className="metric-label">Sous seuil</p>
                    <div className="flex items-center">
                        <span className="metric-value warning">{stats.belowThreshold}</span>
                    </div>
                </div>
            </div>

            {/* Critical Alerts */}
            {belowThreshold.length > 0 && (
                <section className="section">
                    <div className="section-header">
                        <h3 className="section-title">⚠️ Alertes critiques</h3>
                        <button className="section-action" onClick={() => navigate('/search?filter=low')}>
                            Voir tout
                        </button>
                    </div>

                    <div className="alert-list">
                        {belowThreshold.slice(0, 5).map(product => {
                            const status = getStockStatus(product);
                            const available = product.qtyOnHand - product.qtyReserved;

                            return (
                                <div
                                    key={product.id}
                                    className="alert-item"
                                    onClick={() => setSelectedProductId(product.id)}
                                >
                                    <div className="alert-info">
                                        <span className="alert-title">{formatDimension(product)}</span>
                                        <span className="alert-subtitle">{product.brand} {product.model}</span>
                                    </div>
                                    <div className="alert-status">
                                        <div className="alert-stock">
                                            <span
                                                className="alert-stock-value"
                                                style={{ color: status === 'rupture' ? 'var(--color-danger)' : 'var(--color-warning)' }}
                                            >
                                                {available} unités
                                            </span>
                                            <span className="alert-stock-label">
                                                {status === 'rupture' ? 'Rupture' : 'Faible'}
                                            </span>
                                        </div>
                                        <span
                                            className="alert-icon"
                                            style={{ color: status === 'rupture' ? 'var(--color-danger)' : 'var(--color-warning)' }}
                                        >
                                            {status === 'rupture' ? '🚫' : '⚠️'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Recent Movements */}
            <section className="section">
                <div className="section-header">
                    <h3 className="section-title">📦 Mouvements récents</h3>
                    <button className="section-action" onClick={() => navigate('/movements')}>
                        Voir tout
                    </button>
                </div>

                {recentMovements.length === 0 ? (
                    <div className="card">
                        <div className="empty-state" style={{ padding: 'var(--spacing-lg)' }}>
                            <p className="text-muted">Aucun mouvement récent</p>
                        </div>
                    </div>
                ) : (
                    <div className="movement-list">
                        {recentMovements.map(m => {
                            const product = getProduct(m.productId);
                            const isIn = m.type === 'IN';
                            const isOut = m.type === 'OUT';

                            return (
                                <div key={m.id} className="movement-item">
                                    <div className={`movement-icon ${isIn ? 'in' : isOut ? 'out' : 'adjust'}`}>
                                        {isIn ? '↙️' : isOut ? '↗️' : '🔄'}
                                    </div>
                                    <div className="movement-content">
                                        <p className="movement-title">
                                            {getMovementTypeLabel(m.type)}: {product?.brand || 'N/A'}
                                        </p>
                                        <p className="movement-subtitle">
                                            {product ? formatDimension(product) : ''} • {Math.abs(m.quantity)} unités
                                        </p>
                                    </div>
                                    <div className="movement-time">
                                        {new Date(m.createdAt).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Product Drawer */}
            {selectedProduct && (
                <ProductDrawer
                    product={selectedProduct}
                    onClose={() => setSelectedProductId(null)}
                    onCreateMovement={() => {
                        setSelectedProductId(null);
                        setShowMovementModal(true);
                    }}
                />
            )}

            {/* Movement Modal */}
            {showMovementModal && (
                <MovementModal onClose={() => setShowMovementModal(false)} />
            )}
        </div>
    );
}
