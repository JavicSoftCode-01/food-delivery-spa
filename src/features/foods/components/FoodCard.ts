// src/features/foods/components/FoodCard.ts
// Componente para mostrar una comida individual en listas

import { Food } from '../../../models';
import { formatCurrency, formatName } from '../../../utils';

export interface FoodCardProps {
  food: Food;
  onEdit?: (food: Food) => void;
  onDelete?: (food: Food) => void;
  onToggleStatus?: (food: Food) => void;
  onViewSales?: (food: Food) => void;
}

/**
 * Renderiza una tarjeta de comida
 */
export function renderFoodCard(
  container: HTMLElement,
  props: FoodCardProps
): void {
  const { food, onEdit, onDelete, onToggleStatus, onViewSales } = props;

  const card = document.createElement('div');
  card.className = `
    bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
    p-4 shadow-sm hover:shadow-md transition-all duration-200
    ${food.isActive ? 'ring-2 ring-green-200 dark:ring-green-800' : 'opacity-75'}
  `;

  const statusColor = food.isActive ? 'text-green-600' : 'text-red-600';
  const statusIcon = food.isActive ? 'fa-check-circle' : 'fa-times-circle';

  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
          ${formatName(food.name)}
        </h3>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            <i class="fa fa-tag mr-1"></i>${formatCurrency(food.price)}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            <i class="fa fa-dollar-sign mr-1"></i>${formatCurrency(food.cost)}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2 ml-3">
        <span class="text-sm ${statusColor} font-medium">
          <i class="fa ${statusIcon} mr-1"></i>
          ${food.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
      <div class="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
        <div class="font-semibold text-gray-900 dark:text-white">${food.stock}</div>
        <div class="text-gray-500 dark:text-gray-400">Stock</div>
      </div>
      <div class="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
        <div class="font-semibold text-gray-900 dark:text-white">${food.amountSold}</div>
        <div class="text-gray-500 dark:text-gray-400">Vendidos</div>
      </div>
    </div>

    ${food.combos.length > 0 ? `
      <div class="mb-3">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <i class="fa fa-boxes-stacked mr-1"></i>Combos Disponibles
        </div>
        <div class="flex flex-wrap gap-2">
          ${food.combos.map(combo => `
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
              ${combo.quantity}u - ${formatCurrency(combo.price)}
            </span>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <button 
          class="food-toggle-status-btn px-3 py-1.5 text-xs font-medium rounded-md transition-colors
            ${food.isActive 
              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800' 
              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
            }"
          data-food-id="${food.id}"
        >
          <i class="fa ${food.isActive ? 'fa-pause' : 'fa-play'} mr-1"></i>
          ${food.isActive ? 'Pausar' : 'Activar'}
        </button>
        
        <button 
          class="food-view-sales-btn px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 
            dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 rounded-md transition-colors"
          data-food-id="${food.id}"
        >
          <i class="fa fa-chart-line mr-1"></i>Ventas
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          class="food-edit-btn p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 
            hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          data-food-id="${food.id}"
          title="Editar comida"
        >
          <i class="fa fa-edit"></i>
        </button>
        
        <button 
          class="food-delete-btn p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 
            hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          data-food-id="${food.id}"
          title="Eliminar comida"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  // Event listeners
  const toggleBtn = card.querySelector('.food-toggle-status-btn') as HTMLButtonElement;
  const editBtn = card.querySelector('.food-edit-btn') as HTMLButtonElement;
  const deleteBtn = card.querySelector('.food-delete-btn') as HTMLButtonElement;
  const viewSalesBtn = card.querySelector('.food-view-sales-btn') as HTMLButtonElement;

  if (toggleBtn && onToggleStatus) {
    toggleBtn.addEventListener('click', () => onToggleStatus(food));
  }

  if (editBtn && onEdit) {
    editBtn.addEventListener('click', () => onEdit(food));
  }

  if (deleteBtn && onDelete) {
    deleteBtn.addEventListener('click', () => onDelete(food));
  }

  if (viewSalesBtn && onViewSales) {
    viewSalesBtn.addEventListener('click', () => onViewSales(food));
  }

  container.appendChild(card);
}

/**
 * Renderiza una lista de tarjetas de comida
 */
export function renderFoodCards(
  container: HTMLElement,
  foods: Food[],
  props: Omit<FoodCardProps, 'food'>
): void {
  container.innerHTML = '';
  
  if (foods.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-500 dark:text-gray-400">
        <i class="fa fa-utensils text-4xl mb-4"></i>
        <p class="text-lg">No hay comidas registradas</p>
        <p class="text-sm">Agrega tu primera comida para comenzar</p>
      </div>
    `;
    return;
  }

  foods.forEach(food => {
    renderFoodCard(container, { food, ...props });
  });
}
