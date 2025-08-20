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
  /** Internal method to retrieve all orders, including archived. */
  _internalGetAll(): Order[] {
    return Storage.read<Order[]>(KEY) || [];
  },

  /** Retrieves active orders (state !== false). */
  getAll(): Order[] {
    return this._internalGetAll().filter(o => o.state !== false);
  },

  /** Saves all orders. */
  saveAll(list: Order[]) {
    Storage.write(KEY, list);
  },

  /** Adds a new order if within schedule, returns the order or null. */
  async add(payload: Omit<Order, 'id' | 'createdAt' | 'delivered' | 'deliveredAt' | 'state'>): Promise<Order | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const activeRecord = FoodSaleRecordRepo.findLatestActiveByFoodId(payload.foodId);
        if (activeRecord) {
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
        } else {
          UI.toast('La comida no está disponible para la venta en este momento.');
          return resolve(null);
        }

        const o: Order = { id: uid('order_'), createdAt: nowTs(), delivered: false, deliveredAt: null, state: true, ...payload };
        const all = this._internalGetAll();
        all.push(o);
        this.saveAll(all);
        const food = FoodRepo.findById(o.foodId);
        if(food){
          let totalItems = o.quantity;
          if (o.comboId && o.comboQuantity) {
            const combo = food.combos.find(c => c.id === o.comboId);
            if (combo) {
              totalItems += combo.quantity * o.comboQuantity;
            }
          }
          FoodRepo.decreaseStock(o, totalItems);
        }
        resolve(o);
      }, 1000);
    });
  },

  /** Updates an order, handles stock changes and schedule validation, returns success. */
  async update(updated: Order): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const all = this._internalGetAll();
        const originalOrder = all.find(o => o.id === updated.id);

        const activeRecord = FoodSaleRecordRepo.findLatestActiveByFoodId(updated.foodId);
        if (activeRecord) {
          const deliveryTime = new Date(updated.deliveryTime);
          const [deliveryHour, deliveryMinute] = [deliveryTime.getHours(), deliveryTime.getMinutes()];
          const deliveryTotalMinutes = deliveryHour * 60 + deliveryMinute;

          const [startHour, startMinute] = activeRecord.startTime.split(':').map(Number);
          const startTotalMinutes = startHour * 60 + startMinute;

          const [endHour, endMinute] = activeRecord.endTime.split(':').map(Number);
          const endTotalMinutes = endHour * 60 + endMinute;

          if (deliveryTotalMinutes < startTotalMinutes || deliveryTotalMinutes > endTotalMinutes) {
            UI.toast(`Pedido fuera de horario. Disponible de ${activeRecord.startTime} a ${activeRecord.endTime}.`);
            return resolve(false);
          }
        } else {
          if (originalOrder?.foodId !== updated.foodId) {
            UI.toast('La nueva comida seleccionada no está disponible para la venta.');
            return resolve(false);
          }
        }

        if (originalOrder) {
          const originalFood = FoodRepo.findById(originalOrder.foodId);
          const updatedFood = FoodRepo.findById(updated.foodId);

          if(originalFood && updatedFood){
            let originalTotalItems = originalOrder.quantity;
            if (originalOrder.comboId && originalOrder.comboQuantity) {
              const combo = originalFood.combos.find(c => c.id === originalOrder.comboId);
              if (combo) {
                originalTotalItems += combo.quantity * originalOrder.comboQuantity;
              }
            }

            let updatedTotalItems = updated.quantity;
            if (updated.comboId && updated.comboQuantity) {
              const combo = updatedFood.combos.find(c => c.id === updated.comboId);
              if (combo) {
                updatedTotalItems += combo.quantity * updated.comboQuantity;
              }
            }

            if (originalOrder.foodId === updated.foodId) {
              const quantityDiff = updatedTotalItems - originalTotalItems;
              if (quantityDiff > 0) {
                FoodRepo.decreaseStock(updated, quantityDiff);
              } else if (quantityDiff < 0) {
                FoodRepo.increaseStock(updated, Math.abs(quantityDiff));
              }
            } else {
              FoodRepo.increaseStock(originalOrder, originalTotalItems);
              FoodRepo.decreaseStock(updated, updatedTotalItems);
            }
          }
        }

        const updatedList = all.map(o => (o.id === updated.id ? { ...o, ...updated } : o));
        this.saveAll(updatedList);
        resolve(true);
      }, 1000);
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
    delivered.sort((a, b) => (a.deliveredAt && b.deliveredAt) ? new Date(a.deliveredAt).getTime() - new Date(b.deliveredAt).getTime() : -1);
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
    const others = this.getAll().filter(o => o.id !== exceptOrderId);
    for (const o of others) {
      if (Math.abs(t - new Date(o.deliveryTime).getTime()) < msGap) {
        return { conflict: true, other: o };
      }
    }
    return { conflict: false };
  }
};