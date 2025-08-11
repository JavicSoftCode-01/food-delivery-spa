// src/services/orderService.ts
import { Order } from '../models';
import { Storage } from './storage';
import { uid, nowTs, normalizePhone } from '../utils';

const KEY = Storage.keys.KEY_ORDERS;

export const OrderRepo = {
  getAll(): Order[] {
    return Storage.read<Order[]>(KEY) || [];
  },

  saveAll(list: Order[]) {
    Storage.write(KEY, list);
  },

  add(payload: Omit<Order,'id'|'createdAt'|'delivered'|'deliveredAt'>) {
    const o: Order = { id: uid('order_'), createdAt: nowTs(), delivered: false, deliveredAt: null, ...payload };
    const all = this.getAll();
    all.push(o);
    this.saveAll(all);
    console.log('Order added', { id: o.id, phone: o.phone, deliveryTime: o.deliveryTime });
    return o;
  },

  update(updated: Order) {
    const all = this.getAll().map(o => o.id === updated.id ? { ...o, ...updated } : o);
    this.saveAll(all);
    console.log('Order updated', { id: updated.id });
  },

  getSorted(): Order[] {
    const allOrders = this.getAll();
    
    // Separa los pedidos en pendientes y entregados
    const pending = allOrders.filter((o) => !o.delivered);
    const delivered = allOrders.filter((o) => o.delivered);

    // 1. Ordena los pendientes por fecha de entrega (el más próximo primero)
    pending.sort((a, b) => new Date(a.deliveryTime).getTime() - new Date(b.deliveryTime).getTime());

    // 2. Ordena los entregados por la fecha en que se marcaron (el más antiguo entregado primero)
    delivered.sort((a, b) => {
      // Si a 'deliveredAt' le falta, se va al final de su grupo.
      if (!a.deliveredAt) return 1;
      if (!b.deliveredAt) return -1;
      return new Date(a.deliveredAt).getTime() - new Date(b.deliveredAt).getTime();
    });

    // 3. Devuelve la lista combinada: primero todos los pendientes, luego los entregados.
    return [...pending, ...delivered];
  },

  findById(id: string) {
    return this.getAll().find(o => o.id === id);
  },

  // business rule: check gap minutes between any orders (global rule)
  checkConflict(deliveryTimeIso: string, phone: string, gapMinutes: number, exceptOrderId?: string) {
    const msGap = Math.abs(gapMinutes) * 60 * 1000;
    const t = new Date(deliveryTimeIso).getTime();
    const others = this.getAll().filter(o => o.id !== exceptOrderId);
    for (const o of others) {
      const ot = new Date(o.deliveryTime).getTime();
      if (Math.abs(t - ot) < msGap) {
        // if same phone or general conflict (we forbid any order in that gap)
        if (normalizePhone(phone) === normalizePhone(o.phone) || true) {
          return { conflict: true, other: o };
        }
      }
    }
    return { conflict: false };
  }
};