// src/services/storage.ts
/** Key for metadata storage. */
const KEY_META = 'fd_meta_v1';
/** Key for foods storage. */
const KEY_FOODS = 'fd_foods_v1';
/** Key for orders storage. */
const KEY_ORDERS = 'fd_orders_v1';
/** Key for audit logs storage. */
const KEY_AUDIT = 'fd_audit_v1';
/** Key for food sale records storage. */
const KEY_FOOD_SALE_RECORDS = 'fd_food_sale_records_v1';

/** Storage utility for localStorage operations. */
export const Storage = {
  /** Reads and parses data from storage by key. */
  read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : null;
    } catch (e) {
      console.warn('Storage.read error', e);
      return null;
    }
  },

  /** Writes data to storage by key. */
  write<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.write failed', e);
      return false;
    }
  },

  /** Storage keys object. */
  keys: { KEY_META, KEY_FOODS, KEY_ORDERS, KEY_AUDIT, KEY_FOOD_SALE_RECORDS },
};