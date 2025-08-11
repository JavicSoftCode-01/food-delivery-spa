// src/services/orderService.ts
import { Order } from '../models';
import { Storage } from './storage';
import { uid, nowTs, normalizePhone } from '../utils';
import { UI } from '../ui/ui';

const KEY = Storage.keys.KEY_ORDERS;

export const OrderRepo = {
  // Lee TODOS los pedidos, sin importar su estado
  _internalGetAll(): Order[] {
    return Storage.read<Order[]>(KEY) || [];
  },

  // Obtiene solo los pedidos ACTIVOS (state no es false)
  getAll(): Order[] {
    // Esto maneja los datos viejos donde 'state' es undefined, tratándolos como activos
    return this._internalGetAll().filter(o => o.state !== false);
  },

  saveAll(list: Order[]) {
    Storage.write(KEY, list);
  },
  
  add(payload: Omit<Order,'id'|'createdAt'|'delivered'|'deliveredAt'|'state'>) {
    // Al añadir, el estado es siempre 'true'
    const o: Order = { id: uid('order_'), createdAt: nowTs(), delivered: false, deliveredAt: null, state: true, ...payload };
    const all = this._internalGetAll();
    all.push(o);
    this.saveAll(all);
    console.log('Order added', { id: o.id, phone: o.phone, deliveryTime: o.deliveryTime });
    return o;
  },

  update(updated: Order) {
    // CORRECCIÓN: Debe buscar en la lista interna para poder modificar cualquier pedido
    const all = this._internalGetAll().map(o => o.id === updated.id ? { ...o, ...updated } : o);
    this.saveAll(all);
    console.log('Order updated', { id: updated.id });
  },

  // NUEVO: Archiva todos los pedidos ya entregados
  archiveDeliveredOrders(): void {
    const all = this._internalGetAll().map(order => {
        if (order.delivered) {
            return { ...order, state: false }; // Cambia el estado a inactivo
        }
        return order;
    });
    this.saveAll(all);
    UI.toast('Pedidos entregados archivados.');
  },

  getSorted(): Order[] {
    // Esta función ya trabaja con la lista de pedidos activos gracias a getAll()
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