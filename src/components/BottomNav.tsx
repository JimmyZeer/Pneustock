import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/dashboard', icon: '🏠', label: 'Accueil' },
    { to: '/search', icon: '🔍', label: 'Stock' },
    { to: '/movements', icon: '📦', label: 'Mouvements' },
    { to: '/products', icon: '🛞', label: 'Références' },
    { to: '/settings', icon: '⚙️', label: 'Réglages' },
];

export function BottomNav() {
    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <span className="nav-item-icon">{item.icon}</span>
                    <span className="nav-item-label">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
