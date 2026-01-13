import { useState, useCallback, useEffect } from 'react';
import { supabase, DbProduct, DbMovement, DbDocument, DbSettings } from '../lib/supabase';
import {
    TireProduct,
    StockMovement,
    SupplierDoc,
    GarageSettings,
    MovementType,
    MovementReason
} from '../types';

// Convert DB format to app format
function dbToProduct(db: DbProduct): TireProduct {
    return {
        id: db.id,
        width: db.width,
        aspectRatio: db.aspect_ratio,
        rimDiameter: db.rim_diameter,
        loadIndex: db.load_index,
        speedIndex: db.speed_index,
        season: db.season,
        brand: db.brand,
        model: db.model,
        location: db.location || undefined,
        qtyOnHand: db.qty_on_hand,
        qtyReserved: db.qty_reserved,
        reorderThreshold: db.reorder_threshold,
        archived: db.archived
    };
}

function dbToMovement(db: DbMovement): StockMovement {
    return {
        id: db.id,
        productId: db.product_id,
        type: db.type,
        quantity: db.quantity,
        reason: db.reason as MovementReason,
        note: db.note || undefined,
        userName: db.user_name,
        createdAt: new Date(db.created_at)
    };
}

function dbToDocument(db: DbDocument): SupplierDoc {
    return {
        id: db.id,
        supplierName: db.supplier_name,
        receivedAt: new Date(db.received_at),
        status: db.status,
        note: db.note || undefined
    };
}

function dbToSettings(db: DbSettings): GarageSettings {
    return {
        name: db.name,
        address: db.address,
        locations: db.locations,
        defaultThreshold: db.default_threshold
    };
}

export function useSupabaseInventory() {
    const [products, setProducts] = useState<TireProduct[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [documents, setDocuments] = useState<SupplierDoc[]>([]);
    const [settings, setSettings] = useState<GarageSettings>({
        name: 'Mon Garage',
        address: '',
        locations: ['A-01', 'A-02', 'B-01', 'B-02'],
        defaultThreshold: 4
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load all data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load products
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;
            setProducts((productsData || []).map(dbToProduct));

            // Load movements
            const { data: movementsData, error: movementsError } = await supabase
                .from('movements')
                .select('*')
                .order('created_at', { ascending: false });

            if (movementsError) throw movementsError;
            setMovements((movementsData || []).map(dbToMovement));

            // Load documents
            const { data: docsData, error: docsError } = await supabase
                .from('documents')
                .select('*')
                .order('received_at', { ascending: false });

            if (docsError) throw docsError;
            setDocuments((docsData || []).map(dbToDocument));

            // Load settings
            const { data: settingsData, error: settingsError } = await supabase
                .from('settings')
                .select('*')
                .limit(1)
                .single();

            if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
            if (settingsData) setSettings(dbToSettings(settingsData));

        } catch (err) {
            console.error('Error loading data:', err);
            setError('Erreur de chargement des données');
        } finally {
            setLoading(false);
        }
    };

    // Product operations
    const addProduct = useCallback(async (productData: Omit<TireProduct, 'id'>) => {
        const { data, error } = await supabase
            .from('products')
            .insert({
                width: productData.width,
                aspect_ratio: productData.aspectRatio,
                rim_diameter: productData.rimDiameter,
                load_index: productData.loadIndex,
                speed_index: productData.speedIndex,
                season: productData.season,
                brand: productData.brand,
                model: productData.model,
                location: productData.location || null,
                qty_on_hand: productData.qtyOnHand,
                qty_reserved: productData.qtyReserved,
                reorder_threshold: productData.reorderThreshold,
                archived: false
            })
            .select()
            .single();

        if (error) throw error;
        const newProduct = dbToProduct(data);
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
    }, []);

    const updateProduct = useCallback(async (id: string, updates: Partial<TireProduct>) => {
        const dbUpdates: Partial<DbProduct> = {};
        if (updates.width !== undefined) dbUpdates.width = updates.width;
        if (updates.aspectRatio !== undefined) dbUpdates.aspect_ratio = updates.aspectRatio;
        if (updates.rimDiameter !== undefined) dbUpdates.rim_diameter = updates.rimDiameter;
        if (updates.loadIndex !== undefined) dbUpdates.load_index = updates.loadIndex;
        if (updates.speedIndex !== undefined) dbUpdates.speed_index = updates.speedIndex;
        if (updates.season !== undefined) dbUpdates.season = updates.season;
        if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
        if (updates.model !== undefined) dbUpdates.model = updates.model;
        if (updates.location !== undefined) dbUpdates.location = updates.location || null;
        if (updates.qtyOnHand !== undefined) dbUpdates.qty_on_hand = updates.qtyOnHand;
        if (updates.qtyReserved !== undefined) dbUpdates.qty_reserved = updates.qtyReserved;
        if (updates.reorderThreshold !== undefined) dbUpdates.reorder_threshold = updates.reorderThreshold;
        if (updates.archived !== undefined) dbUpdates.archived = updates.archived;

        const { error } = await supabase
            .from('products')
            .update(dbUpdates)
            .eq('id', id);

        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    const archiveProduct = useCallback(async (id: string) => {
        await updateProduct(id, { archived: true });
    }, [updateProduct]);

    const getProduct = useCallback((id: string) => {
        return products.find(p => p.id === id);
    }, [products]);

    // Movement operations
    const createMovement = useCallback(async (
        productId: string,
        type: MovementType,
        quantity: number,
        reason: MovementReason,
        userName: string,
        note?: string
    ) => {
        const actualQty = type === 'OUT' ? -Math.abs(quantity) : Math.abs(quantity);

        // Insert movement
        const { data, error } = await supabase
            .from('movements')
            .insert({
                product_id: productId,
                type,
                quantity: actualQty,
                reason,
                note: note || null,
                user_name: userName
            })
            .select()
            .single();

        if (error) throw error;

        // Update product stock
        const product = products.find(p => p.id === productId);
        if (product) {
            let newQty = product.qtyOnHand;
            if (type === 'IN') newQty += Math.abs(quantity);
            else if (type === 'OUT') newQty -= Math.abs(quantity);
            else newQty += quantity;

            await supabase
                .from('products')
                .update({ qty_on_hand: Math.max(0, newQty) })
                .eq('id', productId);

            setProducts(prev => prev.map(p =>
                p.id === productId ? { ...p, qtyOnHand: Math.max(0, newQty) } : p
            ));
        }

        const newMovement = dbToMovement(data);
        setMovements(prev => [newMovement, ...prev]);
        return newMovement;
    }, [products]);

    const deleteMovement = useCallback(async (id: string) => {
        const { error } = await supabase
            .from('movements')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setMovements(prev => prev.filter(m => m.id !== id));
    }, []);

    const getMovementsForProduct = useCallback((productId: string) => {
        return movements.filter(m => m.productId === productId);
    }, [movements]);

    // Document operations
    const addDocument = useCallback(async (docData: Omit<SupplierDoc, 'id' | 'status'>) => {
        const { data, error } = await supabase
            .from('documents')
            .insert({
                supplier_name: docData.supplierName,
                received_at: docData.receivedAt.toISOString(),
                status: 'pending',
                note: docData.note || null
            })
            .select()
            .single();

        if (error) throw error;
        const newDoc = dbToDocument(data);
        setDocuments(prev => [newDoc, ...prev]);
        return newDoc;
    }, []);

    const updateDocStatus = useCallback(async (id: string, status: 'pending' | 'processed') => {
        const { error } = await supabase
            .from('documents')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    }, []);

    // Settings operations
    const updateSettings = useCallback(async (updates: Partial<GarageSettings>) => {
        const dbUpdates: Record<string, unknown> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.address !== undefined) dbUpdates.address = updates.address;
        if (updates.locations !== undefined) dbUpdates.locations = updates.locations;
        if (updates.defaultThreshold !== undefined) dbUpdates.default_threshold = updates.defaultThreshold;

        // Get existing settings id first
        const { data: existing } = await supabase
            .from('settings')
            .select('id')
            .limit(1)
            .single();

        if (existing) {
            await supabase.from('settings').update(dbUpdates).eq('id', existing.id);
        } else {
            await supabase.from('settings').insert(dbUpdates);
        }

        setSettings(prev => ({ ...prev, ...updates }));
    }, []);

    const addLocation = useCallback(async (location: string) => {
        const newLocations = [...settings.locations, location];
        await updateSettings({ locations: newLocations });
    }, [settings.locations, updateSettings]);

    const removeLocation = useCallback(async (location: string) => {
        const newLocations = settings.locations.filter(l => l !== location);
        await updateSettings({ locations: newLocations });
    }, [settings.locations, updateSettings]);

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
        return movements.slice(0, count);
    }, [movements]);

    return {
        // State
        loading,
        error,

        // Data
        products: products.filter(p => !p.archived),
        allProducts: products,
        movements,
        documents,
        settings,

        // Reload
        reload: loadData,

        // Product operations
        addProduct,
        updateProduct,
        archiveProduct,
        getProduct,

        // Movement operations
        createMovement,
        deleteMovement,
        getMovementsForProduct,

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
