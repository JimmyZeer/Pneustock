import { useState } from 'react';
import { useInventoryContext } from '../hooks/InventoryContext';
import { useToast } from '../hooks/useToast';
import { mockUsers } from '../data/mockData';

export function Settings() {
    const { settings, updateSettings, addLocation, removeLocation } = useInventoryContext();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<'profile' | 'locations' | 'users'>('profile');

    // Profile
    const [garageName, setGarageName] = useState(settings.name);
    const [address, setAddress] = useState(settings.address);

    // Locations
    const [newLocation, setNewLocation] = useState('');

    // Default threshold
    const [defaultThreshold, setDefaultThreshold] = useState(settings.defaultThreshold);

    const handleSaveProfile = () => {
        updateSettings({ name: garageName.trim(), address: address.trim(), defaultThreshold });
        showToast('Paramètres enregistrés', 'success');
    };

    const handleAddLocation = () => {
        if (!newLocation.trim()) return;
        if (settings.locations.includes(newLocation.trim())) {
            showToast('Cet emplacement existe déjà', 'error');
            return;
        }
        addLocation(newLocation.trim());
        setNewLocation('');
        showToast('Emplacement ajouté', 'success');
    };

    const handleRemoveLocation = (location: string) => {
        removeLocation(location);
        showToast('Emplacement supprimé', 'success');
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Réglages</h1>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profil
                </button>
                <button
                    className={`tab ${activeTab === 'locations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('locations')}
                >
                    Emplacements
                </button>
                <button
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Équipe
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="settings-section">
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label">Nom du garage</label>
                            <input
                                type="text"
                                className="form-input"
                                value={garageName}
                                onChange={(e) => setGarageName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Adresse</label>
                            <input
                                type="text"
                                className="form-input"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Seuil d'alerte par défaut</label>
                            <input
                                type="number"
                                className="form-input"
                                min="0"
                                value={defaultThreshold}
                                onChange={(e) => setDefaultThreshold(parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <button className="btn-primary-full mt-3" onClick={handleSaveProfile}>
                            Enregistrer
                        </button>
                    </div>
                </div>
            )}

            {/* Locations Tab */}
            {activeTab === 'locations' && (
                <div>
                    <div className="settings-section">
                        <div className="card-body">
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nouvel emplacement (ex: D-01)"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
                                />
                                <button
                                    className="badge badge-primary"
                                    style={{ padding: 'var(--spacing-sm) var(--spacing-md)', whiteSpace: 'nowrap' }}
                                    onClick={handleAddLocation}
                                >
                                    + Ajouter
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        {settings.locations.map(loc => (
                            <div key={loc} className="settings-item">
                                <span className="settings-label">📍 {loc}</span>
                                <button
                                    className="text-danger text-sm"
                                    onClick={() => handleRemoveLocation(loc)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        ))}
                        {settings.locations.length === 0 && (
                            <div className="settings-item">
                                <span className="text-muted">Aucun emplacement</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div>
                    <div className="callout callout-info mb-3">
                        <span>🔒</span>
                        <span>Gestion des utilisateurs — bientôt disponible</span>
                    </div>

                    <div className="settings-section">
                        {mockUsers.map(user => (
                            <div key={user.id} className="settings-item">
                                <div>
                                    <p className="settings-label">{user.name}</p>
                                    <p className="text-sm text-muted">{user.email}</p>
                                </div>
                                <span className={`badge ${user.role === 'owner' ? 'badge-primary' : 'badge-neutral'}`}>
                                    {user.role === 'owner' ? 'Propriétaire' : 'Employé'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
