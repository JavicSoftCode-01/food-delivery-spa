// src/models.ts
export type ID = string;

// NUEVO: Modelo para el historial de ventas de cada comida por fecha.
export interface FoodSaleRecord {
  id: ID;
  foodId: ID;
  recordDate: string; // Fecha en formato YYYY-MM-DD para facilitar comparaciones
  startTime: string;   // Hora de inicio en formato HH:mm
  endTime: string;     // Hora de fin en formato HH:mm
  initialStock: number;
  unitPrice: number;
  unitCost: number;
  quantitySold: number;
  isActive: boolean;   // Controla si esta sesión de venta específica está activa
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
}

export interface Order {
  id: ID;
  fullName: string;
  phone: string;
  deliveryAddress: string;
  foodId: ID;
  quantity: number;
  combo: boolean;
  deliveryTime: string;
  createdAt: number;
  delivered: boolean;
  deliveredAt?: string | null;
  state: boolean;
}