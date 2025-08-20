// src/services/orderService.ts
import { Order } from '../models';
import { Storage } from './storage';
import { uid, nowTs } from '../utils';
import { UI } from '../ui/ui';
import { FoodRepo, FoodSaleRecordRepo } from './foodService';

/** Key for storing orders in storage. */
const KEY = Storage.keys.KEY_ORDERS;

/** Repository for managing orders. */
export const OrderRepo = {
  /** Internal method to calculate total items in an order. */
  _calculateTotalItems(order: Order): number {
    const food = FoodRepo.findById(order.foodId);
    if (!food) return order.quantity;

    let totalItems = order.quantity;
    if (order.comboId && order.comboQuantity > 0) {
      const combo = food.combos.find(c => c.id === order.comboId);
      if (combo) {
        totalItems += combo.quantity * order.comboQuantity;
      }
    }
    return totalItems;
  },
  
  /** Internal method to retrieve all orders, including archived. */
  _internalGetAll(): Order[] {
    return Storage.read<Order[]>(KEY) || [];
  },

  /**
   * Calculates the total reserved stock for a given food across all pending orders.
   * @param foodId The ID of the food to check.
   * @param exceptOrderId Optional ID of an order to exclude from the calculation (used when updating an order).
   * @returns The total number of items reserved in pending orders.
   */
  getReservedStockForFood(foodId: string, exceptOrderId?: string): number {
      const allOrders = this._internalGetAll();
      const pendingOrdersForFood = allOrders.filter(o =>
          o.foodId === foodId &&
          !o.delivered &&
          o.id !== exceptOrderId
      );
  
      return pendingOrdersForFood.reduce((total, order) => total + this._calculateTotalItems(order), 0);
  },

  /** Retrieves active orders (state !== false). */
  getAll(): Order[] {
    return this._internalGetAll().filter(o => o.state !== false);
  },

  /** Saves all orders. */
  saveAll(list: Order[]) {
    Storage.write(KEY, list);
  },

  /** Adds a new order if within schedule and stock is available. */
  async add(payload: Omit<Order, 'id' | 'createdAt' | 'delivered' | 'deliveredAt' | 'state'>): Promise<Order | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const food = FoodRepo.findById(payload.foodId);
        if (!food) {
          UI.toast('La comida seleccionada no existe.');
          return resolve(null);
        }

        const activeRecord = FoodSaleRecordRepo.findLatestActiveByFoodId(payload.foodId);
        if (!activeRecord || !activeRecord.isActive) {
          UI.toast('La comida no está disponible para la venta en este momento.');
          return resolve(null);
        }

        const deliveryTime = new Date(payload.deliveryTime);
        const [deliveryHour, deliveryMinute] = [deliveryTime.getHours(), deliveryTime.getMinutes()];
        const deliveryTotalMinutes = deliveryHour * 60 + deliveryMinute;
        const [startHour, startMinute] = activeRecord.startTime.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const [endHour, endMinute] = activeRecord.endTime.split(':').map(Number);
        const endTotalMinutes = endHour * 60 + endMinute;

        if (deliveryTotalMinutes < startTotalMinutes || deliveryTotalMinutes > endTotalMinutes) {
          UI.toast(`Pedido fuera de horario. Disponible de ${activeRecord.startTime} a ${activeRecord.endTime}.`);
          return resolve(null);
        }

        const tempOrder: Order = { id: 'temp', ...payload, createdAt: 0, delivered: false, state: true, deliveredAt: null };
        const requestedItems = this._calculateTotalItems(tempOrder);
        
        const reservedStock = this.getReservedStockForFood(food.id);
        const availableStock = food.stock - reservedStock;

        if (availableStock < requestedItems) {
          UI.toast(`Stock insuficiente para '${food.name}'. Solicitado: ${requestedItems}, Disponible: ${availableStock}.`, 10000);
          return resolve(null);
        }

        const o: Order = { id: uid('order_'), createdAt: nowTs(), delivered: false, deliveredAt: null, state: true, ...payload };
        const all = this._internalGetAll();
        all.push(o);
        this.saveAll(all);
        resolve(o);
      }, 500);
    });
  },

  /** Updates an order, handles stock validation and schedule. */
  async update(updated: Order): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const all = this._internalGetAll();
        const originalOrder = all.find(o => o.id === updated.id);

        if (!originalOrder) {
          UI.toast('El pedido original no se encontró para actualizar.');
          return resolve(false);
        }
        
        if (originalOrder.delivered) {
            UI.toast('No se puede modificar un pedido que ya ha sido entregado.');
            return resolve(false);
        }

        const food = FoodRepo.findById(updated.foodId);
        if (!food) {
          UI.toast('La comida seleccionada no existe.');
          return resolve(false);
        }

        const activeRecord = FoodSaleRecordRepo.findLatestActiveByFoodId(updated.foodId);
        if (!activeRecord || !activeRecord.isActive) {
          UI.toast('La comida no está disponible para la venta en este momento.');
          return resolve(false);
        }
        
        const requestedItems = this._calculateTotalItems(updated);
        const reservedStock = this.getReservedStockForFood(food.id, updated.id); // Exclude current order
        const availableStock = food.stock - reservedStock;

        if (availableStock < requestedItems) {
            UI.toast(`Stock insuficiente para '${food.name}'. Solicitado: ${requestedItems}, Disponible: ${availableStock}.`, 10000);
            return resolve(false);
        }

        const updatedList = all.map(o => (o.id === updated.id ? { ...o, ...updated } : o));
        this.saveAll(updatedList);
        resolve(true);
      }, 500);
    });
  },

  /** Updates the delivery status of an order and adjusts stock accordingly. */
  async updateDeliveryStatus(orderId: string, newDeliveredStatus: boolean): Promise<boolean> {
    return new Promise(resolve => {
        setTimeout(() => {
            const all = this._internalGetAll();
            const orderIndex = all.findIndex(o => o.id === orderId);
            if (orderIndex === -1) {
                UI.toast('Pedido no encontrado.');
                return resolve(false);
            }

            const order = all[orderIndex];
            const originalStatus = order.delivered;

            if (originalStatus === newDeliveredStatus) {
                return resolve(true);
            }

            const food = FoodRepo.findById(order.foodId);
            if (!food) {
                UI.toast('La comida asociada al pedido ya no existe.');
                return resolve(false);
            }

            const totalItems = this._calculateTotalItems(order);

            // Mark as DELIVERED
            if (newDeliveredStatus && !originalStatus) {
                // Final check against physical stock
                if (food.stock < totalItems) {
                    UI.toast(`No se puede entregar: Stock físico insuficiente para '${food.name}'. Requerido: ${totalItems}, Físico: ${food.stock}.`, 10000);
                    return resolve(false);
                }
                FoodRepo.decreaseStock(order, totalItems);
                order.delivered = true;
                order.deliveredAt = new Date().toISOString();
            }
            // Revert to PENDING
            else if (!newDeliveredStatus && originalStatus) {
                FoodRepo.increaseStock(order, totalItems);
                order.delivered = false;
                order.deliveredAt = null;
            }

            all[orderIndex] = order;
            this.saveAll(all);
            resolve(true);
        }, 500);
    });
  },

  archiveDeliveredOrders(): void {
    const all = this._internalGetAll().map(order => order.delivered ? { ...order, state: false } : order);
    this.saveAll(all);
    UI.toast('Pedidos entregados archivados.');
  },

  /** Checks if a food is in any active order. */
  isFoodInActiveOrder(foodId: string): boolean {
    return this.getAll().some(order => order.foodId === foodId);
  },

  /** Retrieves sorted orders: pending by delivery time, delivered by deliveredAt. */
  getSorted(): Order[] {
    const allOrders = this.getAll();
    const pending = allOrders.filter((o) => !o.delivered);
    const delivered = allOrders.filter((o) => o.delivered);

    pending.sort((a, b) => new Date(a.deliveryTime).getTime() - new Date(b.deliveryTime).getTime());
    delivered.sort((a, b) => {
        const timeA = a.deliveredAt ? new Date(a.deliveredAt).getTime() : 0;
        const timeB = b.deliveredAt ? new Date(b.deliveredAt).getTime() : 0;
        return timeB - timeA; // Sort descending, newest delivered first
    });

    return [...pending, ...delivered];
  },

  /** Finds an order by ID. */
  findById(id: string): Order | undefined {
    return this.getAll().find(o => o.id === id);
  },

  /** Checks for delivery time conflicts within a gap. */
  checkConflict(deliveryTimeIso: string, gapMinutes: number, exceptOrderId?: string): { conflict: boolean; other?: Order } {
    const msGap = Math.abs(gapMinutes) * 60 * 1000;
    const t = new Date(deliveryTimeIso).getTime();
    const others = this.getAll().filter(o => o.id !== exceptOrderId && !o.delivered); // Only check against pending orders
    for (const o of others) {
      if (Math.abs(t - new Date(o.deliveryTime).getTime()) < msGap) {
        return { conflict: true, other: o };
      }
    }
    return { conflict: false };
  }
};

// Global error handler for async operations
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  UI.toast('Ocurrió un error inesperado.');
});
