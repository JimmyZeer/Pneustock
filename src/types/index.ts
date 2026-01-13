// Types for PneuStock inventory management

export type Season = 'summer' | 'winter' | 'allseason';
export type MovementType = 'IN' | 'OUT' | 'ADJUST';
export type MovementReason = 'Vente' | 'Montage' | 'Correction' | 'Retour' | 'Réception' | 'Autre';
export type DocStatus = 'pending' | 'processed';

export interface TireProduct {
  id: string;
  width: number;
  aspectRatio: number;
  rimDiameter: number;
  loadIndex: string;
  speedIndex: string;
  season: Season;
  brand: string;
  model: string;
  skuSupplier?: string;
  location?: string;
  reorderThreshold: number;
  qtyOnHand: number;
  qtyReserved: number;
  archived?: boolean;
}

export interface StockMovement {
  id: string;
  createdAt: Date;
  type: MovementType;
  productId: string;
  quantity: number;
  reason: MovementReason;
  note?: string;
  userName: string;
  docRef?: string;
}

export interface SupplierDoc {
  id: string;
  supplierName: string;
  receivedAt: Date;
  note?: string;
  fileName?: string;
  status: DocStatus;
}

export interface GarageSettings {
  name: string;
  address: string;
  locations: string[];
  defaultThreshold: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff';
  avatar?: string;
}

// Helper function to format tire dimension
export function formatDimension(product: TireProduct): string {
  return `${product.width}/${product.aspectRatio} R${product.rimDiameter}`;
}

// Helper function to format full tire spec
export function formatFullSpec(product: TireProduct): string {
  return `${formatDimension(product)} ${product.loadIndex}${product.speedIndex}`;
}

// Helper function to get stock status
export function getStockStatus(product: TireProduct): 'rupture' | 'faible' | 'ok' {
  const available = product.qtyOnHand - product.qtyReserved;
  if (available <= 0) return 'rupture';
  if (available <= product.reorderThreshold) return 'faible';
  return 'ok';
}

// Helper to get season label in French
export function getSeasonLabel(season: Season): string {
  const labels: Record<Season, string> = {
    summer: 'Été',
    winter: 'Hiver',
    allseason: '4 Saisons'
  };
  return labels[season];
}

// Helper to get movement type label
export function getMovementTypeLabel(type: MovementType): string {
  const labels: Record<MovementType, string> = {
    IN: 'Entrée',
    OUT: 'Sortie',
    ADJUST: 'Ajustement'
  };
  return labels[type];
}
