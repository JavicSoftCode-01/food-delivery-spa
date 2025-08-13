// src/services/foodService.ts
import { Food, FoodSaleRecord } from '../models';
import { Storage } from './storage';
import { uid, nowTs } from '../utils';

/** Key for storing foods in storage. */
const KEY = Storage.keys.KEY_FOODS;
/** Key for storing food sale records in storage. */
const KEY_RECORDS = Storage.keys.KEY_FOOD_SALE_RECORDS;

/** Repository for managing food sale records. */
export const FoodSaleRecordRepo = {
  /** Retrieves all food sale records. */
  getAll(): FoodSaleRecord[] {
    return Storage.read<FoodSaleRecord[]>(KEY_RECORDS) || [];
  },

  /** Saves all food sale records. */
  saveAll(list: FoodSaleRecord[]) {
    Storage.write(KEY_RECORDS, list);
  },

  /** Adds a new food sale record and returns it. */
  add(record: Omit<FoodSaleRecord, 'id'>): FoodSaleRecord {
    const newRecord: FoodSaleRecord = { id: uid('record_'), ...record };
    const all = this.getAll();
    all.push(newRecord);
    this.saveAll(all);
    return newRecord;
  },

  /** Updates an existing food sale record. */
  update(updated: FoodSaleRecord) {
    const all = this.getAll().map(r => r.id === updated.id ? { ...r, ...updated } : r);
    this.saveAll(all);
  },

  /** Finds food sale records by food ID, sorted by date descending. */
  findByFoodId(foodId: string): FoodSaleRecord[] {
    return this.getAll().filter(r => r.foodId === foodId).sort((a, b) => {
      const dateComparison = new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime();
      if (dateComparison !== 0) return dateComparison;
      return b.id.localeCompare(a.id);
    });
  },

  /** Finds the latest active food sale record by food ID. */
  findLatestActiveByFoodId(foodId: string): FoodSaleRecord | undefined {
    return this.findByFoodId(foodId).find(r => r.isActive);
  }
};

/** Repository for managing foods. */
export const FoodRepo = {
  /** Retrieves all foods. */
  getAll(): Food[] {
    return Storage.read<Food[]>(KEY) || [];
  },

  /** Saves all foods. */
  saveAll(list: Food[]) {
    Storage.write(KEY, list);
  },

  /** Adds a new food and its initial sale record, returns the food. */
  add(
    f: Omit<Food, 'id' | 'createdAt' | 'amountSold' | 'isActive'>,
    times: { startTime: string, endTime: string }
  ): Food {
    const obj: Food = { id: uid('food_'), amountSold: 0, createdAt: nowTs(), isActive: true, ...f };
    const all = this.getAll();
    all.push(obj);
    this.saveAll(all);

    const todayStr = new Date().toISOString().slice(0, 10);
    FoodSaleRecordRepo.add({
      foodId: obj.id,
      recordDate: todayStr,
      startTime: times.startTime,
      endTime: times.endTime,
      initialStock: obj.stock,
      unitPrice: obj.price,
      unitCost: obj.cost,
      quantitySold: 0,
      isActive: true
    });

    console.log('Food created', { id: obj.id, name: obj.name });
    return obj;
  },

  /** Updates a food and handles related sale record changes. */
  update(
    updated: Food,
    options?: { startTime?: string, endTime?: string }
  ) {
    const original = this.findById(updated.id);
    if (!original) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const latestActiveRecord = FoodSaleRecordRepo.findLatestActiveByFoodId(updated.id);

    const hasPriceChanged = Math.abs(updated.price - original.price) > 0.001 || Math.abs(updated.cost - original.cost) > 0.001;

    if (updated.isActive && hasPriceChanged) {
      if (latestActiveRecord && latestActiveRecord.recordDate === todayStr) {
        latestActiveRecord.isActive = false;
        FoodSaleRecordRepo.update(latestActiveRecord);
      }
      updated.amountSold = 0;

      FoodSaleRecordRepo.add({
        foodId: updated.id,
        recordDate: todayStr,
        startTime: options?.startTime || '08:00',
        endTime: options?.endTime || '23:00',
        initialStock: updated.stock,
        unitPrice: updated.price,
        unitCost: updated.cost,
        quantitySold: 0,
        isActive: true,
      });
    } else if (updated.isActive && !original.isActive) {
      const recordToday = FoodSaleRecordRepo.findByFoodId(updated.id).find(r => r.recordDate === todayStr);

      if (recordToday && !hasPriceChanged) {
        recordToday.isActive = true;
        if (updated.stock > original.stock) {
          recordToday.initialStock += (updated.stock - original.stock);
        }
        if (options?.startTime) recordToday.startTime = options.startTime;
        if (options?.endTime) recordToday.endTime = options.endTime;
        FoodSaleRecordRepo.update(recordToday);
      } else {
        updated.amountSold = 0;
        FoodSaleRecordRepo.add({
          foodId: updated.id,
          recordDate: todayStr,
          startTime: options?.startTime || '08:00',
          endTime: options?.endTime || '23:00',
          initialStock: updated.stock,
          unitPrice: updated.price,
          unitCost: updated.cost,
          quantitySold: 0,
          isActive: true
        });
      }
    } else if (!updated.isActive && original.isActive) {
      if (latestActiveRecord) {
        latestActiveRecord.isActive = false;
        FoodSaleRecordRepo.update(latestActiveRecord);
      }
    } else if (updated.isActive && latestActiveRecord) {
      if (updated.stock > original.stock) {
        const diff = updated.stock - original.stock;
        latestActiveRecord.initialStock += diff;
      }
      if (options?.startTime) latestActiveRecord.startTime = options.startTime;
      if (options?.endTime) latestActiveRecord.endTime = options.endTime;
      FoodSaleRecordRepo.update(latestActiveRecord);
    }

    const all = this.getAll().map(f => f.id === updated.id ? { ...f, ...updated } : f);
    this.saveAll(all);
    console.log('Food updated', { id: updated.id, name: updated.name });
  },

  /** Finds a food by ID. */
  findById(id: string): Food | undefined {
    return this.getAll().find(f => f.id === id);
  },

  /** Checks if a food name exists, excluding a specific ID if provided. */
  nameExists(name: string, exceptId?: string): boolean {
    const n = name.trim().toLowerCase();
    return this.getAll().some(f => f.id !== exceptId && f.name.trim().toLowerCase() === n);
  },

  /** Calculates total profit from all foods. */
  totalProfit(): number {
    return this.getAll().reduce((s, f) => s + (f.amountSold || 0) * ((f.price || 0) - (f.cost || 0)), 0);
  },

  /** Decreases stock and increases sold amount for a food, updates active record. */
  decreaseStock(foodId: string, quantity: number): void {
    const allFoods = this.getAll();
    const foodIndex = allFoods.findIndex(f => f.id === foodId);
    if (foodIndex > -1) {
      allFoods[foodIndex].stock = Math.max(0, allFoods[foodIndex].stock - quantity);
      allFoods[foodIndex].amountSold += quantity;
      this.saveAll(allFoods);

      const activeRecord = FoodSaleRecordRepo.findLatestActiveByFoodId(foodId);
      if (activeRecord) {
        activeRecord.quantitySold += quantity;
        FoodSaleRecordRepo.update(activeRecord);
      }
    }
  },

  /** Increases stock and decreases sold amount for a food, updates active record. */
  increaseStock(foodId: string, quantity: number): void {
    const allFoods = this.getAll();
    const foodIndex = allFoods.findIndex(f => f.id === foodId);
    if (foodIndex > -1) {
      allFoods[foodIndex].stock += quantity;
      allFoods[foodIndex].amountSold = Math.max(0, allFoods[foodIndex].amountSold - quantity);
      this.saveAll(allFoods);

      const activeRecord = FoodSaleRecordRepo.findLatestActiveByFoodId(foodId);
      if (activeRecord) {
        activeRecord.quantitySold = Math.max(0, activeRecord.quantitySold - quantity);
        FoodSaleRecordRepo.update(activeRecord);
      }
    }
  },
};