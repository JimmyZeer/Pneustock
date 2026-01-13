import { useState, useCallback } from 'react';
import {
    TireProduct,
    StockMovement,
    SupplierDoc,
    GarageSettings,
    MovementType,
    MovementReason
} from '../types';
import {
    mockProducts,
    mockMovements,
    mockDocs,
    mockSettings
} from '../data/mockData';

// Generate unique ID
function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function useInventory() {
    const [products, setProducts] = useState<TireProduct[]>(mockProducts);
    const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
    const [documents, setDocuments] = useState<SupplierDoc[]>(mockDocs);
    const [settings, setSettings] = useState<GarageSettings>(mockSettings);

    // Product operations
    const addProduct = useCallback((productData: Omit<TireProduct, 'id'>) => {
        const newProduct: TireProduct = {
            ...productData,
            id: generateId()
        };
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    }, []);

    const updateProduct = useCallback((id: string, updates: Partial<TireProduct>) => {
        setProducts(prev =>
            prev.map(p => p.id === id ? { ...p, ...updates } : p)
        );
    }, []);

    const archiveProduct = useCallback((id: string) => {
        setProducts(prev =>
            prev.map(p => p.id === id ? { ...p, archived: true } : p)
        );
    }, []);

    const getProduct = useCallback((id: string) => {
        return products.find(p => p.id === id);
    }, [products]);

    // Movement operations
    const createMovement = useCallback((
        productId: string,
        type: MovementType,
        quantity: number,
        reason: MovementReason,
        userName: string,
        note?: string,
        docRef?: string
    ) => {
        const newMovement: StockMovement = {
            id: generateId(),
            createdAt: new Date(),
            type,
            productId,
            quantity: type === 'OUT' ? -Math.abs(quantity) : Math.abs(quantity),
            reason,
            note,
            userName,
            docRef
        };

        setMovements(prev => [newMovement, ...prev]);

        // Update stock based on movement type
        setProducts(prev =>
            prev.map(p => {
                if (p.id !== productId) return p;

                let newQty = p.qtyOnHand;
                if (type === 'IN') {
                    newQty += Math.abs(quantity);
                } else if (type === 'OUT') {
                    newQty -= Math.abs(quantity);
                } else {
                    // ADJUST: quantity can be positive or negative
                    newQty += quantity;
                }

                return { ...p, qtyOnHand: Math.max(0, newQty) };
            })
        );

        return newMovement;
    }, []);

    const getMovementsForProduct = useCallback((productId: string) => {
        return movements.filter(m => m.productId === productId);
    }, [movements]);

    const deleteMovement = useCallback((id: string) => {
        setMovements(prev => prev.filter(m => m.id !== id));
    }, []);

    // Document operations
    const addDocument = useCallback((docData: Omit<SupplierDoc, 'id' | 'status'>) => {
        const newDoc: SupplierDoc = {
            ...docData,
            id: generateId(),
            status: 'pending'
        };
        setDocuments(prev => [newDoc, ...prev]);
        return newDoc;
    }, []);

    const updateDocStatus = useCallback((id: string, status: 'pending' | 'processed') => {
        setDocuments(prev =>
            prev.map(d => d.id === id ? { ...d, status } : d)
        );
    }, []);

    // Settings operations
    const updateSettings = useCallback((updates: Partial<GarageSettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    const addLocation = useCallback((location: string) => {
        setSettings(prev => ({
            ...prev,
            locations: [...prev.locations, location]
        }));
    }, []);

    const removeLocation = useCallback((location: string) => {
        setSettings(prev => ({
            ...prev,
            locations: prev.locations.filter(l => l !== location)
        }));
    }, []);

    // Statistics
    const getStats = useCallback(() => {
        const activeProducts = products.filter(p => !p.archived);
        const totalStock = activeProducts.reduce((sum, p) => sum + p.qtyOnHand, 0);
        const outOfStock = activeProducts.filter(p => p.qtyOnHand <= 0).length;
        const belowThreshold = activeProducts.filter(
            p => p.qtyOnHand > 0 && p.qtyOnHand <= p.reorderThreshold
        ).length;

        return {
            totalReferences: activeProducts.length,
            totalStock,
            outOfStock,
            belowThreshold
        };
    }, [products]);

    const getBelowThresholdProducts = useCallback(() => {
        return products
            .filter(p => !p.archived && p.qtyOnHand <= p.reorderThreshold)
            .sort((a, b) => a.qtyOnHand - b.qtyOnHand);
    }, [products]);

    const getRecentMovements = useCallback((count: number = 5) => {
        return movements
            .slice()
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, count);
    }, [movements]);

    return {
        // Data
        products: products.filter(p => !p.archived),
        allProducts: products,
        movements,
        documents,
        settings,

        // Product operations
        addProduct,
        updateProduct,
        archiveProduct,
        getProduct,

        // Movement operations
        createMovement,
        getMovementsForProduct,
        deleteMovement,

        // Document operations
        addDocument,
        updateDocStatus,

        // Settings operations
        updateSettings,
        addLocation,
        removeLocation,

        // Statistics
        getStats,
        getBelowThresholdProducts,
        getRecentMovements
    };
}
