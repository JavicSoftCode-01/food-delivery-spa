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
    <button id="closeCall" class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-55 z-10"><i class="fa fa-times text-lg"></i></button>
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

/** Shows details of an order in a modal. */
function showOrderDetails(orderId: string, onUpdate: () => void) {
  const order = OrderRepo.findById(orderId);
  if (!order) {
    UI.toast('Pedido no encontrado');
    return;
  }

  const food = FoodRepo.findById(order.foodId);
  const unitPrice = food?.price || 0;
  const total = unitPrice * order.quantity;

  const html = `<button id="closeDetails" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
    <div class="relative max-h-[75vh] overflow-y-auto">
      <div class="pr-8 p-4">
        <h3 class="text-xl font-bold mb-4 text-center">Detalles del Pedido <i class="fa-solid fa-file-invoice-dollar fa-lg"></i></h3>
        <div class="space-y-4">
          <div class="border-b dark:border-dark-border pb-2">
            <label class="text-base text-gray-500 dark:text-gray-400 font-bold">Cliente:</label>
            <div class="text-gray-800 dark:text-dark-text">${order.fullName}</div>
          </div>
          <div class="border-b dark:border-dark-border pb-2">
            <label class="text-base text-gray-500 dark:text-gray-400 font-bold">Hora de entrega:</label>
            <div class="text-gray-800 dark:text-dark-text">${formatTime(order.deliveryTime)}</div>
          </div>
          <div class="border-b dark:border-dark-border pb-2">
            <label class="text-base text-gray-500 dark:text-gray-400 font-bold">Dirección:</label>
            <div class="text-gray-800 dark:text-dark-text">${order.deliveryAddress}</div>
          </div>
          <div class="border-b dark:border-dark-border pb-2">
            <label class="text-base text-gray-500 dark:text-gray-400 font-bold">Comida:</label>
            <div class="text-gray-800 dark:text-dark-text">${food?.name || 'No encontrado'}</div>
          </div>
          <div class="grid grid-cols-2 gap-4 border-b dark:border-dark-border pb-2">
            <div>
              <label class="text-base text-gray-500 dark:text-gray-400 font-bold">Cantidad:</label>
              <div class="text-gray-800 dark:text-dark-text">${order.quantity}</div>
            </div>
            <div>
              <label class="text-base text-gray-500 dark:text-gray-400 font-bold">Combo:</label>
              <div class="text-gray-800 dark:text-dark-text">${order.combo ? 'Sí' : 'No'}</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 border-b dark:border-dark-border pb-2">
            <div>
              <label class="text-base text-gray-500 dark:text-gray-400 font-bold">P. unitario:</label>
              <div class="text-gray-800 dark:text-dark-text">${formatCurrency(unitPrice)}</div>
            </div>
            <div>
              <label class="text-base text-gray-500 dark:text-gray-400 font-bold">Total:</label>
              <div class="font-bold text-lg text-green-600">${formatCurrency(total)}</div>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4 gap-4">
          <button id="callFromDetails" data-phone="${order.phone}" class="flex items-center gap-2 px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900">
            <i class="fa fa-phone"></i><span class="font-bold">Llamar</span>
          </button>
          <div class="flex items-center gap-2">
            <span class="text-base text-gray-500 dark:text-gray-400 font-bold">Entregado:</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input id="detailsToggle" data-id="${order.id}" type="checkbox" ${order.delivered ? 'checked' : ''} class="sr-only">
              <div id="toggleBg" class="toggle-bg-details w-11 h-6 ${order.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full relative">
                <div id="toggleDot" class="toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${order.delivered ? 'translate-x-5' : 'translate-x-0'}"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>`;

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
  element.querySelector('#closeDetails')!.addEventListener('click', close);
  element.querySelector('#callFromDetails')!.addEventListener('click', (e) => showCallModal((e.currentTarget as HTMLElement).dataset.phone!));

  const toggle = element.querySelector('#detailsToggle') as HTMLInputElement;

  const updateToggleVisuals = (isDelivered: boolean) => {
    const toggleBg = element.querySelector('#toggleBg')!;
    const toggleDot = element.querySelector('#toggleDot')!;
    toggleBg.className = `toggle-bg-details w-11 h-6 ${isDelivered ? 'bg-green-600' : 'bg-red-500'} rounded-full relative`;
    toggleDot.className = `toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${isDelivered ? 'translate-x-5' : 'translate-x-0'}`;
  };

  toggle.addEventListener('change', () => {
    const currentOrder = OrderRepo.findById(orderId);
    if (!currentOrder) return;
    handleDeliveryToggle(currentOrder, toggle, updateToggleVisuals, () => {
      onUpdate();
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
      <div class="p-3 bg-white dark:bg-dark-bg-secondary rounded-xl border dark:border-dark-border shadow">
        <div class="text-sm text-gray-500 dark:text-gray-400">Pedidos pendientes</div>
        <div class="text-2xl font-semibold">${pending}</div>
      </div>
      <div class="p-3 bg-white dark:bg-dark-bg-secondary rounded-xl border dark:border-dark-border shadow">
        <div class="text-sm text-gray-500 dark:text-gray-400">Entregas realizadas</div>
        <div class="text-2xl font-semibold">${delivered}</div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 bg-white dark:bg-dark-bg-secondary rounded-xl border dark:border-dark-border shadow">
        <div class="text-sm text-gray-500 dark:text-gray-400">Variedades</div>
        <div class="text-xl font-semibold">${foods.length}</div>
      </div>
      <div class="p-3 bg-white dark:bg-dark-bg-secondary rounded-xl border dark:border-dark-border shadow">
        <div class="text-sm text-gray-500 dark:text-gray-400">Beneficio total</div>
        <div class="text-xl font-semibold">${formatCurrency(revenue)}</div>
      </div>
    </div>
    <div class="flex gap-2">
      <button id="btnAddOrderQuick" class="flex-1 px-3 py-2 bg-accent text-white rounded-lg">Nuevo pedido</button>
      <button id="btnAddFoodQuick" class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg">Nueva comida</button>
    </div>
  </section>`;

  container.querySelector('#btnAddOrderQuick')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openOrderForm'));
  });
  container.querySelector('#btnAddFoodQuick')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openFoodForm'));
  });

  UI.updateHeaderContent;
}

/** Shows details of a sales record in a modal. */
function showSalesRecordDetails(record: FoodSaleRecord, food: Food, onBackToHistory: () => void) {
const html = `<div class="relative max-h-[90vh] overflow-y-auto">
  <button id="closeRecordDetails" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20">
    <i class="fa fa-times text-lg"></i>
  </button>
  <div class="pr-8 p-4">
    <button id="backToHistoryList" class="text-sm text-accent hover:underline mb-4 flex items-center gap-2">
      <i class="fa fa-arrow-left"></i>Volver a la lista
    </button>
    <h3 class="text-2xl font-bold mb-4 text-center">Detalles ${record.recordDate}</h3>
    <div class="space-y-4">

      <div class="border-b dark:border-dark-border pb-2">
        <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
          <i class="fa fa-bowl-food"></i> Comida:
        </label>
        <div class="text-gray-900 dark:text-dark-text text-lg">${food.name}</div>
      </div>

      <div class="border-b dark:border-dark-border pb-2">
        <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
          <i class="fa fa-clock"></i> Horario:
        </label>
        <div class="text-gray-900 dark:text-dark-text text-lg">${formatClockTime(record.startTime)} - ${formatClockTime(record.endTime)}</div>
      </div>

      <div class="grid grid-cols-3 gap-4 border-b dark:border-dark-border pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa-solid fa-boxes-stacked"></i> Stock:
          </label>
          <div class="text-gray-900 dark:text-dark-text text-lg flex items-center justify-center h-full -mt-2">${record.initialStock}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa fa-shopping-cart"></i> Vend.:
          </label>
          <div class="text-gray-900 dark:text-dark-text text-lg flex items-center justify-center h-full -mt-2">${record.quantitySold}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa-solid fa-boxes-stacked"></i> Resto:
          </label>
          <div class="text-gray-900 dark:text-dark-text text-lg flex items-center justify-center h-full -mt-2">${(record.initialStock - record.quantitySold)}</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 border-b dark:border-dark-border pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa fa-money-bill"></i> Costo:
          </label>
          <div class="text-gray-900 dark:text-dark-text text-lg flex items-center justify-center h-full -mt-2">${formatCurrency(record.unitCost)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa fa-dollar-sign"></i> Precio:
          </label>
          <div class="text-gray-900 dark:text-dark-text text-lg flex items-center justify-center h-full -mt-2">${formatCurrency(record.unitPrice)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa fa-chart-line"></i> Lucro:
          </label>
          <div class="font-bold text-blue-700 text-lg flex items-center justify-center h-full -mt-2">${formatCurrency(record.unitPrice - record.unitCost)}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 border-b dark:border-dark-border pb-2">
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa fa-piggy-bank"></i> Lucro T.:
          </label>
          <div class="font-bold text-blue-700 text-xl flex h-full -mt-1">${formatCurrency((record.unitPrice - record.unitCost) * record.quantitySold)}</div>
        </div>
        <div>
          <label class="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
            <i class="fa fa-coins"></i> Total:
          </label>
          <div class="font-bold text-green-700 text-xl flex h-full -mt-1">${formatCurrency(record.quantitySold * record.unitPrice)}</div>
        </div>
      </div>

    </div>
  </div>
</div>`;



  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
  element.querySelector('#closeRecordDetails')!.addEventListener('click', close);
  element.querySelector('#backToHistoryList')!.addEventListener('click', () => {
    close();
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
          const totalRevenue = record.quantitySold * record.unitPrice;
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
                      Vendidos: <span class="text-gray-600 dark:text-gray-300">${record.quantitySold}</span>
                    </div>
                    <div class="text-sm text-green-600">
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
  container.innerHTML = `<div class="bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-20">
    <div class="flex gap-2 items-center">
      <input id="inputFilterFood" placeholder="Buscar por comida..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent" />
      <button id="btnAddFood" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-green-600 transition-colors">
        <i class="fa-solid fa-plus fa-lg"></i>
      </button>
    </div>
    <div id="foodsList" class="space-y-3"></div>
  </div>`;

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
      foodsListContainer.innerHTML = `
        <div class="text-gray-500 dark:text-gray-400 text-center py-8">
          <i class="fa fa-bowl-food text-4xl mb-2 opacity-50"></i>
          <p>Sin resultados.</p>
        </div>`;
      return;
    }

    list.forEach((f) => {
      const row = document.createElement('div');
      row.className = `p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-sm transition-shadow ${!f.isActive ? 'opacity-60' : ''}`;
      row.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl">${f.name}</div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${f.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
              <i class="fa ${f.isActive ? 'fa-check-circle' : 'fa-times-circle'} mr-1 text-base"></i>
              ${f.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-shopping-cart text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${f.amountSold || 0}</strong></span>
          </div>
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-boxes-stacked text-orange-500 text-2xl"></i>
            <span class="font-semibold"><strong>${f.stock}</strong></span>
          </div>
          <div class="flex items-center gap-1">
            <i class="fa-solid fa-dollar-sign text-green-500 text-2xl"></i>
            <span class="font-semibold"><strong>${formatCurrency(f.price)}</strong></span>
          </div>
        </div>
        <div class="flex gap-2">
          <button data-id="${f.id}" class="salesHistoryBtn flex-1 px-1 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors font-semibold">
            <i class="fa fa-history text-lg"></i>
            Historial
          </button>
          <button data-id="${f.id}" class="editFood flex-1 px-1 py-1 bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors font-semibold">
            <i class="fa-solid fa-store text-lg"></i>
            Venta
          </button>
        </div>`;
      foodsListContainer.appendChild(row);
    });

    foodsListContainer.querySelectorAll<HTMLElement>('.editFood').forEach((b) => {
      b.addEventListener('click', (e) => {
        document.dispatchEvent(
          new CustomEvent('openFoodForm', {
            detail: { id: (e.currentTarget as HTMLElement).dataset.id! },
          })
        );
      });
    });

    foodsListContainer.querySelectorAll<HTMLElement>('.salesHistoryBtn').forEach((b) => {
      b.addEventListener('click', (e) => {
        const foodId = (e.currentTarget as HTMLElement).dataset.id!;
        openSalesHistoryModal(foodId);
      });
    });
  };

  filterInp.addEventListener('input', refreshFoodListView);
  container.querySelector('#btnAddFood')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openFoodForm'));
  });

  document.addEventListener('refreshViews', refreshFoodListView);
  refreshFoodListView();
}

export function renderSettings(container: HTMLElement): void {
  // Leer meta actual
  const metaRaw = localStorage.getItem('fd_meta_v1') || '{}';
  let meta: { deliveryGapMinutes?: number; darkMode?: boolean } = {};
  try { meta = JSON.parse(metaRaw) || {}; } catch { meta = {}; }

  const gap = meta.deliveryGapMinutes ?? 15;
  const dark = !!meta.darkMode;

  // HTML con diseño tipo "configuración/icono" y toggle interactivo
 container.innerHTML = `
    <div class="bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-16 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center text-yellow-600 shadow-sm">
          <i class="fa fa-gear text-2xl"></i>
        </div>
        <div>
          <h2 class="text-lg font-semibold">Ajustes</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Personaliza la configuración del sistema.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <!-- Sección Intervalo -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl">
              <i class="fa-solid fa-clock fa-lg"></i>
            </div>
            <div>
              <div class="text-lg font-medium">Intervalo</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">De entrega</div>
            </div>
          </div>
          <div>
            <input id="inputGap" type="number" min="0" value="${gap}" 
                   class="px-3 py-2 border rounded-lg w-20 text-center bg-transparent dark:border-dark-border" />
          </div>
        </div>

        <!-- Sección Modo Oscuro -->
        <div class="flex items-center justify-between md:justify-end gap-3">
          <div class="flex items-center gap-3">
            <div id="themeIcon" class="w-10 h-10 rounded-full flex items-center justify-center text-xl">
              <i class="${dark ? 'fa fa-moon fa-lg' : 'fa fa-sun fa-lg'}"></i>
            </div>
            <div>
              <div class="text-lg font-medium">Modo</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Oscuro o Claro</div>
            </div>
          </div>

          <div>
            <button id="themeToggle" aria-pressed="${dark}" title="${dark ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}" class="toggle-btn inline-flex items-center gap-2 px-3 py-2 rounded-full border dark:border-dark-border">
              <span id="sunIcon" class="text-yellow-500 ${dark ? 'opacity-40' : ''}"><i class="fa fa-sun fa-lg"></i></span>
              <span id="slider" class="w-10 h-6 rounded-full flex items-center p-1 ${dark ? 'justify-end bg-gray-700' : 'justify-start bg-gray-200'}">
                <span id="dot" class="w-4 h-4 bg-white rounded-full shadow"></span>
              </span>
              <span id="moonIcon" class="text-indigo-600 ${!dark ? 'opacity-40' : ''}"><i class="fa fa-moon fa-lg"></i></span>
            </button>
          </div>
        </div>
      </div>

      <!--<div class="flex justify-end gap-2 pt-2">
        <button id="btnClearAudit" class="px-3 py-2 border rounded">Limpiar logs</button>
      </div>-->
    </div>
  `;

  // Referencias
  const gapInput = container.querySelector('#inputGap') as HTMLInputElement | null;
  const themeToggle = container.querySelector('#themeToggle') as HTMLButtonElement | null;
  const themeIcon = container.querySelector('#themeIcon') as HTMLElement | null;
  const sunIcon = container.querySelector('#sunIcon') as HTMLElement | null;
  const moonIcon = container.querySelector('#moonIcon') as HTMLElement | null;
  const slider = container.querySelector('#slider') as HTMLElement | null;
  const dot = container.querySelector('#dot') as HTMLElement | null;
  const clearBtn = container.querySelector('#btnClearAudit') as HTMLButtonElement | null;

  // Aplica modo oscuro en DOM y persiste
  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // actualizar iconos/estado visual
    if (themeIcon) {
      themeIcon.innerHTML = `<i class="${isDark ? 'fa fa-moon fa-lg' : 'fa fa-sun fa-lg'}"></i>`;
    }
    if (sunIcon) sunIcon.classList.toggle('opacity-40', isDark);
    if (moonIcon) moonIcon.classList.toggle('opacity-40', !isDark);
    if (slider) {
      slider.classList.toggle('bg-gray-700', isDark);
      slider.classList.toggle('bg-gray-200', !isDark);
      slider.classList.toggle('justify-end', isDark);
      slider.classList.toggle('justify-start', !isDark);
    }

    // persistir meta
    const currentMetaRaw = localStorage.getItem('fd_meta_v1') || '{}';
    let currentMeta: any = {};
    try { currentMeta = JSON.parse(currentMetaRaw) || {}; } catch { currentMeta = {}; }
    currentMeta.darkMode = !!isDark;
    localStorage.setItem('fd_meta_v1', JSON.stringify(currentMeta));
  };

  // Handlers
  const onGapChange = (e: Event) => {
    const v = Number((e.currentTarget as HTMLInputElement).value || 0);
    const mRaw = localStorage.getItem('fd_meta_v1') || '{}';
    let m: any = {};
    try { m = JSON.parse(mRaw) || {}; } catch { m = {}; }
    m.deliveryGapMinutes = v;
    localStorage.setItem('fd_meta_v1', JSON.stringify(m));
    UI.toast('Brecha actualizada');
  };

  const onThemeToggle = () => {
    const current = document.documentElement.classList.contains('dark');
    const next = !current;
    applyDarkMode(next);
    UI.toast(`Modo ${next ? 'oscuro' : 'claro'} activado`);
    // actualizar header/global state si es necesario
    updateGlobalHeaderState();
  };

  const onClearLogs = () => {
    localStorage.removeItem('fd_audit_v1');
    UI.toast('Logs limpiados');
  };

  // Bind eventos
  gapInput?.addEventListener('change', onGapChange);
  themeToggle?.addEventListener('click', onThemeToggle);
  clearBtn?.addEventListener('click', onClearLogs);

  // Estado inicial
  applyDarkMode(dark);
}

/** Handles toggling delivery status with confirmation. */
export function handleDeliveryToggle(
  order: Order,
  toggle: HTMLInputElement,
  updateVisuals: (isDelivered: boolean) => void,
  onUpdate: () => void
) {
  const isChecked = toggle.checked;

  if (isChecked) {
    toggle.checked = false;
    updateVisuals(false);
    UI.confirm(
      `🟢 Quiere confirmar la entrega al Cliente <strong>${order.fullName}</strong> ❓ <br> ✅ Perteneciente al teléfono <strong>${order.phone}</strong>`,
      () => {
        const updatedOrder = { ...order, delivered: true, deliveredAt: new Date().toISOString() };
        OrderRepo.update(updatedOrder);
        UI.toast('Pedido marcado como entregado');
        updateGlobalHeaderState();
        toggle.checked = true;
        updateVisuals(true);
        onUpdate();
      }
    );
  } else {
    toggle.checked = true;
    updateVisuals(true);

    UI.confirm(
      `🔴 Quiere revertir la entrega al Cliente <strong>${order.fullName}</strong> ❓ <br> Perteneciente al teléfono <strong>${order.phone}</strong> 〽️`,
      () => {
        const updatedOrder = { ...order, delivered: false, deliveredAt: null };
        OrderRepo.update(updatedOrder);
        UI.toast('Entrega revertida');
        updateGlobalHeaderState();
        toggle.checked = false;
        updateVisuals(false);
        onUpdate();
      }
    );

  }
}

/** Renders the clients screen. */
export function renderClients(container: HTMLElement): void {
  container.innerHTML = `<div class="bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-20"> <div class="flex gap-2 items-center"> <input id="inputFilterPhone" placeholder="Buscar por nombre o teléfono..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent" inputmode="text" /> <button id="btnAddOrder" class="px-3 py-2 bg-accent text-white rounded-lg"><i class="fa-solid fa-plus fa-lg"></i></button> </div> <div id="ordersList" class="space-y-2"></div> </div>`;

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
      ordersListContainer.innerHTML = `
        <div class="text-gray-500 dark:text-gray-400 text-center py-8">
          <i class="fa-solid fa-bag-shopping text-4xl mb-2 opacity-50"></i>
          <p>Sin resultados o los últimos 9 dígitos telefónico.</p>
        </div>`;
      return;
    }

    list.forEach(o => {
      const wrapper = document.createElement('div');
      wrapper.className = 'p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border';
      wrapper.innerHTML = `
        <div class="font-bold text-xl flex items-center"><i class="fa fa-user mr-2"></i> ${o.fullName}</div>
        <div class="text-base text-gray-600 dark:text-gray-300 mt-2 flex items-center">
        <i class="fa fa-clock mr-2"></i><span class="font-semibold">Hora de entrega:</span>&nbsp;${new Date(o.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace('AM', 'a. m.').replace('PM', 'p. m.')}
        </div>
        <div class="text-base text-gray-600 dark:text-gray-300 mt-1 flex items-center">
        <i class="fa fa-mobile mr-2"></i><span class="font-semibold">Teléfono:</span> &nbsp;${o.phone}
        </div>
        <div class="flex items-center gap-2 justify-between mt-2">
        <div class="flex gap-5">
            <button data-phone="${o.phone}" class="callBtn p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 border-2 dark:border-dark-border rounded">
            <i class="fa fa-phone fa-lg"></i>
            </button>
            <button data-id="${o.id}" class="viewOrder p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 border-2 dark:border-dark-border rounded">
            <i class="fa fa-eye fa-lg"></i>
            </button>
            <button data-id="${o.id}" class="editOrder p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-600 border-2 dark:border-dark-border rounded">
            <i class="fa-solid fa-pencil fa-lg text-yellow-500 opacity-80"></i>
            </button>
        </div>
        <div class="flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
            <input data-id="${o.id}" type="checkbox" ${o.delivered ? 'checked' : ''} class="sr-only deliveredToggle">
            <div class="toggle-bg w-11 h-6 ${o.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full">
                <div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${o.delivered ? 'translate-x-5' : 'translate-x-0'}"></div>
            </div>
            </label>
        </div>
        </div>
    `;
      ordersListContainer.appendChild(wrapper);
    });

    ordersListContainer.querySelectorAll<HTMLInputElement>('.deliveredToggle').forEach(inp => {
      inp.addEventListener('change', e => {
        const toggle = e.currentTarget as HTMLInputElement;
        const id = toggle.dataset.id!;
        const order = OrderRepo.findById(id);
        if (order) {
          const updateVisuals = (isDelivered: boolean) => {
            const bg = toggle.nextElementSibling!;
            const dot = bg.firstElementChild!;
            bg.className = `toggle-bg w-11 h-6 ${isDelivered ? 'bg-green-600' : 'bg-red-500'} rounded-full`;
            dot.className = `toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${isDelivered ? 'translate-x-5' : 'translate-x-0'}`;
          };
          handleDeliveryToggle(order, toggle, updateVisuals, refreshListView);
        }
      });
    });

    ordersListContainer.querySelectorAll<HTMLElement>('.callBtn').forEach(btn => btn.addEventListener('click', e => {
      showCallModal((e.currentTarget as HTMLElement).dataset.phone!);
    }));
    ordersListContainer.querySelectorAll<HTMLElement>('.viewOrder').forEach(btn => btn.addEventListener('click', e => {
      showOrderDetails((e.currentTarget as HTMLElement).dataset.id!, refreshListView);
    }));
    ordersListContainer.querySelectorAll<HTMLElement>('.editOrder').forEach(btn => btn.addEventListener('click', e => {
      document.dispatchEvent(new CustomEvent('openOrderForm', { detail: { id: (e.currentTarget as HTMLElement).dataset.id! } }));
    }));

  };

  filterInp.addEventListener('input', refreshListView);

  container.querySelector('#btnAddOrder')?.addEventListener('click', () => document.dispatchEvent(new CustomEvent('openOrderForm')));

  refreshListView();
}