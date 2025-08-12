// src/services/orderService.ts
import { Order } from '../models';
import { Storage } from './storage';
import { uid, nowTs, normalizePhone } from '../utils';
import { UI } from '../ui/ui';
import { FoodRepo, FoodSaleRecordRepo } from './foodService'; // Importar ambos repos

const KEY = Storage.keys.KEY_ORDERS;

export const OrderRepo = {
  _internalGetAll(): Order[] {
    return Storage.read<Order[]>(KEY) || [];
  },

  getAll(): Order[] {
    return this._internalGetAll().filter(o => o.state !== false);
  },

  saveAll(list: Order[]) {
    Storage.write(KEY, list);
  },

  add(payload: Omit<Order, 'id' | 'createdAt' | 'delivered' | 'deliveredAt' | 'state'>): Order | null {
    // NUEVA VALIDACIÓN DE HORARIO
    const activeRecord = FoodSaleRecordRepo.findActiveByFoodId(payload.foodId);
    if (activeRecord) {
        const deliveryHour = new Date(payload.deliveryTime).getHours();
        const deliveryMinute = new Date(payload.deliveryTime).getMinutes();
        const deliveryTotalMinutes = deliveryHour * 60 + deliveryMinute;

        const [startHour, startMinute] = activeRecord.startTime.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;

        const [endHour, endMinute] = activeRecord.endTime.split(':').map(Number);
        const endTotalMinutes = endHour * 60 + endMinute;

        if (deliveryTotalMinutes < startTotalMinutes || deliveryTotalMinutes > endTotalMinutes) {
            UI.toast(`Pedido fuera de horario. Disponible de ${activeRecord.startTime} a ${activeRecord.endTime}.`);
            return null;
        }
    }
    
    const o: Order = { id: uid('order_'), createdAt: nowTs(), delivered: false, deliveredAt: null, state: true, ...payload };
    const all = this._internalGetAll();
    all.push(o);
    this.saveAll(all);
    console.log('Order added', { id: o.id, phone: o.phone, deliveryTime: o.deliveryTime });
    return o;
  },

  update(updated: Order): boolean {
    const all = this._internalGetAll();
    const originalOrder = all.find(o => o.id === updated.id);

    // NUEVA VALIDACIÓN DE HORARIO
    const activeRecord = FoodSaleRecordRepo.findActiveByFoodId(updated.foodId);
    if (activeRecord) {
        const deliveryHour = new Date(updated.deliveryTime).getHours();
        const deliveryMinute = new Date(updated.deliveryTime).getMinutes();
        const deliveryTotalMinutes = deliveryHour * 60 + deliveryMinute;

        const [startHour, startMinute] = activeRecord.startTime.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;

        const [endHour, endMinute] = activeRecord.endTime.split(':').map(Number);
        const endTotalMinutes = endHour * 60 + endMinute;

        if (deliveryTotalMinutes < startTotalMinutes || deliveryTotalMinutes > endTotalMinutes) {
            UI.toast(`Pedido fuera de horario. Disponible de ${activeRecord.startTime} a ${activeRecord.endTime}.`);
            return false;
        }
    }

    if (originalOrder) {
      if (originalOrder.delivered !== updated.delivered) {
        if (updated.delivered) {
          FoodRepo.decreaseStock(updated.foodId, updated.quantity);
        } else {
          FoodRepo.increaseStock(updated.foodId, updated.quantity);
        }
      }
      else if (originalOrder.delivered && updated.delivered) {
        if (originalOrder.foodId !== updated.foodId) {
          FoodRepo.increaseStock(originalOrder.foodId, originalOrder.quantity);
          FoodRepo.decreaseStock(updated.foodId, updated.quantity);
        }
        else {
          const quantityDiff = updated.quantity - originalOrder.quantity;
          if (quantityDiff > 0) {
            FoodRepo.decreaseStock(updated.foodId, quantityDiff);
          } else if (quantityDiff < 0) {
            FoodRepo.increaseStock(updated.foodId, Math.abs(quantityDiff));
          }
        }
      }
    }

    const updatedList = all.map(o => (o.id === updated.id ? { ...o, ...updated } : o));
    this.saveAll(updatedList);
    console.log('Order updated', { id: updated.id });
    return true;
  },

  archiveDeliveredOrders(): void {
    const all = this._internalGetAll().map(order => {
      if (order.delivered) {
        return { ...order, state: false };
      }
      return order;
    });
    this.saveAll(all);
    UI.toast('Pedidos entregados archivados.');
  },

  isFoodInActiveOrder(foodId: string): boolean {
    return this.getAll().some(order => order.foodId === foodId);
  },

  getSorted(): Order[] {
    const allOrders = this.getAll();
    const pending = allOrders.filter((o) => !o.delivered);
    const delivered = allOrders.filter((o) => o.delivered);

    pending.sort((a, b) => new Date(a.deliveryTime).getTime() - new Date(b.deliveryTime).getTime());
    delivered.sort((a, b) => {
      if (!a.deliveredAt) return 1;
      if (!b.deliveredAt) return -1;
      return new Date(a.deliveredAt).getTime() - new Date(b.deliveredAt).getTime();
    });

    return [...pending, ...delivered];
  },

  findById(id: string) {
    return this.getAll().find(o => o.id === id);
  },

  checkConflict(deliveryTimeIso: string, phone: string, gapMinutes: number, exceptOrderId?: string) {
    const msGap = Math.abs(gapMinutes) * 60 * 1000;
    const t = new Date(deliveryTimeIso).getTime();
    const others = this.getAll().filter(o => o.id !== exceptOrderId);
    for (const o of others) {
      const ot = new Date(o.deliveryTime).getTime();
      if (Math.abs(t - ot) < msGap) {
        if (normalizePhone(phone) === normalizePhone(o.phone) || true) {
          return { conflict: true, other: o };
        }
      }
    }
    return { conflict: false };
  }
};