import { TireProduct, StockMovement, SupplierDoc, GarageSettings, User } from '../types';

// Mock tire products
export const mockProducts: TireProduct[] = [
    {
        id: '1',
        width: 205,
        aspectRatio: 55,
        rimDiameter: 16,
        loadIndex: '91',
        speedIndex: 'V',
        season: 'summer',
        brand: 'Michelin',
        model: 'Primacy 4',
        location: 'A-01',
        reorderThreshold: 4,
        qtyOnHand: 8,
        qtyReserved: 0
    },
    {
        id: '2',
        width: 225,
        aspectRatio: 45,
        rimDiameter: 17,
        loadIndex: '94',
        speedIndex: 'W',
        season: 'summer',
        brand: 'Continental',
        model: 'PremiumContact 6',
        location: 'A-02',
        reorderThreshold: 4,
        qtyOnHand: 12,
        qtyReserved: 2
    },
    {
        id: '3',
        width: 205,
        aspectRatio: 55,
        rimDiameter: 16,
        loadIndex: '91',
        speedIndex: 'H',
        season: 'winter',
        brand: 'Michelin',
        model: 'Alpin 6',
        location: 'B-01',
        reorderThreshold: 4,
        qtyOnHand: 3,
        qtyReserved: 0
    },
    {
        id: '4',
        width: 195,
        aspectRatio: 65,
        rimDiameter: 15,
        loadIndex: '91',
        speedIndex: 'T',
        season: 'allseason',
        brand: 'Goodyear',
        model: 'Vector 4Seasons Gen-3',
        location: 'C-01',
        reorderThreshold: 4,
        qtyOnHand: 6,
        qtyReserved: 0
    },
    {
        id: '5',
        width: 225,
        aspectRatio: 40,
        rimDiameter: 18,
        loadIndex: '92',
        speedIndex: 'Y',
        season: 'summer',
        brand: 'Pirelli',
        model: 'P Zero',
        location: 'A-03',
        reorderThreshold: 2,
        qtyOnHand: 4,
        qtyReserved: 0
    },
    {
        id: '6',
        width: 185,
        aspectRatio: 65,
        rimDiameter: 15,
        loadIndex: '88',
        speedIndex: 'T',
        season: 'summer',
        brand: 'Bridgestone',
        model: 'Turanza T005',
        location: 'A-04',
        reorderThreshold: 4,
        qtyOnHand: 0,
        qtyReserved: 0
    },
    {
        id: '7',
        width: 215,
        aspectRatio: 55,
        rimDiameter: 17,
        loadIndex: '94',
        speedIndex: 'V',
        season: 'summer',
        brand: 'Continental',
        model: 'EcoContact 6',
        location: 'A-05',
        reorderThreshold: 4,
        qtyOnHand: 2,
        qtyReserved: 0
    },
    {
        id: '8',
        width: 205,
        aspectRatio: 60,
        rimDiameter: 16,
        loadIndex: '92',
        speedIndex: 'H',
        season: 'winter',
        brand: 'Goodyear',
        model: 'UltraGrip 9+',
        location: 'B-02',
        reorderThreshold: 4,
        qtyOnHand: 10,
        qtyReserved: 4
    },
    {
        id: '9',
        width: 235,
        aspectRatio: 55,
        rimDiameter: 19,
        loadIndex: '105',
        speedIndex: 'V',
        season: 'allseason',
        brand: 'Michelin',
        model: 'CrossClimate 2',
        location: 'C-02',
        reorderThreshold: 2,
        qtyOnHand: 4,
        qtyReserved: 0
    },
    {
        id: '10',
        width: 255,
        aspectRatio: 35,
        rimDiameter: 20,
        loadIndex: '97',
        speedIndex: 'Y',
        season: 'summer',
        brand: 'Michelin',
        model: 'Pilot Sport 5',
        location: 'A-06',
        reorderThreshold: 2,
        qtyOnHand: 2,
        qtyReserved: 2
    },
    {
        id: '11',
        width: 175,
        aspectRatio: 65,
        rimDiameter: 14,
        loadIndex: '82',
        speedIndex: 'T',
        season: 'summer',
        brand: 'Hankook',
        model: 'Kinergy Eco 2',
        location: 'A-07',
        reorderThreshold: 4,
        qtyOnHand: 16,
        qtyReserved: 0
    },
    {
        id: '12',
        width: 195,
        aspectRatio: 55,
        rimDiameter: 16,
        loadIndex: '87',
        speedIndex: 'H',
        season: 'winter',
        brand: 'Dunlop',
        model: 'Winter Sport 5',
        location: 'B-03',
        reorderThreshold: 4,
        qtyOnHand: 5,
        qtyReserved: 1
    },
    {
        id: '13',
        width: 205,
        aspectRatio: 55,
        rimDiameter: 16,
        loadIndex: '94',
        speedIndex: 'V',
        season: 'allseason',
        brand: 'Continental',
        model: 'AllSeasonContact',
        location: 'C-03',
        reorderThreshold: 4,
        qtyOnHand: 8,
        qtyReserved: 0
    },
    {
        id: '14',
        width: 245,
        aspectRatio: 45,
        rimDiameter: 18,
        loadIndex: '100',
        speedIndex: 'W',
        season: 'summer',
        brand: 'Vredestein',
        model: 'Ultrac',
        location: 'A-08',
        reorderThreshold: 2,
        qtyOnHand: 0,
        qtyReserved: 0
    },
    {
        id: '15',
        width: 225,
        aspectRatio: 50,
        rimDiameter: 17,
        loadIndex: '98',
        speedIndex: 'V',
        season: 'winter',
        brand: 'Pirelli',
        model: 'Sottozero 3',
        location: 'B-04',
        reorderThreshold: 2,
        qtyOnHand: 3,
        qtyReserved: 0
    }
];

// Mock stock movements
export const mockMovements: StockMovement[] = [
    {
        id: 'm1',
        createdAt: new Date('2026-01-13T14:30:00'),
        type: 'OUT',
        productId: '1',
        quantity: 4,
        reason: 'Montage',
        userName: 'Pierre Martin'
    },
    {
        id: 'm2',
        createdAt: new Date('2026-01-13T11:15:00'),
        type: 'IN',
        productId: '2',
        quantity: 8,
        reason: 'Réception',
        note: 'Commande Continental',
        userName: 'Marie Dupont'
    },
    {
        id: 'm3',
        createdAt: new Date('2026-01-12T16:45:00'),
        type: 'OUT',
        productId: '8',
        quantity: 4,
        reason: 'Vente',
        userName: 'Pierre Martin'
    },
    {
        id: 'm4',
        createdAt: new Date('2026-01-12T10:00:00'),
        type: 'ADJUST',
        productId: '6',
        quantity: -2,
        reason: 'Correction',
        note: 'Inventaire physique',
        userName: 'Marie Dupont'
    },
    {
        id: 'm5',
        createdAt: new Date('2026-01-11T15:20:00'),
        type: 'IN',
        productId: '11',
        quantity: 12,
        reason: 'Réception',
        userName: 'Pierre Martin'
    },
    {
        id: 'm6',
        createdAt: new Date('2026-01-11T09:30:00'),
        type: 'OUT',
        productId: '5',
        quantity: 2,
        reason: 'Montage',
        userName: 'Marie Dupont'
    },
    {
        id: 'm7',
        createdAt: new Date('2026-01-10T14:00:00'),
        type: 'IN',
        productId: '9',
        quantity: 4,
        reason: 'Réception',
        note: 'Commande Michelin',
        userName: 'Pierre Martin'
    },
    {
        id: 'm8',
        createdAt: new Date('2026-01-10T11:45:00'),
        type: 'OUT',
        productId: '3',
        quantity: 4,
        reason: 'Vente',
        userName: 'Marie Dupont'
    },
    {
        id: 'm9',
        createdAt: new Date('2026-01-09T16:30:00'),
        type: 'ADJUST',
        productId: '10',
        quantity: 2,
        reason: 'Correction',
        note: 'Réservation client',
        userName: 'Pierre Martin'
    },
    {
        id: 'm10',
        createdAt: new Date('2026-01-09T10:15:00'),
        type: 'IN',
        productId: '15',
        quantity: 6,
        reason: 'Réception',
        userName: 'Marie Dupont'
    }
];

// Mock supplier documents
export const mockDocs: SupplierDoc[] = [
    {
        id: 'd1',
        supplierName: 'Michelin France',
        receivedAt: new Date('2026-01-13'),
        note: 'Livraison pneus été',
        fileName: 'BL-MICH-2026-0113.pdf',
        status: 'processed'
    },
    {
        id: 'd2',
        supplierName: 'Continental Distribution',
        receivedAt: new Date('2026-01-12'),
        note: 'Facture janvier',
        fileName: 'FAC-CONT-2026-001.pdf',
        status: 'pending'
    },
    {
        id: 'd3',
        supplierName: 'Goodyear Dunlop',
        receivedAt: new Date('2026-01-10'),
        note: 'BL hiver',
        status: 'processed'
    },
    {
        id: 'd4',
        supplierName: 'Pirelli Tyres',
        receivedAt: new Date('2026-01-08'),
        fileName: 'COMMANDE-PIR-2026.xlsx',
        status: 'pending'
    }
];

// Mock garage settings
export const mockSettings: GarageSettings = {
    name: 'Garage Dupont & Fils',
    address: '12 Rue de la Mécanique, 69001 Lyon',
    locations: ['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-06', 'A-07', 'A-08', 'B-01', 'B-02', 'B-03', 'B-04', 'C-01', 'C-02', 'C-03'],
    defaultThreshold: 4
};

// Mock users
export const mockUsers: User[] = [
    {
        id: 'u1',
        name: 'Marie Dupont',
        email: 'marie@garage-dupont.fr',
        role: 'owner'
    },
    {
        id: 'u2',
        name: 'Pierre Martin',
        email: 'pierre@garage-dupont.fr',
        role: 'staff'
    }
];

// Current user (for UI display)
export const currentUser: User = mockUsers[0];

// Get all unique brands from products
export function getBrands(products: TireProduct[]): string[] {
    return [...new Set(products.map(p => p.brand))].sort();
}
