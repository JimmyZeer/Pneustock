import { useState } from 'react';
import { useInventoryContext } from '../hooks/InventoryContext';
import { useToast } from '../hooks/useToast';

export function Documents() {
    const { documents, addDocument, updateDocStatus } = useInventoryContext();
    const { showToast } = useToast();

    const [showModal, setShowModal] = useState(false);
    const [supplierName, setSupplierName] = useState('');
    const [receivedAt, setReceivedAt] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierName.trim()) {
            showToast('Nom du fournisseur requis', 'error');
            return;
        }

        addDocument({
            supplierName: supplierName.trim(),
            receivedAt: new Date(receivedAt),
            note: note.trim() || undefined
        });

        showToast('Document ajouté', 'success');
        setSupplierName('');
        setNote('');
        setShowModal(false);
    };

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <h1 className="page-title">Documents</h1>
                <button
                    className="badge badge-primary"
                    style={{ padding: 'var(--spacing-sm) var(--spacing-md)', fontSize: '0.75rem' }}
                    onClick={() => setShowModal(true)}
                >
                    + Ajouter
                </button>
            </div>

            {/* Coming soon callout */}
            <div className="callout callout-info mb-4">
                <span>📋</span>
                <div>
                    <strong>Import Excel/CSV</strong>
                    <p className="text-sm" style={{ opacity: 0.8 }}>Bientôt disponible</p>
                </div>
            </div>

            {/* Documents list */}
            {documents.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📄</div>
                        <h3 className="empty-state-title">Aucun document</h3>
                        <p className="empty-state-description">
                            Ajoutez vos bons de livraison et factures.
                        </p>
                        <button className="btn-primary-full" onClick={() => setShowModal(true)}>
                            Ajouter un document
                        </button>
                    </div>
                </div>
            ) : (
                <div className="stock-list">
                    {documents.map(doc => (
                        <div key={doc.id} className="stock-item">
                            <div className="stock-item-header">
                                <div>
                                    <p className="stock-dimension">{doc.supplierName}</p>
                                    <p className="stock-brand">
                                        {new Date(doc.receivedAt).toLocaleDateString('fr-FR')}
                                        {doc.note && ` • ${doc.note}`}
                                    </p>
                                </div>
                                <span className={`badge ${doc.status === 'processed' ? 'badge-success' : 'badge-warning'}`}>
                                    {doc.status === 'processed' ? 'Traité' : 'En attente'}
                                </span>
                            </div>

                            {doc.status === 'pending' && (
                                <div className="stock-actions">
                                    <button
                                        className="stock-action-btn in"
                                        onClick={() => {
                                            updateDocStatus(doc.id, 'processed');
                                            showToast('Document traité', 'success');
                                        }}
                                    >
                                        ✓ Marquer traité
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Document Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Nouveau document</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Fournisseur</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Michelin, Continental..."
                                        value={supplierName}
                                        onChange={(e) => setSupplierName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={receivedAt}
                                        onChange={(e) => setReceivedAt(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Note</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="BL, facture..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn-primary-full">
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
