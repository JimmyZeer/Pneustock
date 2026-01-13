import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../data/mockData';

interface TopBarProps {
    onNewMovement: () => void;
}

export function TopBar({ onNewMovement }: TopBarProps) {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    const initials = currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <header className="topbar">
            <form className="topbar-search" onSubmit={handleSearch}>
                <div className="search-bar">
                    <span className="search-bar-icon">🔍</span>
                    <input
                        type="text"
                        className="search-bar-input"
                        placeholder="Ex: 205/55 R16, 205 55 16, Michelin, Primacy…"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </form>

            <div className="topbar-actions">
                <button className="btn btn-primary" onClick={onNewMovement}>
                    + Mouvement
                </button>

                <div className="user-menu">
                    <div className="user-avatar">{initials}</div>
                    <div className="user-info">
                        <span className="user-name">{currentUser.name}</span>
                        <span className="user-role">
                            {currentUser.role === 'owner' ? 'Propriétaire' : 'Employé'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
