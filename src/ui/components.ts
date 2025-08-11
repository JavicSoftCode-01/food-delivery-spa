// src/ui/components.ts
import { UI } from './ui';
import { FoodRepo } from '../services/foodService';
import { OrderRepo } from '../services/orderService';
import { formatCurrency, normalizePhone, normalizeName } from '../utils';
import { Order } from '../models';
import { updateGlobalHeaderState } from '../main';


function toLocalDateInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function formatPhoneForWhatsApp(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    const withoutZero = cleanPhone.substring(1);
    if (withoutZero.length === 9) {
      return `+593 ${withoutZero.substring(0, 2)} ${withoutZero.substring(2, 5)} ${withoutZero.substring(5)}`;
    }
  }
  if (cleanPhone.startsWith('593')) {
    const number = cleanPhone.substring(3);
    if (number.length === 9) {
      return `+593 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
    }
  }
  return phone;
}

// --- Componentes de Renderizado ---
export function renderDashboard(container: HTMLElement): void {
  const foods = FoodRepo.getAll();
  const orders = OrderRepo.getSorted();
  const pending = orders.filter((o) => !o.delivered).length;
  const delivered = orders.filter((o) => o.delivered).length;
  const revenue = FoodRepo.totalProfit();

  container.innerHTML = `
    <section class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="p-3 bg-white rounded-xl border border-border shadow">
          <div class="text-sm text-gray-500">Pedidos pendientes</div>
          <div class="text-2xl font-semibold">${pending}</div>
        </div>
        <div class="p-3 bg-white rounded-xl border border-border shadow">
          <div class="text-sm text-gray-500">Entregas realizadas</div>
          <div class="text-2xl font-semibold">${delivered}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="p-3 bg-white rounded-xl border border-border shadow">
          <div class="text-sm text-gray-500">Variedades</div>
          <div class="text-xl font-semibold">${foods.length}</div>
        </div>
        <div class="p-3 bg-white rounded-xl border border-border shadow">
          <div class="text-sm text-gray-500">Beneficio total</div>
          <div class="text-xl font-semibold">${formatCurrency(revenue)}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <button id="btnAddOrderQuick" class="flex-1 px-3 py-2 bg-accent text-white rounded-lg">Nuevo pedido</button>
        <button id="btnAddFoodQuick" class="flex-1 px-3 py-2 border rounded-lg">Nueva comida</button>
      </div>
    </section>
  `;

  container.querySelector('#btnAddOrderQuick')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openOrderForm'));
  });
  container.querySelector('#btnAddFoodQuick')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openFoodForm'));
  });
}

// Handle delivery toggle logic
// This function updates the order status and handles UI updates accordingly.
// It also updates the global header state to reflect changes in the order status.
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
        order.delivered = true;
        order.deliveredAt = new Date().toISOString();
        OrderRepo.update(order);
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
        order.delivered = false;
        order.deliveredAt = null;
        OrderRepo.update(order);
        UI.toast('Entrega revertida');
        updateGlobalHeaderState();
        toggle.checked = false;
        updateVisuals(false);
        onUpdate();
      }
    );
  }
}

// Render clients list with search and actions
export function renderClients(container: HTMLElement): void {
  container.innerHTML = `
    <div class="bg-white rounded-xl border p-3 space-y-3 pb-20">
      <div class="flex gap-2 items-center">
        <input id="inputFilterPhone" placeholder="Buscar por teléfono" class="flex-1 px-3 py-2 border rounded-lg" inputmode="tel" />
        <button id="btnAddOrder" class="px-3 py-2 bg-accent text-white rounded-lg"><i class="fa-solid fa-plus fa-lg"></i></button>
      </div>
      <div id="ordersList" class="space-y-2"></div>
    </div>
  `;

  const filterInp = container.querySelector('#inputFilterPhone') as HTMLInputElement;
  const ordersListContainer = container.querySelector('#ordersList')!;

  function refreshListView() {
    const filterValue = filterInp.value;
    const list = OrderRepo.getSorted();
    const filtered = filterValue ? list.filter(o => (o.phone || '').includes(filterValue)) : list;
    renderList(filtered);
  }

  const renderList = (list: Order[]) => {
    ordersListContainer.innerHTML = '';
    if (!list.length) {
      ordersListContainer.innerHTML = `<div class="text-gray-500 text-center py-4">No hay pedidos activos</div>`;
      return;
    }

    list.forEach(o => {
      const wrapper = document.createElement('div');
      wrapper.className = 'p-3 bg-gray-50 rounded-lg border';
      wrapper.innerHTML = `
        <div class="font-bold text-xl flex items-center"><i class="fa fa-user mr-2"></i> ${o.fullName}</div>
        <div class="text-base text-gray-600 mt-2 flex items-center">
          <i class="fa fa-clock mr-2"></i><span class="font-semibold">Hora de entrega:</span>&nbsp;${new Date(o.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace('AM', 'A.M.').replace('PM', 'P.M.')}
        </div>
        <div class="text-base text-gray-600 mt-1 flex items-center">
          <i class="fa fa-mobile mr-2"></i><span class="font-semibold">Teléfono:</span> &nbsp;${o.phone}
        </div>
        <div class="flex items-center gap-2 justify-between mt-2">
          <div class="flex gap-5">
          <button data-phone="${o.phone}" class="callBtn p-2 text-gray-600 hover:text-blue-600 border-2 rounded">
            <i class="fa fa-phone fa-lg"></i>
          </button>
          <button data-id="${o.id}" class="viewOrder p-2 text-gray-600 hover:text-blue-600 border-2 rounded">
            <i class="fa fa-eye fa-lg"></i>
          </button>
          <button data-id="${o.id}" class="editOrder p-2 text-gray-600 hover:text-yellow-600 border-2 rounded">
            <i class="fa-solid fa-pencil fa-lg text-yellow-500 opacity-80"></i>
          </button>
          </div>
          <div class="flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input data-id="${o.id}" type="checkbox" ${o.delivered ? 'checked' : ''} class="sr-only deliveredToggle">
              <div class="toggle-bg w-11 h-6 ${o.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full"><div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${o.delivered ? 'translate-x-5' : 'translate-x-0'}"></div></div>
            </label>
          </div>
        </div>
      `;
      ordersListContainer.appendChild(wrapper);
    });

    // --- Asignación de Listeners ---
    ordersListContainer.querySelectorAll<HTMLInputElement>('.deliveredToggle').forEach(inp => {
      inp.addEventListener('change', e => {
        const toggle = e.currentTarget as HTMLInputElement;
        const toggleBg = toggle.nextElementSibling as HTMLElement;
        const toggleDot = toggleBg.querySelector('.toggle-dot') as HTMLElement;

        const updateToggleVisual = (isDelivered: boolean) => {
          if (isDelivered) {
            toggleBg.className = 'toggle-bg w-11 h-6 bg-green-600 rounded-full';
            toggleDot.className = 'toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform translate-x-5';
          } else {
            toggleBg.className = 'toggle-bg w-11 h-6 bg-red-500 rounded-full';
            toggleDot.className = 'toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform translate-x-0';
          }
        };

        const id = toggle.dataset.id!;
        const order = OrderRepo.findById(id);
        if (!order) return;
        
        handleDeliveryToggle(order, toggle, updateToggleVisual, refreshListView);
      });
    });

    ordersListContainer.querySelectorAll<HTMLElement>('.callBtn').forEach(btn => btn.addEventListener('click', e => showCallModal((e.currentTarget as HTMLElement).dataset.phone!)));
    ordersListContainer.querySelectorAll<HTMLElement>('.viewOrder').forEach(btn => btn.addEventListener('click', e => showOrderDetails((e.currentTarget as HTMLElement).dataset.id!, refreshListView)));
    ordersListContainer.querySelectorAll<HTMLElement>('.editOrder').forEach(btn => btn.addEventListener('click', e => document.dispatchEvent(new CustomEvent('openOrderForm', { detail: { id: (e.currentTarget as HTMLElement).dataset.id! } }))));
  };

  // --- Listeners de la Vista ---
  let phoneValidationTimeout: number | undefined;
  filterInp.addEventListener('input', () => {
    if (phoneValidationTimeout) clearTimeout(phoneValidationTimeout);
    let val = filterInp.value.replace(/\D/g, '');
    if (val.length > 10) val = val.substring(0, 10);
    filterInp.value = val;
    if (val.length >= 2 && !val.startsWith('09')) {
      phoneValidationTimeout = window.setTimeout(() => UI.toast('El teléfono debe empezar con 09.'), 5000);
    }
    refreshListView();
  });

  container.querySelector('#btnAddOrder')?.addEventListener('click', () => document.dispatchEvent(new CustomEvent('openOrderForm')));

  // Render inicial de la lista
  refreshListView();
}

// Show call modal (phone or WhatsApp)
function showCallModal(phone: string) {
  const whatsappPhone = formatPhoneForWhatsApp(phone);
  const html = `
    <div class="text-center">
      <h3 class="text-lg font-semibold mb-4">Contactar Cliente <i class="fa fa-user"></i></h3>
      <div class="flex gap-3 justify-center">
        <button id="callPhone" class="flex flex-col items-center gap-2 p-4 border-2 rounded-lg hover:bg-gray-75">
          <i class="fa-solid fa-phone-volume text-3xl text-blue-600"></i><span class="text-sm">Teléfono</span>
        </button>
        <button id="callWhatsApp" class="flex flex-col items-center gap-2 p-4 border-2 rounded-lg hover:bg-gray-75">
          <i class="fab fa-whatsapp text-4xl text-green-600"></i><span class="text-sm">WhatsApp</span>
        </button>
      </div>
    </div>
  `;

  const { close, element } = UI.modal(html);
  element.querySelector('#callPhone')!.addEventListener('click', () => { window.open(`tel:${phone}`); close(); });
  element.querySelector('#callWhatsApp')!.addEventListener('click', () => { window.open(`https://wa.me/${whatsappPhone.replace(/\s/g, '')}`); close(); });
}

// Show order details modal
function showOrderDetails(orderId: string, onUpdate: () => void) {
  const order = OrderRepo.findById(orderId);
  if (!order) {
    UI.toast('Pedido no encontrado');
    return;
  }

  const food = FoodRepo.findById(order.foodId);
  const unitPrice = food?.price || 0;
  const total = unitPrice * order.quantity;

  // Formato personalizado para la hora
  const deliveryTimeFormatted = new Date(order.deliveryTime)
    .toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: true })
    .replace('AM', 'a. m.')
    .replace('PM', 'p. m.');

  const html = `
    <button id="closeDetails" class="absolute top-1 right-1 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10">
          <i class="fa fa-times text-lg"></i>
    </button>
    <div class="relative max-h-[80vh] overflow-y-auto">
      
      <div class="pr-8">
        <h3 class="text-xl font-bold mb-4 text-center">Detalles del Pedido <i class="fa-solid fa-file-invoice-dollar fa-lg"></i></h3>
        <div class="space-y-4">
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Cliente:</label>
            <div class="text-gray-800">${order.fullName}</div>
          </div>
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Hora de entrega:</label>
            <div class="text-gray-800">${deliveryTimeFormatted}</div>
          </div>
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Dirección:</label>
            <div class="text-gray-800">${order.deliveryAddress}</div>
          </div>
          <div class="border-b pb-2">
            <label class="text-base text-gray-500 font-bold">Comida:</label>
            <div class="text-gray-800">${food?.name || 'No encontrado'}</div>
          </div>
          <div class="grid grid-cols-2 gap-4 border-b pb-2">
            <div>
              <label class="text-base text-gray-500 font-bold">Cantidad:</label>
              <div class="text-gray-800">${order.quantity}</div>
            </div>
            <div>
              <label class="text-base text-gray-500 font-bold">Combo:</label>
              <div class="text-gray-800">${order.combo ? 'Sí' : 'No'}</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 border-b pb-2">
            <div>
              <label class="text-base text-gray-500 font-bold">P. unitario:</label>
              <div class="text-gray-800">${formatCurrency(unitPrice)}</div>
            </div>
            <div>
              <label class="text-base text-gray-500 font-bold">Total:</label>
              <div class="font-bold text-lg text-green-600">${formatCurrency(total)}</div>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mt-6">
          <button id="callFromDetails" data-phone="${order.phone}" class="flex items-center gap-2 px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50">
            <i class="fa fa-phone"></i><span class="font-bold">Llamar</span>
          </button>
          <div class="flex items-center gap-2">
            <span class="text-base text-gray-500 font-bold">Entregado:</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input id="detailsToggle" data-id="${order.id}" type="checkbox" ${order.delivered ? 'checked' : ''} class="sr-only">
              <div id="toggleBg" class="toggle-bg-details w-11 h-6 ${order.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full relative">
                <div id="toggleDot" class="toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${order.delivered ? 'translate-x-5' : 'translate-x-0'}"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  `;

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
  element.querySelector('#closeDetails')!.addEventListener('click', close);
  element.querySelector('#callFromDetails')!.addEventListener('click', e => showCallModal((e.currentTarget as HTMLElement).dataset.phone!));

  const toggle = element.querySelector('#detailsToggle') as HTMLInputElement;
  const toggleBg = element.querySelector('#toggleBg')!;
  const toggleDot = element.querySelector('#toggleDot')!;

  // Función para actualizar la apariencia visual del toggle
  const updateToggleVisuals = (isDelivered: boolean) => {
    if (isDelivered) {
      toggleBg.className = 'toggle-bg-details w-11 h-6 bg-green-600 rounded-full relative';
      toggleDot.className = 'toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform translate-x-5';
    } else {
      toggleBg.className = 'toggle-bg-details w-11 h-6 bg-red-500 rounded-full relative';
      toggleDot.className = 'toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform translate-x-0';
    }
  };

  toggle.addEventListener('change', e => {
    const currentOrder = OrderRepo.findById(orderId);
    if (!currentOrder) return;
    
    handleDeliveryToggle(currentOrder, toggle, updateToggleVisuals, onUpdate);
  });
}

export function renderFoods(container: HTMLElement): void {
  const foods = FoodRepo.getAll();
  container.innerHTML = `
    <div class="bg-white rounded-xl p-3 border space-y-3">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">Comidas</h2>
        <button id="btnAddFood" class="px-3 py-2 bg-accent text-white rounded-lg"><i class="fa-solid fa-plus fa-lg"></i></button>
      </div>
      <div id="foodsList" class="space-y-2"></div>
    </div>
  `;

  const target = container.querySelector('#foodsList')!;
  if (!foods || foods.length === 0) {
    target.innerHTML = `<div class="text-gray-500">No hay comidas</div>`;
  } else {
    target.innerHTML = '';
    foods.forEach((f) => {
      const row = document.createElement('div');
      row.className = 'p-3 bg-gray-50 rounded-lg border flex justify-between items-center';
      row.innerHTML = `
        <div>
          <div class="font-semibold">${f.name} <span class="text-sm text-gray-500">(${f.isActive ? 'Activo' : 'Inactivo'})</span></div>
          <div class="text-sm text-gray-600">Vendidos: ${f.amountSold || 0} · Stock: ${f.stock} · Precio: ${formatCurrency(f.price)}</div>
        </div>
        <div class="flex gap-2">
          <button data-id="${f.id}" class="editFood btn px-3 py-1 border rounded">Editar</button>
        </div>
      `;
      target.appendChild(row);
    });

    target.querySelectorAll<HTMLElement>('.editFood').forEach((b) => {
      b.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        document.dispatchEvent(new CustomEvent('openFoodForm', { detail: { id } }));
      });
    });
  }

  const addFoodBtn = container.querySelector('#btnAddFood');
  addFoodBtn?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openFoodForm'));
  });
}

export function renderSettings(container: HTMLElement): void {
  const meta = JSON.parse(localStorage.getItem('fd_meta_v1') || '{}') || {};
  const gap = meta.deliveryGapMinutes ?? 15;
  const dark = meta.darkMode ?? false;

  container.innerHTML = `
    <div class="bg-white rounded-xl p-3 border space-y-3">
      <h2 class="text-lg font-semibold">Ajustes</h2>
      <label class="flex items-center gap-2">
        <span class="text-sm text-gray-600 w-48">Brecha de entrega (minutos)</span>
        <input id="inputGap" type="number" min="0" value="${gap}" class="px-3 py-2 border rounded-lg w-28" />
      </label>
      <label class="flex items-center gap-2">
        <span class="text-sm text-gray-600 w-48">Modo oscuro</span>
        <input id="toggleDark" type="checkbox" ${dark ? 'checked' : ''} />
      </label>
      <div class="flex gap-2 justify-end">
        <button id="btnClearAudit" class="px-3 py-2 border rounded">Limpiar logs</button>
      </div>
    </div>
  `;

  const gapInput = container.querySelector('#inputGap') as HTMLInputElement | null;
  gapInput?.addEventListener('change', (e) => {
    const v = Number((e.currentTarget as HTMLInputElement).value || 0);
    const m = JSON.parse(localStorage.getItem('fd_meta_v1') || '{}');
    m.deliveryGapMinutes = v;
    localStorage.setItem('fd_meta_v1', JSON.stringify(m));
    UI.toast('Brecha actualizada');
  });

  const toggleDark = container.querySelector('#toggleDark') as HTMLInputElement | null;
  toggleDark?.addEventListener('change', (e) => {
    const on = (e.currentTarget as HTMLInputElement).checked;
    const m = JSON.parse(localStorage.getItem('fd_meta_v1') || '{}');
    m.darkMode = on;
    localStorage.setItem('fd_meta_v1', JSON.stringify(m));
    if (on) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    UI.toast(`Modo ${on ? 'oscuro' : 'claro'} activado`);
  });

  const clearBtn = container.querySelector('#btnClearAudit') as HTMLButtonElement | null;
  clearBtn?.addEventListener('click', () => {
    localStorage.removeItem('fd_audit_v1');
    UI.toast('Logs limpiados');
  });
}
