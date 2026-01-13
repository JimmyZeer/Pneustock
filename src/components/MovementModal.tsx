import { useState, useEffect } from 'react';
import { TireProduct, MovementType, MovementReason, formatDimension } from '../types';
import { useInventoryContext } from '../hooks/InventoryContext';
import { useToast } from '../hooks/useToast';
import { currentUser } from '../data/mockData';

interface MovementModalProps {
    onClose: () => void;
    prefillProduct?: TireProduct;
    prefillType?: MovementType;
}

const movementReasons: MovementReason[] = ['Vente', 'Montage', 'Correction', 'Retour', 'Réception', 'Autre'];

export function MovementModal({ onClose, prefillProduct, prefillType }: MovementModalProps) {
    const { products, createMovement } = useInventoryContext();
    const { showToast } = useToast();

    const [productId, setProductId] = useState(prefillProduct?.id || '');
    const [type, setType] = useState<MovementType>(prefillType || 'IN');
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState<MovementReason>('Réception');
    const [searchQuery, setSearchQuery] = useState('');
    const [showProductList, setShowProductList] = useState(false);

    // Filter products based on search
    const filteredProducts = products.filter(p => {
        if (!searchQuery) return true;
        const dim = formatDimension(p).toLowerCase();
        const search = searchQuery.toLowerCase();
        return dim.includes(search) ||
            p.brand.toLowerCase().includes(search) ||
            p.model.toLowerCase().includes(search);
    }).slice(0, 5);

    // Set default reason based on type
    useEffect(() => {
        if (type === 'IN') setReason('Réception');
        else if (type === 'OUT') setReason('Vente');
        else setReason('Correction');
    }, [type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId || quantity <= 0) return;

        try {
            await createMovement(
                productId,
                type,
                quantity,
                reason,
                currentUser.name,
            );
            showToast('Stock mis à jour ✓', 'success');
            onClose();
        } catch (err) {
            showToast('Erreur de sauvegarde', 'error');
        }
    };

    const selectedProduct = products.find(p => p.id === productId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Nouveau mouvement</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Product selection */}
                        <div className="form-group">
                            <label className="form-label">Référence</label>
                            {prefillProduct ? (
                                <div className="card" style={{ padding: 'var(--spacing-md)' }}>
                                    <p className="font-bold">{formatDimension(prefillProduct)}</p>
                                    <p className="text-sm text-muted">{prefillProduct.brand} {prefillProduct.model}</p>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowProductList(true);
                                        }}
                                        onFocus={() => setShowProductList(true)}
                                    />

                                    {showProductList && searchQuery && (
                                        <div className="card mt-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {filteredProducts.length === 0 ? (
                                                <div className="p-3 text-muted text-sm">Aucun résultat</div>
                                            ) : (
                                                filteredProducts.map(p => (
                                                    <div
                                                        key={p.id}
                                                        className="p-3"
                                                        style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setProductId(p.id);
                                                            setSearchQuery(`${formatDimension(p)} - ${p.brand}`);
                                                            setShowProductList(false);
                                                        }}
                                                    >
                                                        <p className="font-bold text-sm">{formatDimension(p)}</p>
                                                        <p className="text-xs text-muted">{p.brand} • Stock: {p.qtyOnHand}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {selectedProduct && !showProductList && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="badge badge-primary">✓</span>
                                            <span className="text-sm">{formatDimension(selectedProduct)} - {selectedProduct.brand}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Movement type */}
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <div className="tabs">
                                <button
                                    type="button"
                                    className={`tab ${type === 'IN' ? 'active' : ''}`}
                                    onClick={() => setType('IN')}
                                    disabled={!!prefillType}
                                >
                                    ↙️ Entrée
                                </button>
                                <button
                                    type="button"
                                    className={`tab ${type === 'OUT' ? 'active' : ''}`}
                                    onClick={() => setType('OUT')}
                                    disabled={!!prefillType}
                                >
                                    ↗️ Sortie
                                </button>
                                <button
                                    type="button"
                                    className={`tab ${type === 'ADJUST' ? 'active' : ''}`}
                                    onClick={() => setType('ADJUST')}
                                    disabled={!!prefillType}
                                >
                                    🔄 Ajust.
                                </button>
                            </div>
                        </div>

                        {/* Quantity - with numeric keyboard */}
                        <div className="form-group">
                            <label className="form-label">Quantité</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="form-input"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                style={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' }}
                            />
                        </div>

                        {/* Reason */}
                        <div className="form-group">
                            <label className="form-label">Motif</label>
                            <div className="filter-chips" style={{ flexWrap: 'wrap' }}>
                                {movementReasons.map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        className={`filter-chip ${reason === r ? 'active' : ''}`}
                                        onClick={() => setReason(r)}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="submit"
                            className="btn-primary-full"
                            disabled={!productId || quantity <= 0}
                        >
                            Confirmer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
