import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { MovementModal } from './MovementModal';

export function Layout() {
    const [showMovementModal, setShowMovementModal] = useState(false);

    return (
        <div className="app-layout">
            <Header />

            <main className="app-container">
                <Outlet context={{ openMovementModal: () => setShowMovementModal(true) }} />
            </main>

            <BottomNav />

            {showMovementModal && (
                <MovementModal onClose={() => setShowMovementModal(false)} />
            )}
        </div>
    );
}

// Hook to access layout context
import { useOutletContext } from 'react-router-dom';

interface LayoutContext {
    openMovementModal: () => void;
}

export function useLayoutContext() {
    return useOutletContext<LayoutContext>();
}
