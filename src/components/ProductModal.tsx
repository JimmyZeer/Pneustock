import { useState } from 'react';
import { TireProduct, Season } from '../types';
import { useInventoryContext } from '../hooks/InventoryContext';
import { useToast } from '../hooks/useToast';

interface ProductModalProps {
    onClose: () => void;
    editProduct?: TireProduct;
}

export function ProductModal({ onClose, editProduct }: ProductModalProps) {
    const { addProduct, updateProduct, settings } = useInventoryContext();
    const { showToast } = useToast();

    const [width, setWidth] = useState(editProduct?.width || 205);
    const [aspectRatio, setAspectRatio] = useState(editProduct?.aspectRatio || 55);
    const [rimDiameter, setRimDiameter] = useState(editProduct?.rimDiameter || 16);
    const [loadIndex, setLoadIndex] = useState(editProduct?.loadIndex || '91');
    const [speedIndex, setSpeedIndex] = useState(editProduct?.speedIndex || 'V');
    const [season, setSeason] = useState<Season>(editProduct?.season || 'summer');
    const [brand, setBrand] = useState(editProduct?.brand || '');
    const [model, setModel] = useState(editProduct?.model || '');
    const [location, setLocation] = useState(editProduct?.location || settings.locations[0] || '');
    const [qtyOnHand, setQtyOnHand] = useState(editProduct?.qtyOnHand || 0);
    const [reorderThreshold, setReorderThreshold] = useState(
        editProduct?.reorderThreshold || settings.defaultThreshold
    );

    const dimensionPreview = `${width}/${aspectRatio} R${rimDiameter} ${loadIndex}${speedIndex}`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!brand.trim() || !model.trim()) {
            showToast('Marque et modèle requis', 'error');
            return;
        }

        const productData = {
            width,
            aspectRatio,
            rimDiameter,
            loadIndex,
            speedIndex,
            season,
            brand: brand.trim(),
            model: model.trim(),
            location: location || undefined,
            reorderThreshold,
            qtyOnHand: editProduct ? editProduct.qtyOnHand : qtyOnHand,
            qtyReserved: editProduct?.qtyReserved || 0
        };

        if (editProduct) {
            updateProduct(editProduct.id, productData);
            showToast('Référence mise à jour ✓', 'success');
        } else {
            addProduct(productData);
            showToast('Référence créée ✓', 'success');
        }

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {editProduct ? 'Modifier' : 'Nouvelle référence'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Preview */}
                        <div className="callout callout-info mb-4">
                            <span>👁️</span>
                            <span><strong>{dimensionPreview}</strong></span>
                        </div>

                        {/* Dimension */}
                        <div className="form-group">
                            <label className="form-label">Dimension</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="form-input"
                                    value={width}
                                    onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                                    placeholder="205"
                                    min="135"
                                    max="335"
                                />
                                <input
                                    type="number"
                                    className="form-input"
                                    value={aspectRatio}
                                    onChange={(e) => setAspectRatio(parseInt(e.target.value) || 0)}
                                    placeholder="55"
                                    min="25"
                                    max="85"
                                />
                                <input
                                    type="number"
                                    className="form-input"
                                    value={rimDiameter}
                                    onChange={(e) => setRimDiameter(parseInt(e.target.value) || 0)}
                                    placeholder="16"
                                    min="12"
                                    max="24"
                                />
                            </div>
                        </div>

                        {/* Indices */}
                        <div className="form-group">
                            <label className="form-label">Indices</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="form-input"
                                    value={loadIndex}
                                    onChange={(e) => setLoadIndex(e.target.value)}
                                    placeholder="91"
                                    maxLength={3}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    value={speedIndex}
                                    onChange={(e) => setSpeedIndex(e.target.value.toUpperCase())}
                                    placeholder="V"
                                    maxLength={2}
                                />
                            </div>
                        </div>

                        {/* Season */}
                        <div className="form-group">
                            <label className="form-label">Saison</label>
                            <div className="tabs">
                                <button
                                    type="button"
                                    className={`tab ${season === 'summer' ? 'active' : ''}`}
                                    onClick={() => setSeason('summer')}
                                >
                                    ☀️ Été
                                </button>
                                <button
                                    type="button"
                                    className={`tab ${season === 'winter' ? 'active' : ''}`}
                                    onClick={() => setSeason('winter')}
                                >
                                    ❄️ Hiver
                                </button>
                                <button
                                    type="button"
                                    className={`tab ${season === 'allseason' ? 'active' : ''}`}
                                    onClick={() => setSeason('allseason')}
                                >
                                    🍂 4S
                                </button>
                            </div>
                        </div>

                        {/* Brand & Model */}
                        <div className="form-group">
                            <label className="form-label">Marque</label>
                            <input
                                type="text"
                                className="form-input"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder="Michelin, Continental..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Modèle</label>
                            <input
                                type="text"
                                className="form-input"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                placeholder="Primacy 4..."
                            />
                        </div>

                        {/* Stock */}
                        {!editProduct && (
                            <div className="form-group">
                                <label className="form-label">Stock initial</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={qtyOnHand}
                                    onChange={(e) => setQtyOnHand(parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>
                        )}

                        <div className="flex gap-2">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Seuil alerte</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={reorderThreshold}
                                    onChange={(e) => setReorderThreshold(parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Emplacement</label>
                                <select
                                    className="form-select"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="">—</option>
                                    {settings.locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="btn-primary-full">
                            {editProduct ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
