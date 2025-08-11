// src\services\foodService.ts
import { Food } from '../models';
import { Storage } from './storage';
import { uid, nowTs } from '../utils';

const KEY = Storage.keys.KEY_FOODS;

export const FoodRepo = {
  getAll(): Food[] {
    return Storage.read<Food[]>(KEY) || [];
  },
  saveAll(list: Food[]) {
    Storage.write(KEY, list);
  },
  add(f: Omit<Food,'id'|'createdAt'|'amountSold'>) {
    const obj: Food = { id: uid('food_'), amountSold: 0, createdAt: nowTs(), ...f };
    const all = this.getAll();
    all.push(obj);
    this.saveAll(all);
    console.log('Food created', { id: obj.id, name: obj.name });
    return obj;
  },
  update(updated: Food) {
    const all = this.getAll().map(f => f.id === updated.id ? { ...f, ...updated } : f);
    this.saveAll(all);
    console.log('Food updated', { id: updated.id, name: updated.name });
  },
  findById(id: string) {
    return this.getAll().find(f => f.id === id);
  },
  nameExists(name: string, exceptId?: string) {
    const n = name.trim().toLowerCase();
    return this.getAll().some(f => f.id !== exceptId && f.name.trim().toLowerCase() === n);
  },
  totalUnitsSold() {
    return this.getAll().reduce((s, f) => s + (f.amountSold || 0), 0);
  },
  totalProfit() {
    return this.getAll().reduce((s, f) => s + (f.amountSold || 0) * ((f.price || 0) - (f.cost || 0)), 0);
  }
};
