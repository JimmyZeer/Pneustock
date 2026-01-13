import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { currentUser } from '../data/mockData';

interface HeaderProps {
    onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Hide search bar on pages that have their own search
    const hideHeaderSearch = ['/search', '/products'].includes(location.pathname);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
            setSearchValue(''); // Clear after navigating
            onSearch?.(searchValue.trim());
        }
    };

    const initials = currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <header className="header">
            <div className="header-top">
                <div className="header-brand">
                    <div className="header-logo">🔧</div>
                    <h1>PneuStock</h1>
                </div>
                <div className="header-actions">
                    <button className="header-btn">🔔</button>
                    <div className="header-avatar">{initials}</div>
                </div>
            </div>

            {/* Hide search bar on pages with their own search */}
            {!hideHeaderSearch && (
                <form className="search-container" onSubmit={handleSearch}>
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Rechercher (ex: 205 55 16)..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </form>
            )}
        </header>
    );
}

