import { useState, useRef, ReactNode } from 'react';
import { haptic } from '../utils/mobile';

interface SwipeableItemProps {
    children: ReactNode;
    onDelete?: () => void;
    onEdit?: () => void;
    deleteLabel?: string;
    editLabel?: string;
    threshold?: number;
}

export function SwipeableItem({
    children,
    onDelete,
    onEdit,
    deleteLabel = 'Supprimer',
    editLabel = 'Modifier',
    threshold = 80
}: SwipeableItemProps) {
    const [translateX, setTranslateX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startXRef = useRef(0);
    const currentXRef = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        startXRef.current = e.touches[0].clientX;
        currentXRef.current = translateX;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;

        const diff = e.touches[0].clientX - startXRef.current;
        const newTranslate = Math.min(0, Math.max(-160, currentXRef.current + diff));
        setTranslateX(newTranslate);
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);

        // Snap to action position or back
        if (translateX < -threshold) {
            setTranslateX(-160);
            haptic('medium');
        } else {
            setTranslateX(0);
        }
    };

    const handleAction = (action: 'delete' | 'edit') => {
        haptic('success');
        setTranslateX(0);

        if (action === 'delete' && onDelete) {
            onDelete();
        } else if (action === 'edit' && onEdit) {
            onEdit();
        }
    };

    const resetSwipe = () => {
        setTranslateX(0);
    };

    return (
        <div className="swipeable-item">
            {/* Background actions */}
            <div className="swipe-actions">
                {onEdit && (
                    <button
                        className="swipe-action edit"
                        onClick={() => handleAction('edit')}
                    >
                        ✏️ {editLabel}
                    </button>
                )}
                {onDelete && (
                    <button
                        className="swipe-action delete"
                        onClick={() => handleAction('delete')}
                    >
                        🗑️ {deleteLabel}
                    </button>
                )}
            </div>

            {/* Swipeable content */}
            <div
                className={`swipeable-content ${isSwiping ? 'swiping' : ''}`}
                style={{ transform: `translateX(${translateX}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={translateX !== 0 ? resetSwipe : undefined}
            >
                {children}
            </div>
        </div>
    );
}
