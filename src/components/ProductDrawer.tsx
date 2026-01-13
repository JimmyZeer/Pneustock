import { TireProduct, formatDimension, getStockStatus, getSeasonLabel, StockMovement, getMovementTypeLabel } from '../types';
import { useInventoryContext } from '../hooks/InventoryContext';

interface ProductDrawerProps {
    product: TireProduct;
    onClose: () => void;
    onCreateMovement: () => void;
}

export function ProductDrawer({ product, onClose, onCreateMovement }: ProductDrawerProps) {
    const { getMovementsForProduct, getProduct } = useInventoryContext();

    const currentProduct = getProduct(product.id) || product;
    const recentMovements = getMovementsForProduct(currentProduct.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3);

    const stockStatus = getStockStatus(currentProduct);
    const available = currentProduct.qtyOnHand - currentProduct.qtyReserved;

    return (
        <>
            <div className="drawer-overlay" onClick={onClose} />
            <div className="drawer">
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{formatDimension(currentProduct)}</h2>
                        <p className="text-sm text-muted">{currentProduct.brand} {currentProduct.model}</p>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {/* Stock display */}
                    <div className="card mb-4" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                        <p className="text-sm text-muted mb-1">Stock disponible</p>
                        <p
                            className="text-3xl font-bold"
                            style={{
                                color: stockStatus === 'rupture' ? 'var(--color-danger)' :
                                    stockStatus === 'faible' ? 'var(--color-warning)' : 'inherit'
                            }}
                        >
                            {available}
                        </p>
                        {currentProduct.qtyReserved > 0 && (
                            <p className="text-sm text-muted">({currentProduct.qtyReserved} réservé)</p>
                        )}
                        <div className="mt-2">
                            <span className={`badge ${stockStatus === 'ok' ? 'badge-success' : stockStatus === 'faible' ? 'badge-warning' : 'badge-danger'}`}>
                                {stockStatus === 'ok' ? 'En stock' : stockStatus === 'faible' ? 'Faible' : 'Rupture'}
                            </span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="settings-section mb-4">
                        <div className="settings-item">
                            <span className="text-muted">Saison</span>
                            <span className={`badge badge-${currentProduct.season === 'summer' ? 'warning' : currentProduct.season === 'winter' ? 'primary' : 'success'}`}>
                                {getSeasonLabel(currentProduct.season)}
                            </span>
                        </div>
                        <div className="settings-item">
                            <span className="text-muted">Indices</span>
                            <span>{currentProduct.loadIndex}{currentProduct.speedIndex}</span>
                        </div>
                        <div className="settings-item">
                            <span className="text-muted">Emplacement</span>
                            <span>{currentProduct.location || '—'}</span>
                        </div>
                        <div className="settings-item">
                            <span className="text-muted">Seuil alerte</span>
                            <span>{currentProduct.reorderThreshold}</span>
                        </div>
                    </div>

                    {/* Recent movements */}
                    <div className="section">
                        <h3 className="section-title mb-3">Derniers mouvements</h3>

                        {recentMovements.length === 0 ? (
                            <p className="text-sm text-muted">Aucun mouvement</p>
                        ) : (
                            <div className="movement-list">
                                {recentMovements.map(m => (
                                    <MovementItem key={m.id} movement={m} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-primary-full" onClick={onCreateMovement}>
                        Créer un mouvement
                    </button>
                </div>
            </div>
        </>
    );
}

function MovementItem({ movement }: { movement: StockMovement }) {
    const isIn = movement.type === 'IN';
    const isOut = movement.type === 'OUT';

    return (
        <div className="movement-item">
            <div className={`movement-icon ${isIn ? 'in' : isOut ? 'out' : 'adjust'}`}>
                {isIn ? '↙️' : isOut ? '↗️' : '🔄'}
            </div>
            <div className="movement-content">
                <p className="movement-title">{getMovementTypeLabel(movement.type)}</p>
                <p className="movement-subtitle">{Math.abs(movement.quantity)} unités</p>
            </div>
            <span className="movement-time">
                {new Date(movement.createdAt).toLocaleDateString('fr-FR')}
            </span>
        </div>
    );
}
