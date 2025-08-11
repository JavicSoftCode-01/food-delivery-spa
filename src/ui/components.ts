// src/ui/components.ts
import { UI } from './ui';
import { FoodRepo } from '../services/foodService';
import { OrderRepo } from '../services/orderService';
import { formatCurrency, normalizePhone, normalizeName } from '../utils';
import { Order } from '../models'; // Importa el modelo Order si no está ya importado

// small helper to convert ISO -> value usable in <input type="datetime-local">
function toLocalDateInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

// Helper to format phone for WhatsApp (+593 format)
function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If starts with 0, remove it and add +593
  if (cleanPhone.startsWith('0')) {
    const withoutZero = cleanPhone.substring(1);
    // Format as +593 XX XXX XXXX
    if (withoutZero.length === 9) {
      return `+593 ${withoutZero.substring(0, 2)} ${withoutZero.substring(2, 5)} ${withoutZero.substring(5)}`;
    }
  }
  
  // If already starts with 593, add + and format
  if (cleanPhone.startsWith('593')) {
    const number = cleanPhone.substring(3);
    if (number.length === 9) {
      return `+593 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
    }
  }
  
  return phone; // Return original if can't format
}

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

  // event wiring quick actions
  const addOrderBtn = container.querySelector('#btnAddOrderQuick');
  const addFoodBtn = container.querySelector('#btnAddFoodQuick');

  addOrderBtn?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openOrderForm'));
  });

  addFoodBtn?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openFoodForm'));
  });
}

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

  function refreshListAndRender() {
    const filterValue = filterInp.value;
    const list = OrderRepo.getSorted();
    const filtered = filterValue ? list.filter(o => (o.phone || '').includes(filterValue)) : list;
    renderList(filtered);
  }

  const renderList = (list: Order[]) => {
    ordersListContainer.innerHTML = ''; // Limpia la lista anterior

    if (!list || list.length === 0) {
      ordersListContainer.innerHTML = `<div class="text-gray-500 text-center py-4">No hay pedidos</div>`;
      return;
    }

    list.forEach((o) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'p-3 bg-gray-50 rounded-lg border';
      wrapper.innerHTML = `
        <div class="mb-3">
          <div class="font-bold text-lg">${o.fullName}</div>
          <div class="text-sm text-gray-600">${new Date(o.deliveryTime).toLocaleString()}</div>
        </div>
        <div class="flex items-center gap-2 justify-between">
          <div class="flex gap-2">
            <button data-phone="${o.phone}" class="callBtn p-2 text-gray-600 hover:text-blue-600 border rounded"><i class="fa fa-phone"></i></button>
            <button data-id="${o.id}" class="viewOrder p-2 text-gray-600 hover:text-blue-600 border rounded"><i class="fa fa-eye"></i></button>
            <button data-id="${o.id}" class="editOrder p-2 text-gray-600 hover:text-yellow-600 border rounded"><i class="fa fa-edit"></i></button>
            <button data-id="${o.id}" class="delOrder p-2 text-gray-600 hover:text-red-600 border rounded"><i class="fa fa-trash"></i></button>
          </div>
          <div class="flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input data-id="${o.id}" type="checkbox" ${o.delivered ? 'checked' : ''} class="sr-only deliveredToggle">
              <div class="toggle-bg w-11 h-6 ${o.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full relative transition-all duration-300">
                <div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${o.delivered ? 'translate-x-5' : 'translate-x-0'}"></div>
              </div>
            </label>
          </div>
        </div>
      `;
      ordersListContainer.appendChild(wrapper);
    });

    // --- Lógica de Eventos para la lista renderizada (AHORA COMPLETA) ---
    
    // Botón Llamar
    ordersListContainer.querySelectorAll<HTMLElement>('.callBtn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const phone = (e.currentTarget as HTMLElement).dataset.phone!;
            showCallModal(phone);
        });
    });

    // Botón Ver
    ordersListContainer.querySelectorAll<HTMLElement>('.viewOrder').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = (e.currentTarget as HTMLElement).dataset.id!;
            showOrderDetails(id, refreshListAndRender);
        });
    });

    // Botón Editar
    ordersListContainer.querySelectorAll<HTMLElement>('.editOrder').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = (e.currentTarget as HTMLElement).dataset.id!;
            document.dispatchEvent(new CustomEvent('openOrderForm', { detail: { id } }));
        });
    });
    
    // Botón Eliminar
    ordersListContainer.querySelectorAll<HTMLElement>('.delOrder').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = (e.currentTarget as HTMLElement).dataset.id!;
            UI.confirm('¿Eliminar pedido?', () => {
                const all = OrderRepo.getAll().filter((o) => o.id !== id);
                OrderRepo.saveAll(all);
                UI.toast('Pedido eliminado');
                refreshListAndRender();
            });
        });
    });

    // Toggle de Entregado
    ordersListContainer.querySelectorAll<HTMLInputElement>('.deliveredToggle').forEach((inp) => {
      inp.addEventListener('change', (ev) => {
        const id = (ev.currentTarget as HTMLInputElement).dataset.id!;
        const order = OrderRepo.findById(id);
        if (!order) return;

        const checked = (ev.currentTarget as HTMLInputElement).checked;
        if (checked) {
          // Lógica para marcar como entregado
          order.delivered = true;
          order.deliveredAt = new Date().toISOString();
          OrderRepo.update(order);
          UI.toast('Pedido marcado como entregado');
          refreshListAndRender();
        } else {
          UI.confirm('¿Deseas revertir el estado a NO entregado?', () => {
            // Lógica para revertir
            order.delivered = false;
            order.deliveredAt = null;
            OrderRepo.update(order);
            UI.toast('Entrega revertida');
            refreshListAndRender();
          });
        }
      });
    });
  };

  // --- Lógica de Búsqueda y Filtrado ---
  let phoneValidationTimeout: number | undefined;
  
  filterInp.addEventListener('input', () => {
    if (phoneValidationTimeout) clearTimeout(phoneValidationTimeout);

    let val = filterInp.value.replace(/\D/g, '');
    if (val.length > 10) val = val.substring(0, 10);
    filterInp.value = val;

    if (val.length >= 2 && !val.startsWith('09')) {
      phoneValidationTimeout = window.setTimeout(() => {
        UI.toast('El teléfono debe empezar con 09.');
      }, 5000);
    }
    
    refreshListAndRender();
  });
  
  container.querySelector('#btnAddOrder')?.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openOrderForm'));
  });

  // Render inicial
  refreshListAndRender();
}

// Show call modal (phone or WhatsApp)
function showCallModal(phone: string) {
  const whatsappPhone = formatPhoneForWhatsApp(phone);
  const html = `
    <div class="text-center">
      <h3 class="text-lg font-semibold mb-4">Contactar cliente</h3>
      <div class="flex gap-3 justify-center">
        <button id="callPhone" class="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50">
          <i class="fa fa-phone text-2xl text-blue-600"></i>
          <span class="text-sm">Teléfono</span>
        </button>
        <button id="callWhatsApp" class="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50">
          <i class="fab fa-whatsapp text-2xl text-green-600"></i>
          <span class="text-sm">WhatsApp</span>
        </button>
      </div>
    </div>
  `;
  
  const { close, element } = UI.modal(html);
  
  element.querySelector('#callPhone')!.addEventListener('click', () => {
    window.open(`tel:${phone}`);
    close();
  });
  
  element.querySelector('#callWhatsApp')!.addEventListener('click', () => {
    window.open(`https://wa.me/${whatsappPhone.replace(/\s/g, '')}`);
    close();
  });
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
  
  const html = `
    <div class="relative max-h-[70vh] overflow-y-auto">
      <!-- Close button -->
      <button id="closeDetails" class="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 z-10">
        <i class="fa fa-times text-xl"></i>
      </button>
      
      <!-- Invoice-style layout -->
      <div class="pr-8">
        <h3 class="text-xl font-bold mb-4 text-center">Detalles del Pedido</h3>
        
        <div class="space-y-3">
          <div class="border-b pb-2">
            <label class="text-sm text-gray-500">Cliente:</label>
            <div class="font-semibold">${order.fullName}</div>
          </div>
          
          <div class="border-b pb-2">
            <label class="text-sm text-gray-500">Hora de entrega:</label>
            <div class="font-medium">${new Date(order.deliveryTime).toLocaleString()}</div>
          </div>
          
          <div class="border-b pb-2">
            <label class="text-sm text-gray-500">Dirección de entrega:</label>
            <div class="font-medium">${order.deliveryAddress}</div>
          </div>
          
          <div class="border-b pb-2">
            <label class="text-sm text-gray-500">Producto:</label>
            <div class="font-medium">${food?.name || 'Producto no encontrado'}</div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 border-b pb-2">
            <div>
              <label class="text-sm text-gray-500">Cantidad:</label>
              <div class="font-medium">${order.quantity}</div>
            </div>
            <div>
              <label class="text-sm text-gray-500">Combo:</label>
              <div class="font-medium">${order.combo ? 'Sí' : 'No'}</div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 border-b pb-2">
            <div>
              <label class="text-sm text-gray-500">Precio unitario:</label>
              <div class="font-medium">${formatCurrency(unitPrice)}</div>
            </div>
            <div>
              <label class="text-sm text-gray-500">Total:</label>
              <div class="font-bold text-lg">${formatCurrency(total)}</div>
            </div>
          </div>
        </div>
        
        <!-- Bottom actions -->
        <div class="flex justify-between items-center mt-6">
          <!-- Call button -->
          <button id="callFromDetails" data-phone="${order.phone}" class="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
            <i class="fa fa-phone"></i>
            <span>Llamar</span>
          </button>
          
          <!-- Delivery toggle -->
          <div class="flex items-center gap-2">
            <span class="text-sm">Entregado:</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input id="detailsToggle" data-id="${order.id}" type="checkbox" ${order.delivered ? 'checked' : ''} class="sr-only">
              <div class="toggle-bg-details w-11 h-6 ${order.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full relative transition-all duration-300">
                <div class="toggle-dot-details absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${order.delivered ? 'translate-x-5' : 'translate-x-0'}"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Disable closing on backdrop click for this specific modal
  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
  
  // The function to close the details modal, called by the 'X' button
  const closeDetailsModal = () => {
    close();
  };
  
  // Close button ('X')
  element.querySelector('#closeDetails')!.addEventListener('click', closeDetailsModal);
  
  // Call button
  element.querySelector('#callFromDetails')!.addEventListener('click', (e) => {
    const phone = (e.currentTarget as HTMLElement).dataset.phone!;
    showCallModal(phone);
  });
  
  // Toggle functionality
  const toggle = element.querySelector('#detailsToggle') as HTMLInputElement;
  const toggleBgDetails = element.querySelector('.toggle-bg-details') as HTMLElement;
  const toggleDotDetails = element.querySelector('.toggle-dot-details') as HTMLElement;
  
  toggle.addEventListener('change', (e) => {
    const checked = (e.currentTarget as HTMLInputElement).checked;
    const currentOrder = OrderRepo.findById(orderId);
    if (!currentOrder) return;
    
    if (checked) {
      const food = FoodRepo.findById(currentOrder.foodId);
      if (!food) {
        UI.toast('Comida no encontrada');
        toggle.checked = false;
        return;
      }
      if (food.stock < currentOrder.quantity) {
        UI.toast('Stock insuficiente para marcar como entregado');
        toggle.checked = false;
        return;
      }

      food.stock = Math.max(0, food.stock - currentOrder.quantity);
      food.amountSold = (food.amountSold || 0) + currentOrder.quantity;
      FoodRepo.update(food);

      currentOrder.delivered = true;
      currentOrder.deliveredAt = new Date().toISOString();
      OrderRepo.update(currentOrder);

      // Update toggle appearance
      if (toggleBgDetails) {
        toggleBgDetails.classList.remove('bg-red-500');
        toggleBgDetails.classList.add('bg-green-600');
      }
      if (toggleDotDetails) {
        toggleDotDetails.classList.remove('translate-x-0');
        toggleDotDetails.classList.add('translate-x-5');
      }

      UI.toast('Pedido marcado como entregado');
      onUpdate();
    } else {
      // This will now open a confirmation on TOP of the details modal
      UI.confirm('¿Deseas revertir el estado a NO entregado?', () => {
        const food = FoodRepo.findById(currentOrder.foodId);
        if (food) {
          food.stock = (food.stock || 0) + currentOrder.quantity;
          food.amountSold = Math.max(0, (food.amountSold || 0) - currentOrder.quantity);
          FoodRepo.update(food);
        }
        currentOrder.delivered = false;
        currentOrder.deliveredAt = null;
        OrderRepo.update(currentOrder);

        // Update toggle appearance
        if (toggleBgDetails) {
          toggleBgDetails.classList.remove('bg-green-600');
          toggleBgDetails.classList.add('bg-red-500');
        }
        if (toggleDotDetails) {
          toggleDotDetails.classList.remove('translate-x-5');
          toggleDotDetails.classList.add('translate-x-0');
        }

        UI.toast('Entrega revertida');
        onUpdate();
        // The details modal is NOT closed here, it remains open.
      });
    }
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
    console.info('Gap updated', v);
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
    console.info('Audit log cleared');
  });
}