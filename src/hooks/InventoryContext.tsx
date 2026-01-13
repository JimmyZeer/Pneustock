import { createContext, useContext, ReactNode } from 'react';
import { useSupabaseInventory } from './useSupabaseInventory';

// Get return type of the hook
type InventoryContextType = ReturnType<typeof useSupabaseInventory>;

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
    const inventory = useSupabaseInventory();

    return (
        <InventoryContext.Provider value={inventory}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventoryContext() {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventoryContext must be used within an InventoryProvider');
    }
    return context;
}
