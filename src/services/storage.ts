
// src\services\storage.ts
const KEY_META = 'fd_meta_v1';
const KEY_FOODS = 'fd_foods_v1';
const KEY_ORDERS = 'fd_orders_v1';
const KEY_AUDIT = 'fd_audit_v1';

export const Storage = {
  read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : null;
    } catch (e) {
      console.warn('Storage.read error', e);
      return null;
    }
  },
  write<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.write failed', e);
      return false;
    }
  },
  keys: { KEY_META, KEY_FOODS, KEY_ORDERS, KEY_AUDIT },
};
