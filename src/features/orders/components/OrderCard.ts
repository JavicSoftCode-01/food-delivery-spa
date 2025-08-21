// src/features/orders/components/OrderCard.ts
// Componente para mostrar un pedido individual en listas

import { Order, Food } from '../../../models';
import { formatCurrency, formatTime, formatName, formatPhoneDisplay } from '../../../utils';

export interface OrderCardProps {
  order: Order;
  food: Food;
  onViewDetails?: (order: Order) => void;
  onCall?: (phone: string) => void;
  onToggleDelivery?: (order: Order) => void;
}

/**
 * Renderiza una tarjeta de pedido
 */
export function renderOrderCard(
  container: HTMLElement,
  props: OrderCardProps
): void {
  const { order, food, onViewDetails, onCall, onToggleDelivery } = props;

  const card = document.createElement('div');
  card.className = `
    bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
    p-4 shadow-sm hover:shadow-md transition-all duration-200
    ${order.delivered ? 'ring-2 ring-green-200 dark:ring-green-800' : 'ring-2 ring-yellow-200 dark:ring-yellow-800'}
  `;

  const statusColor = order.delivered ? 'text-green-600' : 'text-yellow-600';
  const statusIcon = order.delivered ? 'fa-check-circle' : 'fa-clock';
  const statusText = order.delivered ? 'Entregado' : 'Pendiente';

  // Calcular totales
  const unitaryTotal = order.quantity * food.price;
  const combo = order.comboId ? food.combos.find(c => c.id === order.comboId) : null;
  const comboTotal = combo && order.comboQuantity > 0 ? order.comboQuantity * combo.price : 0;
  const grandTotal = unitaryTotal + comboTotal;

  card.innerHTML = `
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
          ${formatName(order.fullName)}
        </h3>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            <i class="fa fa-phone mr-1"></i>${formatPhoneDisplay(order.phone)}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            <i class="fa fa-clock mr-1"></i>${formatTime(order.deliveryTime)}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2 ml-3">
        <span class="text-sm ${statusColor} font-medium">
          <i class="fa ${statusIcon} mr-1"></i>
          ${statusText}
        </span>
      </div>
    </div>

    <div class="mb-3">
      <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        <i class="fa fa-utensils mr-1"></i>${formatName(food.name)}
      </div>
      <div class="grid grid-cols-3 gap-2 text-sm">
        <div class="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <div class="font-semibold text-gray-900 dark:text-white">${order.quantity}</div>
          <div class="text-gray-500 dark:text-gray-400">Unitarios</div>
        </div>
        <div class="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <div class="font-semibold text-gray-900 dark:text-white">${order.comboQuantity || 0}</div>
          <div class="text-gray-500 dark:text-gray-400">Combos</div>
        </div>
        <div class="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <div class="font-semibold text-gray-900 dark:text-white">${formatCurrency(grandTotal)}</div>
          <div class="text-gray-500 dark:text-gray-400">Total</div>
        </div>
      </div>
    </div>

    ${combo && order.comboQuantity > 0 ? `
      <div class="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
        <div class="text-sm text-blue-800 dark:text-blue-200">
          <i class="fa fa-boxes-stacked mr-1"></i>
          Combo: ${combo.quantity}u por ${formatCurrency(combo.price)}
        </div>
      </div>
    ` : ''}

    <div class="mb-3">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        <i class="fa fa-map-marker-alt mr-1"></i>
        <span class="font-medium">Dirección:</span> ${order.deliveryAddress}
      </div>
    </div>

    <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2">
        <button 
          class="order-toggle-delivery-btn px-3 py-1.5 text-xs font-medium rounded-md transition-colors
            ${order.delivered 
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800' 
              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
            }"
          data-order-id="${order.id}"
        >
          <i class="fa ${order.delivered ? 'fa-undo' : 'fa-check'} mr-1"></i>
          ${order.delivered ? 'Revertir' : 'Entregar'}
        </button>
        
        <button 
          class="order-call-btn px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 
            dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 rounded-md transition-colors"
          data-phone="${order.phone}"
        >
          <i class="fa fa-phone mr-1"></i>Llamar
        </button>
      </div>
      
      <button 
        class="order-view-details-btn px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 
          dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
        data-order-id="${order.id}"
      >
        <i class="fa fa-eye mr-1"></i>Ver Detalles
      </button>
    </div>
  `;

  // Event listeners
  const toggleBtn = card.querySelector('.order-toggle-delivery-btn') as HTMLButtonElement;
  const callBtn = card.querySelector('.order-call-btn') as HTMLButtonElement;
  const viewDetailsBtn = card.querySelector('.order-view-details-btn') as HTMLButtonElement;

  if (toggleBtn && onToggleDelivery) {
    toggleBtn.addEventListener('click', () => onToggleDelivery(order));
  }

  if (callBtn && onCall) {
    callBtn.addEventListener('click', () => onCall(order.phone));
  }

  if (viewDetailsBtn && onViewDetails) {
    viewDetailsBtn.addEventListener('click', () => onViewDetails(order));
  }

  container.appendChild(card);
}

/**
 * Renderiza una lista de tarjetas de pedidos
 */
export function renderOrderCards(
  container: HTMLElement,
  orders: Order[],
  foods: Food[],
  props: Omit<OrderCardProps, 'order' | 'food'>
): void {
  container.innerHTML = '';
  
  if (orders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-500 dark:text-gray-400">
        <i class="fa fa-shopping-cart text-4xl mb-4"></i>
        <p class="text-lg">No hay pedidos registrados</p>
        <p class="text-sm">Los pedidos aparecerán aquí cuando los clientes hagan sus órdenes</p>
      </div>
    `;
    return;
  }

  orders.forEach(order => {
    const food = foods.find(f => f.id === order.foodId);
    if (food) {
      renderOrderCard(container, { order, food, ...props });
    }
  });
}

/**
 * Renderiza una lista de tarjetas de pedidos filtrados por estado
 */
export function renderOrderCardsByStatus(
  container: HTMLElement,
  orders: Order[],
  foods: Food[],
  status: 'pending' | 'delivered',
  props: Omit<OrderCardProps, 'order' | 'food'>
): void {
  const filteredOrders = orders.filter(order => 
    status === 'pending' ? !order.delivered : order.delivered
  );
  
  renderOrderCards(container, filteredOrders, foods, props);
}
