import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/search', icon: '🔍', label: 'Recherche Stock' },
    { to: '/products', icon: '🛞', label: 'Références pneus' },
    { to: '/movements', icon: '📦', label: 'Mouvements de stock' },
    { to: '/docs', icon: '📄', label: 'Documents fournisseurs' },
    { to: '/settings', icon: '⚙️', label: 'Paramètres' },
];

export function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                🔧 PneuStock
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
