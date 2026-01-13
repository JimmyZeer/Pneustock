-- PneuStock Database Schema
-- Run this in Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  width INTEGER NOT NULL,
  aspect_ratio INTEGER NOT NULL,
  rim_diameter INTEGER NOT NULL,
  load_index TEXT NOT NULL DEFAULT '91',
  speed_index TEXT NOT NULL DEFAULT 'V',
  season TEXT NOT NULL DEFAULT 'summer' CHECK (season IN ('summer', 'winter', 'allseason')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  location TEXT,
  qty_on_hand INTEGER NOT NULL DEFAULT 0,
  qty_reserved INTEGER NOT NULL DEFAULT 0,
  reorder_threshold INTEGER NOT NULL DEFAULT 4,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movements table
CREATE TABLE IF NOT EXISTS movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUST')),
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  note TEXT,
  user_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed')),
  note TEXT
);

-- Settings table (single row)
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Mon Garage',
  address TEXT NOT NULL DEFAULT '',
  locations TEXT[] NOT NULL DEFAULT ARRAY['A-01', 'A-02', 'B-01', 'B-02'],
  default_threshold INTEGER NOT NULL DEFAULT 4
);

-- Insert default settings if not exists
INSERT INTO settings (name, address, locations, default_threshold)
SELECT 'Mon Garage', '', ARRAY['A-01', 'A-02', 'B-01', 'B-02'], 4
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_archived ON products(archived);
CREATE INDEX IF NOT EXISTS idx_products_season ON products(season);
CREATE INDEX IF NOT EXISTS idx_movements_product_id ON movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_created_at ON movements(created_at DESC);

-- Enable Row Level Security (optional, for multi-tenant)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE movements ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
