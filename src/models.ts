// src\models.ts
export type ID = string;

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
  deliveryTime: string; // ISO
  createdAt: number;
  delivered: boolean;
  deliveredAt?: string | null;
}
