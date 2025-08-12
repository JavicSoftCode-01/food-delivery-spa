// src/services/foodService.ts
import { Food, FoodSaleRecord } from '../models';
import { Storage } from './storage';
import { uid, nowTs } from '../utils';

const KEY = Storage.keys.KEY_FOODS;
const KEY_RECORDS = Storage.keys.KEY_FOOD_SALE_RECORDS; // Nueva clave de storage

// --- NUEVO: Repositorio para el historial de ventas de comidas ---
export const FoodSaleRecordRepo = {
  getAll(): FoodSaleRecord[] {
    return Storage.read<FoodSaleRecord[]>(KEY_RECORDS) || [];
  },
  saveAll(list: FoodSaleRecord[]) {
    Storage.write(KEY_RECORDS, list);
  },
  add(record: Omit<FoodSaleRecord, 'id'>) {
    const newRecord: FoodSaleRecord = { id: uid('record_'), ...record };
    const all = this.getAll();
    all.push(newRecord);
    this.saveAll(all);
    return newRecord;
  },
  update(updated: FoodSaleRecord) {
    const all = this.getAll().map(r => r.id === updated.id ? { ...r, ...updated } : r);
    this.saveAll(all);
  },
  findByFoodId(foodId: string): FoodSaleRecord[] {
    return this.getAll().filter(r => r.foodId === foodId).sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
  },
  findActiveByFoodId(foodId: string): FoodSaleRecord | undefined {
      const todayStr = new Date().toISOString().slice(0, 10);
      return this.getAll().find(r => r.foodId === foodId && r.recordDate === todayStr && r.isActive);
  }
};

export const FoodRepo = {
  getAll(): Food[] {
    return Storage.read<Food[]>(KEY) || [];
  },
  saveAll(list: Food[]) {
    this.handleSalesRecordCreation();
    Storage.write(KEY, list);
  },
  // Alerta al iniciar la app: si hay comidas activas de días pasados, crea registros.
  handleSalesRecordCreation() {
    const allFoods = this.getAll();
    const todayStr = new Date().toISOString().slice(0, 10);

    allFoods.forEach(food => {
        if(food.isActive) {
            const records = FoodSaleRecordRepo.findByFoodId(food.id);
            const todayRecord = records.find(r => r.recordDate === todayStr);
            if(!todayRecord) {
                 // Si está activa pero no tiene registro de hoy, significa que la venta es de un día nuevo.
                 // Creamos el registro y reseteamos el contador de vendidos en el objeto principal.
                FoodSaleRecordRepo.add({
                    foodId: food.id,
                    recordDate: todayStr,
                    startTime: '00:00',
                    endTime: '23:59',
                    initialStock: food.stock,
                    unitPrice: food.price,
                    unitCost: food.cost,
                    quantitySold: 0,
                    isActive: true,
                });
                food.amountSold = 0; // Se resetea para el nuevo día
            }
        }
    });
    Storage.write(KEY, allFoods);
  },

  add(f: Omit<Food,'id'|'createdAt'|'amountSold'|'isActive'>) {
    const obj: Food = { id: uid('food_'), amountSold: 0, createdAt: nowTs(), isActive: true, ...f };
    const all = this.getAll();
    all.push(obj);
    this.saveAll(all);
    
    // Crear el primer registro de ventas para la nueva comida
    const todayStr = new Date().toISOString().slice(0, 10);
    FoodSaleRecordRepo.add({
        foodId: obj.id,
        recordDate: todayStr,
        startTime: '00:00', // Valor por defecto
        endTime: '23:59',   // Valor por defecto
        initialStock: obj.stock,
        unitPrice: obj.price,
        unitCost: obj.cost,
        quantitySold: 0,
        isActive: true
    });
    
    console.log('Food created', { id: obj.id, name: obj.name });
    return obj;
  },

  update(updated: Food) {
      const original = this.findById(updated.id);

      if (original) {
          const todayStr = new Date().toISOString().slice(0, 10);
          const activeRecord = FoodSaleRecordRepo.findActiveByFoodId(updated.id);

          // CASO: Se está activando una comida
          if (updated.isActive && !original.isActive) {
              if (activeRecord) {
                  // Si ya existe un registro para hoy (fue desactivada y reactivada), solo lo reactivamos
                  activeRecord.isActive = true;
                  // Si se añade más stock, se suma al stock inicial del día
                  if (updated.stock > original.stock) {
                    activeRecord.initialStock += (updated.stock - original.stock);
                  }
                  FoodSaleRecordRepo.update(activeRecord);
              } else {
                  // Si no hay registro hoy, es un nuevo día de venta.
                  // Se resetea el contador de ventas en el objeto `Food`
                  updated.amountSold = 0;
                  // Se crea un nuevo registro para hoy
                  FoodSaleRecordRepo.add({
                      foodId: updated.id,
                      recordDate: todayStr,
                      startTime: '00:00',
                      endTime: '23:59',
                      initialStock: updated.stock,
                      unitPrice: updated.price,
                      unitCost: updated.cost,
                      quantitySold: 0,
                      isActive: true
                  });
              }
          }
          // CASO: Se está desactivando una comida
          else if (!updated.isActive && original.isActive) {
              if (activeRecord) {
                  // Se actualiza la cantidad vendida final y se desactiva la sesión de venta
                  activeRecord.quantitySold = updated.amountSold;
                  activeRecord.isActive = false;
                  FoodSaleRecordRepo.update(activeRecord);
              }
          }
          // CASO: La comida ya está activa y solo se actualizan datos (ej. precio, costo)
          else if (updated.isActive && activeRecord) {
              activeRecord.unitPrice = updated.price;
              activeRecord.unitCost = updated.cost;
               if (updated.stock > original.stock) {
                    const diff = updated.stock - original.stock;
                    activeRecord.initialStock += diff;
                }
              FoodSaleRecordRepo.update(activeRecord);
          }
      }

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
      // Suma las ventas de todos los registros históricos
    return FoodSaleRecordRepo.getAll().reduce((s, r) => s + (r.quantitySold || 0), 0);
  },
  
  totalProfit() {
    // Calcula el beneficio total basado en el historial
    return FoodSaleRecordRepo.getAll().reduce((s, r) => s + (r.quantitySold || 0) * ((r.unitPrice || 0) - (r.unitCost || 0)), 0);
  },

  decreaseStock(foodId: string, quantity: number): void {
    const allFoods = this.getAll();
    const foodIndex = allFoods.findIndex(f => f.id === foodId);
    if (foodIndex > -1) {
        allFoods[foodIndex].stock = Math.max(0, allFoods[foodIndex].stock - quantity);
        allFoods[foodIndex].amountSold += quantity;
        this.saveAll(allFoods);
        
        // Actualiza también el registro de venta activo
        const activeRecord = FoodSaleRecordRepo.findActiveByFoodId(foodId);
        if(activeRecord) {
            activeRecord.quantitySold += quantity;
            FoodSaleRecordRepo.update(activeRecord);
        }
        console.log(`Stock decreased for ${allFoods[foodIndex].name}`, { newStock: allFoods[foodIndex].stock });
    }
  },

  increaseStock(foodId: string, quantity: number): void {
    const allFoods = this.getAll();
    const foodIndex = allFoods.findIndex(f => f.id === foodId);
    if (foodIndex > -1) {
        allFoods[foodIndex].stock += quantity;
        allFoods[foodIndex].amountSold = Math.max(0, allFoods[foodIndex].amountSold - quantity);
        this.saveAll(allFoods);

        // Actualiza también el registro de venta activo
        const activeRecord = FoodSaleRecordRepo.findActiveByFoodId(foodId);
        if(activeRecord) {
            activeRecord.quantitySold = Math.max(0, activeRecord.quantitySold - quantity);
            FoodSaleRecordRepo.update(activeRecord);
        }
        console.log(`Stock increased for ${allFoods[foodIndex].name}`, { newStock: allFoods[foodIndex].stock });
    }
  },
};

// Iniciar el manejo de registros al cargar la app
FoodRepo.handleSalesRecordCreation();