// src/features/foods/hooks/useFoods.ts
// Custom hook para manejar el estado de las comidas

import { Food } from '../../../models';
import { FoodRepo } from '../../../services/foodService';
import { CONFIG } from '../../../app/config';

export interface UseFoodsReturn {
  foods: Food[];
  activeFoods: Food[];
  inactiveFoods: Food[];
  loading: boolean;
  error: string | null;
  refreshFoods: () => void;
  addFood: (food: Omit<Food, 'id' | 'createdAt' | 'amountSold'>) => Promise<boolean>;
  updateFood: (id: string, updates: Partial<Food>) => Promise<boolean>;
  deleteFood: (id: string) => Promise<boolean>;
  toggleFoodStatus: (id: string) => Promise<boolean>;
  searchFoods: (query: string) => Food[];
  getFoodById: (id: string) => Food | undefined;
  getFoodsByCategory: (category?: string) => Food[];
}

/**
 * Custom hook para manejar el estado de las comidas
 */
export function useFoods(): UseFoodsReturn {
  let foods: Food[] = [];
  let loading = false;
  let error: string | null = null;

  /**
   * Carga las comidas desde el storage
   */
  const loadFoods = (): void => {
    try {
      foods = FoodRepo.getAll();
      error = null;
    } catch (err) {
      error = 'Error al cargar las comidas';
      console.error('Error loading foods:', err);
    }
  };

  /**
   * Refresca la lista de comidas
   */
  const refreshFoods = (): void => {
    loadFoods();
  };

  /**
   * Agrega una nueva comida
   */
  const addFood = async (foodData: Omit<Food, 'id' | 'createdAt' | 'amountSold'>): Promise<boolean> => {
    try {
      loading = true;
      error = null;
      
      const newFood: Food = {
        ...foodData,
        id: `food_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        amountSold: 0,
        isActive: true
      };

      // Usar el método add del FoodRepo
      await FoodRepo.add(newFood, { startTime: '08:00', endTime: '23:00' });
      refreshFoods();
      return true;
    } catch (err) {
      error = 'Error al crear la comida';
      console.error('Error creating food:', err);
      return false;
    } finally {
      loading = false;
    }
  };

  /**
   * Actualiza una comida existente
   */
  const updateFood = async (id: string, updates: Partial<Food>): Promise<boolean> => {
    try {
      loading = true;
      error = null;
      
      const existingFood = FoodRepo.findById(id);
      if (!existingFood) {
        error = 'Comida no encontrada';
        return false;
      }

      const updatedFood: Food = {
        ...existingFood,
        ...updates
      };

      // Usar el método update del FoodRepo
      await FoodRepo.update(updatedFood);
      refreshFoods();
      return true;
    } catch (err) {
      error = 'Error al actualizar la comida';
      console.error('Error updating food:', err);
      return false;
    } finally {
      loading = false;
    }
  };

  /**
   * Elimina una comida (desactiva en lugar de eliminar físicamente)
   */
  const deleteFood = async (id: string): Promise<boolean> => {
    try {
      loading = true;
      error = null;
      
      const food = FoodRepo.findById(id);
      if (!food) {
        error = 'Comida no encontrada';
        return false;
      }

      // En lugar de eliminar, desactivar
      const success = await updateFood(id, { isActive: false });
      if (success) {
        refreshFoods();
        return true;
      } else {
        error = 'No se pudo desactivar la comida';
        return false;
      }
    } catch (err) {
      error = 'Error al desactivar la comida';
      console.error('Error deactivating food:', err);
      return false;
    } finally {
      loading = false;
    }
  };

  /**
   * Cambia el estado activo/inactivo de una comida
   */
  const toggleFoodStatus = async (id: string): Promise<boolean> => {
    try {
      const food = FoodRepo.findById(id);
      if (!food) {
        error = 'Comida no encontrada';
        return false;
      }

      return await updateFood(id, { isActive: !food.isActive });
    } catch (err) {
      error = 'Error al cambiar el estado de la comida';
      console.error('Error toggling food status:', err);
      return false;
    }
  };

  /**
   * Busca comidas por nombre
   */
  const searchFoods = (query: string): Food[] => {
    if (!query.trim()) return foods;
    
    const searchTerm = query.toLowerCase().trim();
    return foods.filter(food => 
      food.name.toLowerCase().includes(searchTerm) ||
      food.name.toLowerCase().includes(searchTerm)
    );
  };

  /**
   * Obtiene una comida por ID
   */
  const getFoodById = (id: string): Food | undefined => {
    return FoodRepo.findById(id);
  };

  /**
   * Obtiene comidas por categoría (para futuras implementaciones)
   */
  const getFoodsByCategory = (category?: string): Food[] => {
    if (!category) return foods;
    // Por ahora retorna todas las comidas, pero se puede implementar categorías
    return foods;
  };

  // Cargar comidas inicialmente
  loadFoods();

  return {
    get foods() { return foods; },
    get activeFoods() { return foods.filter(f => f.isActive); },
    get inactiveFoods() { return foods.filter(f => !f.isActive); },
    get loading() { return loading; },
    get error() { return error; },
    refreshFoods,
    addFood,
    updateFood,
    deleteFood,
    toggleFoodStatus,
    searchFoods,
    getFoodById,
    getFoodsByCategory
  };
}
