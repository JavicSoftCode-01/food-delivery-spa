// src/models.ts
export type ID = string;

// Modelo para el historial de ventas de cada comida por fecha.
export interface FoodSaleRecord {
  id: ID;
  foodId: ID;
  recordDate: string; // Fecha en formato YYYY-MM-DD para facilitar comparaciones
  startTime: string;   // Hora de inicio en formato HH:mm
  endTime: string;     // Hora de fin en formato HH:mm
  initialStock: number;
  unitPrice: number;
  unitCost: number;
  quantitySoldSingle: number;
  comboSales: Record<ID, { quantity: number, price: number, count: number }>; // comboId -> { quantity, price, count }
  isActive: boolean;   // Controla si esta sesión de venta específica está activa
}

export interface Combo {
  id: ID;
  quantity: number;
  price: number;
}

export interface Food {
  id: ID;
  name: string;
  cost: number;
  price: number;
  stock: number;
  amountSold: number;
  isActive: boolean;
  createdAt: number;
  combos: Combo[];
}

export interface Order {
  id: ID;
  fullName: string;
  phone: string;
  deliveryAddress: string;
  foodId: ID;
  quantity: number; // Cantidad de items individuales
  comboId: ID | null;
  comboQuantity: number; // Cantidad de combos
  deliveryTime: string;
  createdAt: number;
  delivered: boolean;
  deliveredAt?: string | null;
  state: boolean;
}