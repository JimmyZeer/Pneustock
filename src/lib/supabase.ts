import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbProduct {
    id: string;
    width: number;
    aspect_ratio: number;
    rim_diameter: number;
    load_index: string;
    speed_index: string;
    season: 'summer' | 'winter' | 'allseason';
    brand: string;
    model: string;
    location: string | null;
    qty_on_hand: number;
    qty_reserved: number;
    reorder_threshold: number;
    archived: boolean;
    created_at: string;
}

export interface DbMovement {
    id: string;
    product_id: string;
    type: 'IN' | 'OUT' | 'ADJUST';
    quantity: number;
    reason: string;
    note: string | null;
    user_name: string;
    created_at: string;
}

export interface DbDocument {
    id: string;
    supplier_name: string;
    received_at: string;
    status: 'pending' | 'processed';
    note: string | null;
}

export interface DbSettings {
    id: string;
    name: string;
    address: string;
    locations: string[];
    default_threshold: number;
}
