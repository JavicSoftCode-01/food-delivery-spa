// src/ui/components.ts
import { UI } from './ui';
import { FoodRepo, FoodSaleRecordRepo } from '../services/foodService';
import { OrderRepo } from '../services/orderService';
import { formatCurrency, normalizeName, getSearchablePhone, formatPhoneForWhatsApp, formatTime, formatClockTime } from '../utils';
import { Order, Food, FoodSaleRecord } from '../models';
import { updateGlobalHeaderState } from '../main';

/** Shows a modal for calling the client via phone or WhatsApp. */
function showCallModal(phone: string) {
  const whatsappPhone = formatPhoneForWhatsApp(phone);
  const html = `<div class="relative">
    <button id="closeCall" class="absolute right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-55 z-10"><i class="fa fa-times text-lg"></i></button>
    <div class="text-center">
      <h3 class="text-lg font-semibold mb-4">Contactar Cliente <i class="fa fa-user"></i></h3>
      <div class="flex gap-3 justify-center">
        <button id="callPhone" class="flex flex-col items-center gap-2 p-4 border-2 dark:border-dark-border rounded-lg hover:bg-gray-75 dark:hover:bg-gray-700">
          <i class="fa-solid fa-phone-volume text-3xl text-blue-600"></i><span class="text-sm">Teléfono</span>
        </button>
        <button id="callWhatsApp" class="flex flex-col items-center gap-2 p-4 border-2 dark:border-dark-border rounded-lg hover:bg-gray-75 dark:hover:bg-gray-700">
          <i class="fab fa-whatsapp text-4xl text-green-600"></i><span class="text-sm">WhatsApp</span>
        </button>
      </div>
    </div>
  </div>`;

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
  element.querySelector('#closeCall')!.addEventListener('click', close);
  element.querySelector('#callPhone')!.addEventListener('click', () => {
    window.open(`tel:${phone}`);
    close();
  });
  element.querySelector('#callWhatsApp')!.addEventListener('click', () => {
    window.open(`https://wa.me/${whatsappPhone.replace(/\s/g, '')}`);
    close();
  });
}

/**
 * Muestra los detalles de un pedido en un modal profesional, claro y responsivo,
 * con scroll interno y cabecera fija siguiendo el patrón del modal de ventas.
 */
function showOrderDetails(orderId: string, onUpdate: () => void) {
  const order = OrderRepo.findById(orderId);
  if (!order) {
    UI.toast('Pedido no encontrado');
    return;
  }

  const food = FoodRepo.findById(order.foodId);
  if (!food) {
    UI.toast('Comida no encontrada para este pedido.');
    return;
  }

  const combo = order.comboId ? food.combos.find(c => c.id === order.comboId) : null;

  const unitaryTotal = order.quantity * food.price;
  let comboTotal = 0;
  let hasCombo = false;

  if (combo && order.comboQuantity > 0) {
    comboTotal = order.comboQuantity * combo.price;
    hasCombo = true;
  }

  const grandTotal = unitaryTotal + comboTotal;
  const totalItems = order.quantity + (order.comboQuantity || 0);

  const html = `
  <div class="flex flex-col h-full max-h-[90vh] text-sm sm:text-base bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
    
    <div class="flex-shrink-0 p-3 sm:p-4 border-b dark:border-dark-border flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar text-accent fa-2x"></i>
        <h3 class="text-base sm:text-xl font-bold truncate">
          Pedido de ${order.fullName}
        </h3>
      </div>
      <button id="closeDetails" class="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 flex-shrink-0">
        <i class="fa fa-times text-base"></i>
      </button>
    </div>

    <!-- CONTENIDO CON SCROLL INDEPENDIENTE -->
    <div class="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
      <div class="space-y-4">
        
        <!-- SECCIÓN 1: INFORMACIÓN DEL CLIENTE -->
        <div class="space-y-2 border-b dark:border-dark-border pb-2">
          <div class="grid grid-cols-2 gap-2">

            <!-- Entrega -->
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                <i class="fa fa-clock w-4 text-center"></i>Entrega:
              </label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">
                ${formatTime(order.deliveryTime)}
              </div>
            </div>

            <!-- Dirección -->
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                <i class="fa fa-map-marker-alt w-4 text-center"></i>Dirección:
              </label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6 text-sm">
                ${order.deliveryAddress}
              </div>
            </div>

          </div>
        </div>

        <!-- SECCIÓN 2: INFORMACIÓN DEL PRODUCTO -->
        <div class="border-b dark:border-dark-border">
          <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold text-sm">
            <i class="fa fa-bowl-food w-4 text-center"></i>Producto:
          </label>
          <div class="ml-6 py-1">
            <div class="flex justify-between items-center">
              <span class="font-medium text-sm">${food?.name || 'No encontrado'}</span>
              <span class="text-base text-gray-500">${formatCurrency(food.price)} c/u</span>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 3: RESUMEN DE CANTIDADES -->
        <div class="grid grid-cols-3 gap-2 text-center border-b dark:border-dark-border">

          <!-- Unitarios -->
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
              <i class="fa fa-shopping-cart text-sm"></i>
              <span class="text-xs">Unitarios</span>
            </label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">
              ${order.quantity}
            </div>
          </div>

          <!-- Combos -->
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
              <i class="fa fa-boxes-stacked text-sm"></i>
              <span class="text-xs">Combos</span>
            </label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">
              ${order.comboQuantity || 0}
            </div>
          </div>

          <!-- Total Items -->
          <div>
            <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
              <i class="fa fa-calculator text-sm"></i>
              <span class="text-xs">Total Items</span>
            </label>
            <div class="text-gray-900 dark:text-dark-text text-lg font-bold">
              ${totalItems}
            </div>
          </div>

        </div>


        <!-- SECCIÓN 4: DESGLOSE DE PRECIOS -->
        <div class="">
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa fa-receipt"></i>Desglose de Precios
          </label>
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
                ${hasCombo ? `
                <tr class="border-b dark:border-dark-border">
                  <td class="py-1 pr-2 text-xs">Combo (${combo!.quantity}u)</td>
                  <td class="py-1 text-center text-xs">${order.comboQuantity}</td>
                  <td class="py-1 text-center text-xs">${formatCurrency(combo!.price)}</td>
                  <td class="py-1 text-right font-semibold text-xs">${formatCurrency(comboTotal)}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>

        <!-- SECCIÓN 5: TOTAL Y ACCIONES -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg border-t dark:border-dark-border p-2">
          <div class="text-center border-b dark:border-dark-border pb-2 mb-2">
            <label class="flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <i class="fa fa-coins"></i>Total del Pedido
            </label>
            <div class="font-bold text-green-700 dark:text-green-400 text-xl">
              ${formatCurrency(grandTotal)}
            </div>
          </div>
          
          <!-- ACCIONES -->
          <div class="flex flex-col sm:flex-row justify-between items-center gap-2">
            <button id="callFromDetails" data-phone="${order.phone}" 
                    class="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-sm">
              <i class="fa fa-phone"></i>
              <span class="font-bold">Llamar</span>
            </button>
            
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                Estado:
              </span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium ${order.delivered ? 'text-green-600' : 'text-red-600'}">
                  ${order.delivered ? 'Entregado' : 'Pendiente'}
                </span>
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

  // --- Lógica para mostrar el modal y bloquear scroll del fondo ---
  document.documentElement.style.overflow = 'hidden';

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });

  const closeModalAndRestoreScroll = () => {
    close();
    document.documentElement.style.overflow = '';
  };

  // --- Event Listeners ---
  element.querySelector('#closeDetails')!.addEventListener('click', closeModalAndRestoreScroll);

  element.querySelector('#callFromDetails')!.addEventListener('click', (e) => {
    const phone = (e.currentTarget as HTMLElement).dataset.phone!;
    showCallModal(phone);
  });

  const toggle = element.querySelector('#detailsToggle') as HTMLInputElement;

  const updateToggleVisuals = (isDelivered: boolean) => {
    const toggleBg = element.querySelector('#toggleBg')!;
    const toggleDot = element.querySelector('#toggleDot')!;
    const statusText = element.querySelector('.text-sm.font-medium')!;

    toggleBg.className = `w-10 h-5 ${isDelivered ? 'bg-green-600' : 'bg-red-500'} rounded-full relative transition-colors`;
    toggleDot.className = `absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isDelivered ? 'translate-x-5' : 'translate-x-0'}`;
    statusText.textContent = isDelivered ? 'Entregado' : 'Pendiente';
    statusText.className = `text-sm font-medium ${isDelivered ? 'text-green-600' : 'text-red-600'}`;
  };

  toggle.addEventListener('change', () => {
    const currentOrder = OrderRepo.findById(orderId);
    if (!currentOrder) return;

    handleDeliveryToggle(currentOrder, toggle, updateToggleVisuals, () => {
      onUpdate();
      // La vista se actualiza, no es necesario reabrir el modal.
      // Si se cierra, el usuario pierde el contexto.
      // closeModalAndRestoreScroll(); 
    });
  });
}

/** Renders the dashboard screen. */
export function renderDashboard(container: HTMLElement): void {
  const foods = FoodRepo.getAll();
  const orders = OrderRepo.getSorted().filter((o) => o.state);
  const pending = orders.filter((o) => !o.delivered).length;
  const delivered = orders.filter((o) => o.delivered).length;
  const revenue = FoodRepo.totalProfit();

  container.innerHTML = `<section class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="dashboard-card p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fa fa-clock text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Pendientes</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${pending}</div>
      </div>
      
      <div class="dashboard-card p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <i class="fa fa-check text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Entregados</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${delivered}</div>
      </div>
      
      <div class="dashboard-card p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <i class="fa fa-utensils text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Productos</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${foods.length}</div>
      </div>
      
      <div class="dashboard-card p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <i class="fa fa-dollar-sign text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Beneficios</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${formatCurrency(revenue)}</div>
      </div>
    </div>
    
    <div class="flex gap-2">
      <button id="btnAddOrderQuick" class="flex-1 px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-plus fa-lg"></i>
          <span class="text-base font-semibold">Nuevo pedido</span>
        </div>
      </button>
      <button id="btnAddFoodQuick" class="flex-1 px-2 py-2 border border-gray-300 dark:border-dark-border hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 rounded-lg font-medium transition-all duration-200">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-utensils fa-lg"></i>
          <span class="text-base font-semibold">Nueva comida</span>
        </div>
      </button>
    </div>
  </section>`;

  // Add staggered animation entrance effect
  const cards = container.querySelectorAll('.dashboard-card');
  cards.forEach((card, index) => {
    const element = card as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';

    setTimeout(() => {
      element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });

  // Event listeners with haptic feedback simulation
  container.querySelector('#btnAddOrderQuick')?.addEventListener('click', (e) => {
    const button = e.currentTarget as HTMLElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
      document.dispatchEvent(new CustomEvent('openOrderForm'));
    }, 100);
  });

  container.querySelector('#btnAddFoodQuick')?.addEventListener('click', (e) => {
    const button = e.currentTarget as HTMLElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
      document.dispatchEvent(new CustomEvent('openFoodForm'));
    }, 100);
  });

  UI.updateHeaderContent;
}

/**
 * Muestra los detalles de un registro de venta en un modal profesional, claro y responsivo,
 * con scroll interno y cabecera fija.
 */
function showSalesRecordDetails(record: FoodSaleRecord, food: Food, onBackToHistory: () => void) {
  // --- 1. Cálculos iniciales (se mantienen igual) ---
  const singleItemsSold = record.quantitySoldSingle || 0;
  const comboSalesEntries = Object.entries(record.comboSales || {});
  const totalSingleRevenue = singleItemsSold * record.unitPrice;
  let totalItemsFromCombos = 0;
  let totalComboRevenue = 0;
  comboSalesEntries.forEach(([_, sale]) => {
    totalItemsFromCombos += sale.quantity * sale.count;
    totalComboRevenue += sale.price * sale.count;
  });
  const totalSoldItems = singleItemsSold + totalItemsFromCombos;
  const totalRevenue = totalSingleRevenue + totalComboRevenue;
  const totalProfit = totalRevenue - (totalSoldItems * record.unitCost);

  // --- 2. Generación del HTML para la tabla de desglose de ventas (sin cambios) ---
  const salesBreakdownHtml = `
        <tr class="border-b dark:border-dark-border">
            <td class="py-2 pr-2">Venta Unitaria</td>
            <td class="py-2 text-center">${singleItemsSold}</td>
            <td class="py-2 text-center">${formatCurrency(record.unitPrice)}</td>
            <td class="py-2 text-right font-semibold">${formatCurrency(totalSingleRevenue)}</td>
        </tr>
        ${comboSalesEntries.map(([_, sale]) => `
        <tr class="border-b dark:border-dark-border">
            <td class="py-2 pr-2">Combo (${sale.quantity}u) x ${sale.count}</td>
            <td class="py-2 text-center">${sale.quantity * sale.count}</td>
            <td class="py-2 text-center">${formatCurrency(sale.price)}</td>
            <td class="py-2 text-right font-semibold">${formatCurrency(sale.price * sale.count)}</td>
        </tr>
        `).join('')}
    `;

  // --- 3. Estructura del Modal con Flexbox para scroll interno y cabecera fija ---
  const html = `
    <div class="flex flex-col h-full max-h-[90vh] text-sm sm:text-base bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      <div class="flex-shrink-0 p-3 sm:p-4 border-b dark:border-dark-border flex items-center justify-between gap-4">
        <button id="backToHistoryList" class="text-accent hover:underline flex items-center gap-1.5 text-sm">
          <i class="fa fa-arrow-left"></i>
          <span class="hidden sm:inline">Volver</span>
        </button>
        <h3 class="text-base sm:text-xl font-bold text-center truncate">
          Detalles ${record.recordDate}
        </h3>
        <button id="closeRecordDetails" class="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 flex-shrink-0">
          <i class="fa fa-times text-base"></i>
        </button>
      </div>

      <!-- CONTENIDO CON SCROLL INDEPENDIENTE -->
      <div class="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
        <div>
          <!-- SECCIÓN 1: INFORMACIÓN GENERAL -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-b dark:border-dark-border pb-2">
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-bowl-food w-4 text-center"></i>Comida:</label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6">${food.name}</div>
            </div>
            <div>
              <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-clock w-4 text-center"></i>Horario:</label>
              <div class="text-gray-900 dark:text-dark-text font-medium pl-6">${formatClockTime(record.startTime)} - ${formatClockTime(record.endTime)}</div>
            </div>
          </div>

          <!-- SECCIÓN 2: RESUMEN DE INVENTARIO -->
          <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center mt-3">
            <div>
              <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                <i class="fa-solid fa-boxes-stacked"></i> Stock
              </label>
              <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">
                ${record.initialStock}
              </div>
            </div>

            <div>
              <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                <i class="fa fa-shopping-cart"></i> Vendido
              </label>
              <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">
                ${totalSoldItems}
              </div>
            </div>

            <div>
              <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                <i class="fa-solid fa-box"></i> Disponible
              </label>
              <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">
                ${record.initialStock - totalSoldItems}
              </div>
            </div>
          </div>

          
          <!-- SECCIÓN 3: DESGLOSE DE VENTAS -->
          <div class="border-t dark:border-dark-border pt-3">
            <label class="flex items-center gap-2 text-base sm:text-lg text-gray-600 dark:text-gray-300 font-semibold mb-2"><i class="fa fa-receipt"></i>Desglose de Ventas</label>
            <div class="overflow-x-auto">
              <table class="w-full text-xs sm:text-sm">
                <thead>
                  <tr class="text-left text-gray-500 dark:text-gray-400">
                    <th class="py-1 font-semibold">Tipo</th>
                    <th class="py-1 font-semibold text-center">Unidades</th>
                    <th class="py-1 font-semibold text-center">Precio</th>
                    <th class="py-1 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>${salesBreakdownHtml}</tbody>
              </table>
            </div>
          </div>
          
          <!-- SECCIÓN 4: RESUMEN FINANCIERO -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
             <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center">
               <div>
                  <label class="text-xs sm:text-sm text-gray-500">Costo Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${formatCurrency(record.unitCost)}</div>
               </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Precio Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${formatCurrency(record.unitPrice)}</div>
               </div>
               <div>
                  <label class="text-xs sm:text-sm text-gray-500">Lucro Unit.</label>
                  <div class="font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400">${formatCurrency(record.unitPrice - record.unitCost)}</div>
               </div>
             </div>
             <div class="grid grid-cols-2 gap-2 sm:gap-4 pt-3 border-t dark:border-dark-border text-center">
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-piggy-bank"></i>Lucro Total</label>
                  <div class="font-bold text-blue-700 dark:text-blue-400 text-xl sm:text-2xl">${formatCurrency(totalProfit)}</div>
                </div>
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Venta Total</label>
                  <div class="font-bold text-green-700 dark:text-green-400 text-xl sm:text-2xl">${formatCurrency(totalRevenue)}</div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>`;

  // --- 4. Lógica para mostrar el modal y BLOQUEAR el scroll del fondo ---

  // Bloquea el scroll de la página principal
  document.documentElement.style.overflow = 'hidden';

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });

  const closeModalAndRestoreScroll = () => {
    close();
    // Restaura el scroll de la página principal
    document.documentElement.style.overflow = '';
  };

  element.querySelector('#closeRecordDetails')!.addEventListener('click', closeModalAndRestoreScroll);
  element.querySelector('#backToHistoryList')!.addEventListener('click', () => {
    closeModalAndRestoreScroll();
    onBackToHistory();
  });
}

/** Opens a modal showing sales history for a food. */
function openSalesHistoryModal(foodId: string) {
  const food = FoodRepo.findById(foodId);
  if (!food) {
    UI.toast('Comida no encontrada');
    return;
  }

  const history = FoodSaleRecordRepo.findByFoodId(foodId);
  let historyModalRef: { close: () => void; element: HTMLElement } | null = null;

  const showHistoryModal = () => {
    let listContent;
    if (history.length === 0) {
      listContent = `<div class="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center gap-2"><i class="fa fa-inbox text-3xl opacity-50"></i><p>No hay historial de ventas para esta comida.</p></div>`;
    } else {
      const listItems = history
        .map((record) => {
          const singleItemsSold = record.quantitySoldSingle || 0;
          const totalItemsFromCombos = Object.values(record.comboSales || {}).reduce((acc, comboSale) => acc + (comboSale.count * comboSale.quantity), 0);
          const totalSoldItems = singleItemsSold + totalItemsFromCombos;

          const totalSingleRevenue = singleItemsSold * record.unitPrice;
          const totalComboRevenue = Object.values(record.comboSales || {}).reduce((acc, comboSale) => acc + (comboSale.count * comboSale.price), 0);
          const totalRevenue = totalSingleRevenue + totalComboRevenue;

          return `
            <div class="border-b dark:border-dark-border last:border-b-0">
              <button data-record-id="${record.id}" class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 record-detail-btn transition-colors">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full ${record.isActive ? 'bg-green-500' : 'bg-gray-400'}"></div>
                    <div>
                      <div class="font-medium text-gray-900 dark:text-dark-text">
                        <i class="fa fa-calendar-day mr-2 text-gray-400"></i>
                        ${record.recordDate}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        ${formatClockTime(record.startTime)} - ${formatClockTime(record.endTime)}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-gray-900 dark:text-dark-text">
                      Vendí: <span class="text-gray-600 dark:text-gray-300">${totalSoldItems}</span>
                    </div>
                    <div class="text-base font-bold text-green-600">
                      ${formatCurrency(totalRevenue)}
                    </div>
                  </div>
                </div>
              </button>
            </div>`;
        })
        .join('');
      listContent = `<div class="bg-white dark:bg-dark-bg rounded-lg border dark:border-dark-border divide-y dark:divide-dark-border">${listItems}</div>`;
    }

    const historyHtml = `
      <div class="relative max-h-[80vh] overflow-y-auto">
        <button id="closeHistoryModal" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20">
          <i class="fa fa-times text-lg"></i>
        </button>
        <div class="pr-8 p-4">
          <h3 class="text-xl font-bold mb-4 text-center">
            <i class="fa fa-history mr-2"></i>Historial: ${food.name}
          </h3>
          <div class="max-h-96 overflow-y-auto">
            ${listContent}
          </div>
        </div>
      </div>`;

    historyModalRef = UI.modal(historyHtml, { closeOnBackdropClick: false });
    historyModalRef.element.querySelector('#closeHistoryModal')!.addEventListener('click', historyModalRef.close);

    historyModalRef.element.querySelectorAll('.record-detail-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const recordId = (e.currentTarget as HTMLElement).dataset.recordId!;
        const selectedRecord = history.find((r) => r.id === recordId)!;
        const currentClose = historyModalRef!.close;
        currentClose();
        showSalesRecordDetails(selectedRecord, food, showHistoryModal);
      });
    });
  };

  showHistoryModal();
}

/** Renders the foods screen. */
export function renderFoods(container: HTMLElement): void {
  container.innerHTML = `<div class="food-container bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-20 opacity-0 transform translate-y-4">
    <div class="flex gap-2 items-center">
      <input id="inputFilterFood" placeholder="Buscar por comida..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
      <button id="btnAddFood" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95">
        <i class="fa-solid fa-plus fa-lg"></i>
      </button>
    </div>
    <div id="foodsList" class="space-y-3"></div>
  </div>`;

  // Animación de entrada del contenedor
  const mainContainer = container.querySelector('.food-container') as HTMLElement;
  requestAnimationFrame(() => {
    mainContainer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    mainContainer.style.opacity = '1';
    mainContainer.style.transform = 'translateY(0)';
  });

  const filterInp = container.querySelector('#inputFilterFood') as HTMLInputElement;
  const foodsListContainer = container.querySelector('#foodsList')!;

  function refreshFoodListView() {
    const allFoods = FoodRepo.getAll();
    const filterText = normalizeName(filterInp.value).toLowerCase();
    const filteredFoods = filterText
      ? allFoods.filter((food) => normalizeName(food.name).toLowerCase().includes(filterText))
      : allFoods;
    renderFoodList(filteredFoods);
  }

  const renderFoodList = (list: Food[]) => {
    foodsListContainer.innerHTML = '';
    if (list.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'text-gray-500 dark:text-gray-400 text-center py-8 opacity-0 transform translate-y-4';
      emptyState.innerHTML = `
        <i class="fa fa-bowl-food text-4xl mb-2 opacity-50"></i>
        <p>Sin resultados.</p>`;
      foodsListContainer.appendChild(emptyState);

      // Animación del estado vacío
      requestAnimationFrame(() => {
        emptyState.style.transition = 'all 0.4s ease-out';
        emptyState.style.opacity = '1';
        emptyState.style.transform = 'translateY(0)';
      });
      return;
    }

    list.forEach((f, index) => {
      const row = document.createElement('div');
      row.className = `food-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] opacity-0 transform translate-y-4 ${!f.isActive ? 'opacity-60' : ''}`;
      row.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl text-gray-900 dark:text-white">${f.name}</div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${f.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}">
              <i class="fa ${f.isActive ? 'fa-check-circle' : 'fa-times-circle'} mr-1 text-base"></i>
              ${f.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <i class="fa-solid fa-shopping-cart text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${f.amountSold || 0}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/30">
            <i class="fa-solid fa-boxes-stacked text-orange-500 text-2xl"></i>
            <span class="font-semibold">
              <strong>${f.stock - OrderRepo.getReservedStockForFood(f.id)}</strong>
              <span class="text-xs text-gray-500">(${f.stock})</span>
            </span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30">
            <i class="fa-solid fa-dollar-sign text-green-500 text-2xl"></i>
            <span class="font-semibold"><strong>${formatCurrency(f.price)}</strong></span>
          </div>
        </div>
        <div class="flex gap-2">
          <button data-id="${f.id}" class="salesHistoryBtn flex-1 px-1 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-history text-lg"></i>
            Historial
          </button>
          <button data-id="${f.id}" class="editFood flex-1 px-1 py-1 bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa-solid fa-store text-lg"></i>
            Venta
          </button>
        </div>`;
      foodsListContainer.appendChild(row);

      // Animación escalonada para cada item
      setTimeout(() => {
        row.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        row.style.opacity = f.isActive ? '1' : '0.6';
        row.style.transform = 'translateY(0)';
      }, index * 100);
    });

    // Event listeners después de que se rendericen todos los items
    setTimeout(() => {
      foodsListContainer.querySelectorAll<HTMLElement>('.editFood').forEach((b) => {
        b.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          // Feedback visual en el botón
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            document.dispatchEvent(
              new CustomEvent('openFoodForm', {
                detail: { id: button.dataset.id! },
              })
            );
          }, 100);
        });
      });

      foodsListContainer.querySelectorAll<HTMLElement>('.salesHistoryBtn').forEach((b) => {
        b.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          const foodId = button.dataset.id!;
          // Feedback visual en el botón
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            openSalesHistoryModal(foodId);
          }, 100);
        });
      });
    }, list.length * 100 + 100);
  };

  filterInp.addEventListener('input', refreshFoodListView);

  container.querySelector('#btnAddFood')?.addEventListener('click', (e) => {
    const button = e.currentTarget as HTMLElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
      document.dispatchEvent(new CustomEvent('openFoodForm'));
    }, 100);
  });

  document.addEventListener('refreshViews', refreshFoodListView);
  refreshFoodListView();
}

/** Renders the settings screen. */
export function renderSettings(container: HTMLElement): void {
  // Leer meta actual
  const metaRaw = localStorage.getItem('fd_meta_v1') || '{}';
  let meta: { deliveryGapMinutes?: number; darkMode?: boolean } = {};
  try { meta = JSON.parse(metaRaw) || {}; } catch { meta = {}; }

  const gap = meta.deliveryGapMinutes ?? 15;
  const dark = !!meta.darkMode;

  // HTML con diseño mejorado y más compacto
  container.innerHTML = `
    <section class="space-y-4">
      <!-- Header Card -->
      <div class="settings-header bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm opacity-0 transform translate-y-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <i class="fa fa-gear text-xl"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Configuración</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Personaliza tu experiencia</p>
          </div>
        </div>
      </div>

      <!-- Settings Cards -->
      <div class="space-y-3">
        <!-- Intervalo Card -->
        <div class="settings-card bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300 opacity-0 transform translate-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <i class="fa fa-clock text-orange-600 dark:text-orange-400 fa-lg"></i>
              </div>
              <div>
                <div class="font-medium text-base text-gray-900 dark:text-white">Intervalo</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">De entregas</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input id="inputGap" type="number" min="0" max="120" value="${gap}" 
                     class="w-16 px-2 py-1.5 border dark:border-dark-border rounded-lg text-center text-sm bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
            </div>
          </div>
        </div>

        <!-- Tema Card -->
        <div class="settings-card bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300 opacity-0 transform translate-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div id="themeIconContainer" class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <i id="themeIcon" class="${dark ? 'fa-solid fa-cloud-moon text-purple-600 dark:text-purple-400' : 'fa-solid fa-cloud-sun text-purple-600 dark:text-purple-400'}"></i>
              </div> 
              <div>
                <div class="font-medium text-base text-gray-900 dark:text-white">Tema</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Oscuro o Claro</div>
              </div>
            </div>
            <div>
              <button id="themeToggle" aria-pressed="${dark}" title="${dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}" 
                      class="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${dark ? 'bg-blue-600' : 'bg-gray-300'}">
                <span class="sr-only">Cambiar tema</span>
                <span id="toggleDot" class="inline-block w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${dark ? 'translate-x-6' : 'translate-x-1'}"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Info Card
        <div class="settings-card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50 opacity-0 transform translate-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <i class="fa fa-info text-white"></i>
            </div>
            <div>
              <div class="font-medium text-blue-900 dark:text-blue-100">Sistema actualizado</div>
              <div class="text-sm text-blue-700 dark:text-blue-300">Todas las configuraciones se guardan automáticamente</div>
            </div>
          </div>
        </div> -->
      </div>
    </section>
  `;

  // Animaciones de entrada escalonadas
  const animatedElements = container.querySelectorAll('.settings-header, .settings-card');
  animatedElements.forEach((element, index) => {
    const el = element as HTMLElement;
    setTimeout(() => {
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 100);
  });

  // Referencias
  const gapInput = container.querySelector('#inputGap') as HTMLInputElement | null;
  const themeToggle = container.querySelector('#themeToggle') as HTMLButtonElement | null;
  const themeIcon = container.querySelector('#themeIcon') as HTMLElement | null;
  const toggleDot = container.querySelector('#toggleDot') as HTMLElement | null;

  // Aplica modo oscuro en DOM y persiste
  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Animación del toggle
    if (themeToggle && toggleDot) {
      themeToggle.classList.toggle('bg-blue-600', isDark);
      themeToggle.classList.toggle('bg-gray-300', !isDark);
      toggleDot.classList.toggle('translate-x-6', isDark);
      toggleDot.classList.toggle('translate-x-1', !isDark);
    }

    // Actualizar icono con animación
    if (themeIcon) {
      themeIcon.style.transform = 'scale(0.8)';
      themeIcon.style.opacity = '0.5';

      setTimeout(() => {
        themeIcon.className = isDark ? 'fa-solid fa-cloud-moon fa-lg text-purple-600 dark:text-purple-400' : 'fa-solid fa-cloud-sun fa-lg text-purple-600 dark:text-purple-400';
        themeIcon.style.transform = 'scale(1)';
        themeIcon.style.opacity = '1';
      }, 150);
    }

    // Persistir meta
    const currentMetaRaw = localStorage.getItem('fd_meta_v1') || '{}';
    let currentMeta: any = {};
    try { currentMeta = JSON.parse(currentMetaRaw) || {}; } catch { currentMeta = {}; }
    currentMeta.darkMode = !!isDark;
    localStorage.setItem('fd_meta_v1', JSON.stringify(currentMeta));
  };

  // Handlers con feedback visual
  const onGapChange = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const v = Number(input.value || 0);

    // Validación visual
    if (v < 0 || v > 120) {
      input.style.borderColor = '#ef4444';
      setTimeout(() => {
        input.style.borderColor = '';
      }, 1500);
      return;
    }

    // Feedback visual de éxito
    input.style.borderColor = '#10b981';
    input.style.backgroundColor = '#f0fdf4';

    setTimeout(() => {
      input.style.borderColor = '';
      input.style.backgroundColor = '';
    }, 1000);

    const mRaw = localStorage.getItem('fd_meta_v1') || '{}';
    let m: any = {};
    try { m = JSON.parse(mRaw) || {}; } catch { m = {}; }
    m.deliveryGapMinutes = v;
    localStorage.setItem('fd_meta_v1', JSON.stringify(m));
    UI.toast('Intervalo actualizado correctamente');
  };

  const onThemeToggle = () => {
    const current = document.documentElement.classList.contains('dark');
    const next = !current;

    // Animación del botón
    if (themeToggle) {
      themeToggle.style.transform = 'scale(0.95)';
      setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
      }, 100);
    }

    applyDarkMode(next);
    UI.toast(`Modo ${next ? 'oscuro' : 'claro'} activado`);

    // Actualizar header/global state si es necesario
    if (typeof updateGlobalHeaderState === 'function') {
      updateGlobalHeaderState();
    }
  };

  // Bind eventos
  gapInput?.addEventListener('change', onGapChange);
  gapInput?.addEventListener('input', (e) => {
    const input = e.currentTarget as HTMLInputElement;
    const v = Number(input.value);
    if (v < 0 || v > 120) {
      input.style.borderColor = '#ef4444';
    } else {
      input.style.borderColor = '';
    }
  });

  themeToggle?.addEventListener('click', onThemeToggle);

  // Estado inicial
  applyDarkMode(dark);
}

/** Handles toggling delivery status with confirmation. */
/** Handles toggling delivery status with robust confirmation and spinner. */
export function handleDeliveryToggle(
  order: Order,
  toggle: HTMLInputElement,
  updateVisuals: (isDelivered: boolean) => void,
  onUpdate: () => void
) {
  const isChecked = toggle.checked;
  const actionText = isChecked ? 'ENTREGAR' : 'REVERTIR ENTREGA';

  // Revertir estado visual INMEDIATAMENTE antes de mostrar confirmación
  toggle.checked = !isChecked;
  updateVisuals(!isChecked);

  const confirmMessage = `
    <div class="">
      <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div class="font-bold text-lg text-gray-900 dark:text-white"><i class="fa fa-user text-blue-500"></i> ${order.fullName}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400"><i class="fa-solid fa-location-dot text-red-500"></i> ${order.deliveryAddress}</div>
        <div class="font-semibold text-gray-600 dark:text-gray-400 pb-3"><i class="fa fa-clock text-blue-500"></i> ${formatTime(order.deliveryTime)}</div>
        
        <div class="font-semibold text-gray-600 dark:text-gray-400 pb-3"><i class="fa fa-mobile text-indigo-500"></i> ${order.phone}</div>
       
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
          <div class="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
            <i class="fa fa-info-circle fa-lg"></i>
            <span class="font-medium"><div class="text-lg font-bold">${actionText} PEDIDO</div></span>
          </div>
        </div>

      </div>
    </div>
  `;

  UI.confirm(
    confirmMessage,
    () => {
      // ✅ USUARIO CONFIRMÓ LA ACCIÓN - PROCEDER
      UI.showSpinner(`${isChecked ? 'Entregando' : 'Revirtiendo'} pedido...`);

      setTimeout(async () => {
        try {
          // Llama a la nueva función específica para cambiar el estado de entrega
          const success = await OrderRepo.updateDeliveryStatus(order.id, isChecked);

          if (success) {
            // ✅ ACTUALIZACIÓN EXITOSA - Restaurar estado visual correcto
            toggle.checked = isChecked;
            updateVisuals(isChecked);

            // Actualizar estado global y refrescar vista
            updateGlobalHeaderState();
            onUpdate();

            // Toast de éxito con feedback robusto
            const successMessage = isChecked
              ? `Pedido ENTREGADO a ${order.fullName}`
              : `Entrega REVERTIDA para ${order.fullName}`;

            UI.toast(successMessage);

            console.log(`✅ Pedido ${order.id} - Estado cambiado a: ${isChecked ? 'ENTREGADO' : 'PENDIENTE'}`);

          } else {
            // ❌ ERROR EN ACTUALIZACIÓN - Mantener estado revertido
            console.error('❌ Error: OrderRepo.update retornó false');
            UI.toast('❌ Error: No se pudo actualizar el pedido');
          }

        } catch (error) {
          // ❌ EXCEPCIÓN - Mantener estado revertido
          console.error('❌ Excepción al actualizar pedido:', error);
          UI.toast('❌ Error crítico al actualizar el pedido');
        } finally {
          UI.hideSpinner();
        }
      }, 150); // Delay para mostrar spinner
    },
    () => {
      // ❌ USUARIO CANCELÓ - El estado ya se revirtió arriba, no hacer nada
      console.log('🚫 Usuario canceló el cambio de estado del pedido');
    }
  );
}


/** Renders the clients. */
export function renderClients(container: HTMLElement): void {
  container.innerHTML = `
    <div class="clients-container bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-20 opacity-0 transform translate-y-4">
      <div class="flex gap-2 items-center">
        <input id="inputFilterPhone" placeholder="Buscar por nombre o teléfono..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" inputmode="text" />
        <button id="btnAddOrder" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95">
          <i class="fa-solid fa-plus fa-lg"></i>
        </button>
      </div>
      <div id="ordersList" class="space-y-3"></div>
    </div>`;

  // Animación de entrada del contenedor
  const mainContainer = container.querySelector('.clients-container') as HTMLElement;
  requestAnimationFrame(() => {
    mainContainer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    mainContainer.style.opacity = '1';
    mainContainer.style.transform = 'translateY(0)';
  });

  const filterInp = container.querySelector('#inputFilterPhone') as HTMLInputElement;
  const ordersListContainer = container.querySelector('#ordersList')!;

  function refreshListView() {
    const list = OrderRepo.getSorted();
    const filterText = filterInp.value.toLowerCase().trim();

    if (!filterText) {
      renderList(list);
      return;
    }

    const searchablePhoneTerm = getSearchablePhone(filterText);

    const filtered = list.filter(order => {
      const nameMatch = normalizeName(order.fullName).toLowerCase().includes(filterText);

      let phoneMatch = false;
      if (searchablePhoneTerm.length > 0) {
        const orderPhoneAsSearchable = getSearchablePhone(order.phone);
        phoneMatch = orderPhoneAsSearchable.includes(searchablePhoneTerm);
      }

      return nameMatch || phoneMatch;
    });

    renderList(filtered);
  }

  const renderList = (list: Order[]) => {
    ordersListContainer.innerHTML = '';
    if (!list.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'text-gray-500 dark:text-gray-400 text-center py-8 opacity-0 transform translate-y-4';
      emptyState.innerHTML = `
        <i class="fa-solid fa-bag-shopping text-4xl mb-2 opacity-50"></i>
        <p>Sin resultados.</p>`;
      ordersListContainer.appendChild(emptyState);

      // Animación del estado vacío
      requestAnimationFrame(() => {
        emptyState.style.transition = 'all 0.4s ease-out';
        emptyState.style.opacity = '1';
        emptyState.style.transform = 'translateY(0)';
      });
      return;
    }

    list.forEach((o, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = `order-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] opacity-0 transform translate-y-4 ${o.delivered ? 'opacity-60' : ''}`;
      wrapper.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl flex items-center min-w-0">
            <i class="fa fa-user mr-2 shrink-0 text-blue-500"></i>
            <span class="truncate text-gray-900 dark:text-white" title="${o.fullName}">${o.fullName}</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${o.delivered ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}">
              <i class="fa ${o.delivered ? 'fa-check-circle' : 'fa-times-circle'} mr-1 text-base"></i>
              ${o.delivered ? 'Entregado' : 'Pendiente'}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <i class="fa fa-clock text-blue-500 text-2xl"></i>
            <span class="font-semibold">
                <strong>
                  ${new Date(o.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </strong>
              </span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
            <i class="fa fa-mobile text-indigo-500 text-2xl"></i>
            <span class="font-semibold"><strong>${o.phone}</strong></span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button data-phone="${o.phone}" class="callBtn flex-1 px-1 py-[17.5px] bg-green-500 text-white rounded flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-phone fa-lg"></i>
          </button>
          <button data-id="${o.id}" class="viewOrder flex-1 px-1 py-[17.5px] bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-eye fa-lg"></i>
          </button>
          <button data-id="${o.id}" class="editOrder flex-1 px-1 py-[17.5px] bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa-solid fa-pencil fa-lg"></i>
          </button>
          <label class="relative inline-flex items-center cursor-pointer ml-2">
            <input data-id="${o.id}" type="checkbox" ${o.delivered ? 'checked' : ''} class="sr-only deliveredToggle">
            <div class="toggle-bg w-11 h-6 ${o.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full transition-all duration-300">
              <div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${o.delivered ? 'translate-x-5' : 'translate-x-0'}"></div>
            </div>
          </label>
        </div>
      `;

      ordersListContainer.appendChild(wrapper);

      // Animación escalonada para cada item
      setTimeout(() => {
        wrapper.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        wrapper.style.opacity = o.delivered ? '0.6' : '1';
        wrapper.style.transform = 'translateY(0)';
      }, index * 100);
    });

    // Event listeners después de que se rendericen todos los items
    setTimeout(() => {
      // delivered toggle handlers
      ordersListContainer.querySelectorAll<HTMLInputElement>('.deliveredToggle').forEach(inp => {
        inp.addEventListener('change', e => {
          const toggle = e.currentTarget as HTMLInputElement;
          const id = toggle.dataset.id!;
          const order = OrderRepo.findById(id);
          if (order) {
            const updateVisuals = (isDelivered: boolean) => {
              const bg = toggle.nextElementSibling!;
              const dot = bg.firstElementChild!;
              bg.className = `toggle-bg w-11 h-6 ${isDelivered ? 'bg-green-600' : 'bg-red-500'} rounded-full transition-all duration-300`;
              dot.className = `toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${isDelivered ? 'translate-x-5' : 'translate-x-0'}`;

              // Update the status pill
              const statusPill = toggle.closest('.p-3')?.querySelector('span.inline-flex');
              if (statusPill) {
                statusPill.className = `inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${isDelivered ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`;
                statusPill.innerHTML = `${isDelivered ? '<i class="fa fa-check-circle mr-1 text-base"></i>Entregado' : '<i class="fa fa-times-circle mr-1 text-base"></i>Pendiente'}`;
              }

              // Update card opacity
              const card = toggle.closest('.p-3');
              if (card) {
                card.className = `order-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] ${isDelivered ? 'opacity-60' : ''}`;
              }
            };
            handleDeliveryToggle(order, toggle, updateVisuals, refreshListView);
          }
        });
      });

      ordersListContainer.querySelectorAll<HTMLElement>('.callBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            showCallModal(button.dataset.phone!);
          }, 100);
        });
      });

      ordersListContainer.querySelectorAll<HTMLElement>('.viewOrder').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            showOrderDetails(button.dataset.id!, refreshListView);
          }, 100);
        });
      });

      ordersListContainer.querySelectorAll<HTMLElement>('.editOrder').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            document.dispatchEvent(new CustomEvent('openOrderForm', { detail: { id: button.dataset.id! } }));
          }, 100);
        });
      });
    }, list.length * 100 + 100);
  };

  filterInp.addEventListener('input', refreshListView);

  container.querySelector('#btnAddOrder')?.addEventListener('click', (e) => {
    const button = e.currentTarget as HTMLElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
      document.dispatchEvent(new CustomEvent('openOrderForm'));
    }, 100);
  });

  refreshListView();
}