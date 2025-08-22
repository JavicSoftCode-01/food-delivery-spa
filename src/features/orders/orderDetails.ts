import { UI } from '../../ui/ui';
import { FoodRepo } from '../../services/foodService';
import { OrderRepo } from '../../services/orderService';
import { formatCurrency, formatTime } from '../../utils';
import { handleDeliveryToggle } from '../../../src/features/orders/deliveryToggle';
import { showCallModal } from './callModal';

/** Muestra los detalles de un pedido en un modal y permite cambiar su estado. */
export function showOrderDetails(orderId: string, onUpdate: () => void) {
  const order = OrderRepo.findById(orderId);
  if (!order) { UI.toast('Pedido no encontrado'); return; }

  const food = FoodRepo.findById(order.foodId);
  if (!food) { UI.toast('Comida no encontrada para este pedido.'); return; }

  const combo = order.comboId ? food.combos.find(c => c.id === order.comboId) : null;
  const unitaryTotal = order.quantity * food.price;
  const comboTotal = combo && order.comboQuantity > 0 ? order.comboQuantity * combo.price : 0;
  const grandTotal = unitaryTotal + comboTotal;
  const totalItems = order.quantity + (order.comboQuantity || 0);

  const html = `
  <div class="flex flex-col h-full max-h-[90vh] text-sm sm:text-base bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
    <div class="flex-shrink-0 p-3 sm:p-4 border-b dark:border-dark-border flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar text-accent fa-2x"></i>
        <h3 class="text-base sm:text-xl font-bold truncate">Pedido de ${order.fullName}</h3>
      </div>
      <button id="closeDetails" class="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 flex-shrink-0">
        <i class="fa fa-times text-base"></i>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
      <div class="space-y-4">
        <div class="space-y-2 border-b dark:border-dark-border pb-2">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                <i class="fa fa-clock w-4 text-center"></i>Entrega: 
              </label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">${formatTime(order.delivered && order.deliveredAt ? order.deliveredAt : order.deliveryTime)}</div>
            </div>
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm"><i class="fa fa-map-marker-alt w-4 text-center"></i>Dirección:</label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">${order.deliveryAddress}</div>
            </div>
          </div>
        </div>
        <div class="border-b dark:border-dark-border">
          <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm"><i class="fa fa-bowl-food w-4 text-center"></i>Producto:</label>
          <div class="ml-6 py-1">
            <div class="flex justify-between items-center">
              <span class="font-medium text-sm">${food?.name || 'No encontrado'}</span>
              <span class="text-base text-gray-500">${formatCurrency(food.price)} c/u</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center border-b dark:border-dark-border">
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-shopping-cart text-sm"></i><span class="text-xs">Unitarios</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${order.quantity}</div>
          </div>
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-boxes-stacked text-sm"></i><span class="text-xs">Combos</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${order.comboQuantity || 0}</div>
          </div>
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-calculator text-sm"></i><span class="text-xs">Total Items</span></label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">${totalItems}</div>
          </div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-receipt"></i>Desglose de Precios</label>
          <div class="overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-left text-gray-500 dark:text-gray-400">
                  <th class="py-1 font-semibold">Tipo</th>
                  <th class="py-1 font-semibold text-center">Cant.</th>
                  <th class="py-1 font-semibold text-center">Precio</th>
                  <th class="py-1 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b dark:border-dark-border">
                  <td class="py-1 pr-2 text-xs">Venta Unitaria</td>
                  <td class="py-1 text-center text-xs">${order.quantity}</td>
                  <td class="py-1 text-center text-xs">${formatCurrency(food.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${formatCurrency(unitaryTotal)}</td>
                </tr>
                ${(combo && order.comboQuantity > 0) ? `
                <tr class="border-b dark:border-dark-border">
                  <td class="py-1 pr-2 text-xs">Combo (${combo!.quantity}u)</td>
                  <td class="py-1 text-center text-xs">${order.comboQuantity}</td>
                  <td class="py-1 text-center text-xs">${formatCurrency(combo!.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${formatCurrency(comboTotal)}</td>
                </tr>` : ''}
              </tbody>
            </table>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg border-t dark:border-dark-border p-2">
          <div class="text-center border-b dark:border-dark-border pb-2 mb-2">
            <label class="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Total del Pedido</label>
            <div class="font-bold text-green-700 dark:text-green-400 text-xl">${formatCurrency(grandTotal)}</div>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
            <button id="callFromDetails" data-phone="${order.phone}" class="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-sm">
              <i class="fa fa-phone"></i><span class="font-bold">Llamar</span>
            </button>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-300 font-semibold">Estado:</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium ${order.delivered ? 'text-green-600' : 'text-red-600'}">${order.delivered ? 'Entregado' : 'Pendiente'}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input id="detailsToggle" data-id="${order.id}" type="checkbox" ${order.delivered ? 'checked' : ''} class="sr-only">
                  <div id="toggleBg" class="w-10 h-5 ${order.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full relative transition-colors">
                    <div id="toggleDot" class="absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${order.delivered ? 'translate-x-5' : 'translate-x-0'}"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
  element.querySelector('#closeDetails')!.addEventListener('click', close);
  element.querySelector('#callFromDetails')!.addEventListener('click', (e) => {
    const p = (e.currentTarget as HTMLElement).dataset.phone!;
    showCallModal(p);
  });

  const toggle = element.querySelector('#detailsToggle') as HTMLInputElement;
  const updateToggleVisuals = (isDelivered: boolean) => {
    const freshOrder = OrderRepo.findById(orderId);
    if (!freshOrder) return;
    const toggleBg = element.querySelector('#toggleBg')!;
    const toggleDot = element.querySelector('#toggleDot')!;
    const statusText = (element.querySelector('#detailsToggle') as HTMLInputElement).parentElement?.previousElementSibling as HTMLElement;
    if (statusText) {
      statusText.textContent = isDelivered ? 'Entregado' : 'Pendiente';
      statusText.className = `text-sm font-medium ${isDelivered ? 'text-green-600' : 'text-red-600'}`;
    }
    if (toggleBg && toggleDot) {
      toggleBg.className = `w-10 h-5 ${isDelivered ? 'bg-green-600' : 'bg-red-500'} rounded-full relative transition-colors`;
      toggleDot.className = `absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isDelivered ? 'translate-x-5' : 'translate-x-0'}`;
    }
  };

  toggle.addEventListener('change', () => {
    const currentOrder = OrderRepo.findById(orderId);
    if (!currentOrder) return;
    handleDeliveryToggle(currentOrder, toggle, updateToggleVisuals, () => onUpdate());
  });
}


