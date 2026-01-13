import { useState, useMemo } from 'react';
import { useInventoryContext } from '../hooks/InventoryContext';
import { MovementType, formatDimension, getMovementTypeLabel } from '../types';
import { MovementModal } from '../components/MovementModal';
import { SwipeableItem } from '../components/SwipeableItem';
import { useLayoutContext } from '../components/Layout';
import { haptic } from '../utils/mobile';
import { useToast } from '../hooks/useToast';

export function Movements() {
    const { movements, getProduct, deleteMovement } = useInventoryContext();
    const { showToast } = useToast();

    const [typeFilter, setTypeFilter] = useState<MovementType | 'all'>('all');
    const [showModal, setShowModal] = useState(false);

    // Filter movements
    const filteredMovements = useMemo(() => {
        let result = [...movements].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (typeFilter !== 'all') {
            result = result.filter(m => m.type === typeFilter);
        }

        return result;
    }, [movements, typeFilter]);

    const handleDeleteMovement = (id: string) => {
        if (deleteMovement) {
            deleteMovement(id);
            showToast('Mouvement supprimé', 'success');
            haptic('success');
        }
    };

    return (
        <div className="page-enter">
            {/* Header */}
            <div className="page-header flex justify-between items-center">
                <h1 className="page-title">Mouvements</h1>
                <button
                    className="badge badge-primary"
                    style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: '0.75rem' }}
                    onClick={() => { setShowModal(true); haptic('medium'); }}
                >
                    + Nouveau
                </button>
            </div>

            {/* Filter Chips */}
            <div className="filter-chips mb-3">
                <button
                    className={`filter-chip ${typeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => { setTypeFilter('all'); haptic('light'); }}
                >
                    Tous
                </button>
                <button
                    className={`filter-chip ${typeFilter === 'IN' ? 'active' : ''}`}
                    onClick={() => { setTypeFilter('IN'); haptic('light'); }}
                >
                    ↙️ Entrées
                </button>
                <button
                    className={`filter-chip ${typeFilter === 'OUT' ? 'active' : ''}`}
                    onClick={() => { setTypeFilter('OUT'); haptic('light'); }}
                >
                    ↗️ Sorties
                </button>
                <button
                    className={`filter-chip ${typeFilter === 'ADJUST' ? 'active' : ''}`}
                    onClick={() => { setTypeFilter('ADJUST'); haptic('light'); }}
                >
                    🔄 Ajustements
                </button>
            </div>

            {/* Movements List */}
            {filteredMovements.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <h3 className="empty-state-title">Aucun mouvement</h3>
                        <p className="empty-state-description">
                            Créez votre premier mouvement de stock.
                        </p>
                        <button className="btn-primary-full" onClick={() => setShowModal(true)}>
                            Créer un mouvement
                        </button>
                    </div>
                </div>
            ) : (
                <div className="movement-list">
                    {filteredMovements.map((movement, index) => {
                        const product = getProduct(movement.productId);
                        const isIn = movement.type === 'IN';
                        const isOut = movement.type === 'OUT';

                        return (
                            <SwipeableItem
                                key={movement.id}
                                onDelete={() => handleDeleteMovement(movement.id)}
                                deleteLabel="Supprimer"
                            >
                                <div
                                    className="movement-item list-item-enter stagger-item"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className={`movement-icon ${isIn ? 'in' : isOut ? 'out' : 'adjust'}`}>
                                        {isIn ? '↙️' : isOut ? '↗️' : '🔄'}
                                    </div>
                                    <div className="movement-content">
                                        <p className="movement-title">
                                            {getMovementTypeLabel(movement.type)}: {product?.brand || 'N/A'}
                                        </p>
                                        <p className="movement-subtitle">
                                            {product ? formatDimension(product) : 'Produit supprimé'} • {Math.abs(movement.quantity)} unités
                                        </p>
                                        <p className="movement-subtitle">
                                            {movement.reason} {movement.note && `• ${movement.note}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="movement-time">
                                            {new Date(movement.createdAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit'
                                            })}
                                        </p>
                                        <p className="movement-time">{movement.userName}</p>
                                    </div>
                                </div>
                            </SwipeableItem>
                        );
                    })}
                </div>
            )}

            {/* Movement Modal */}
            {showModal && (
                <MovementModal onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}
