//src\main.ts
import './styles.css';
import { UI } from './ui/ui';
import { renderDashboard, renderClients, renderFoods, renderSettings } from './ui/components';
import { FoodRepo } from './services/foodService';
import { OrderRepo } from './services/orderService';
import { Storage } from './services/storage';
import { uid, normalizePhone, normalizeName, formatCurrency } from './utils';

// Inicial render shell
UI.renderShell();

// pantalla actual
let screen: 'dashboard' | 'clients' | 'foods' | 'settings' = 'dashboard';

function renderCurrent() {
  UI.updateTitle(screen);
  UI.renderNavActive(screen);
  const main = document.getElementById('mainArea')!;
  main.innerHTML = '';
  const container = document.createElement('div');
  main.appendChild(container);

  if (screen === 'dashboard') renderDashboard(container);
  else if (screen === 'clients') renderClients(container);
  else if (screen === 'foods') renderFoods(container);
  else if (screen === 'settings') renderSettings(container);
}

// nav buttons
document.querySelectorAll('.nav-item').forEach((b: Element) => {
  b.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLElement;
    // determine which screen by text content (simple)
    const txt = btn.textContent?.trim()?.toLowerCase();
    if (txt?.includes('dash') || txt?.includes('gest')) screen = 'dashboard';
    else if (txt?.includes('cliente')) screen = 'clients';
    else if (txt?.includes('comid')) screen = 'foods';
    else if (txt?.includes('ajust')) screen = 'settings';
    renderCurrent();
  });
});

// Global event listeners to open forms
document.addEventListener('openOrderForm', (e: Event) => {
  const id = (e as CustomEvent).detail?.id as string | undefined;
  openOrderForm(id);
});
document.addEventListener('openFoodForm', (e: Event) => {
  const id = (e as CustomEvent).detail?.id as string | undefined;
  openFoodForm(id);
});

renderCurrent();

// ---- Forms behavior ----

function openFoodForm(foodId?: string) {
  const editing = foodId ? FoodRepo.findById(foodId) : null;
  const html = `
    <h3 class="text-lg font-semibold">${editing ? 'Editar comida' : 'Agregar comida'}</h3>
    <form id="foodForm" class="mt-3 space-y-3">
      <div><label class="block text-sm">Nombre <input name="name" value="${editing?.name ?? ''}" required class="w-full px-3 py-2 border rounded" /></label></div>
      <div class="grid grid-cols-2 gap-2">
        <label class="block text-sm">Costo <input name="cost" type="number" step="0.01" min="0" value="${editing?.cost ?? 0}" class="w-full px-3 py-2 border rounded" /></label>
        <label class="block text-sm">Precio <input name="price" type="number" step="0.01" min="0" value="${editing?.price ?? 0}" class="w-full px-3 py-2 border rounded" /></label>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <label class="block text-sm">Stock <input name="stock" type="number" min="0" value="${editing?.stock ?? 0}" class="w-full px-3 py-2 border rounded" /></label>
        <label class="inline-flex items-center gap-2"><input name="isActive" type="checkbox" ${editing?.isActive ? 'checked' : ''} /> Activo</label>
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" id="cancelFood" class="px-3 py-2 border rounded">Cancelar</button>
        <button type="submit" class="px-3 py-2 bg-accent text-white rounded">${editing ? 'Actualizar' : 'Agregar'}</button>
      </div>
    </form>
  `;
  const { close } = UI.modal(html);
  document.getElementById('cancelFood')!.addEventListener('click', close);
  const form = document.getElementById('foodForm') as HTMLFormElement;
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = new FormData(form);
    const name = normalizeName(data.get('name') as string);
    const cost = Number(data.get('cost')) || 0;
    const price = Number(data.get('price')) || 0;
    const stock = Math.max(0, Number(data.get('stock')) || 0);
    const isActive = !!data.get('isActive');
    if (!name) { UI.toast('Nombre requerido'); return; }
    if (FoodRepo.nameExists(name, editing?.id)) { UI.toast('El nombre debe ser único'); return; }
    if (editing) {
      const updated = { ...editing, name, cost: +cost.toFixed(2), price: +price.toFixed(2), stock, isActive };
      FoodRepo.update(updated);
      UI.toast('Comida actualizada');
    } else {
      FoodRepo.add({ name, cost: +cost.toFixed(2), price: +price.toFixed(2), stock, isActive });
      UI.toast('Comida agregada');
    }
    close();
    renderCurrent();
  }, { once: true });
}

function openOrderForm(orderId?: string) {
  const editing = orderId ? OrderRepo.findById(orderId) : null;
  const foods = FoodRepo.getAll().filter(f => f.isActive);
  const options = foods.map(f => `<option ${editing?.foodId === f.id ? 'selected' : ''} value="${f.id}">${f.name}</option>`).join('');
  const html = `
    <h3 class="text-lg font-semibold">${editing ? 'Editar pedido' : 'Agregar pedido'}</h3>
    <form id="orderForm" class="mt-3 space-y-3">
      <div><label class="block text-sm">Nombre completo <input name="fullName" value="${editing?.fullName ?? ''}" required class="w-full px-3 py-2 border rounded" /></label></div>
      <div><label class="block text-sm">Teléfono <input name="phone" value="${editing?.phone ?? ''}" required class="w-full px-3 py-2 border rounded" inputmode="numeric" /></label></div>
      <div><label class="block text-sm">Dirección de entrega <input name="deliveryAddress" value="${editing?.deliveryAddress ?? ''}" required class="w-full px-3 py-2 border rounded" /></label></div>
      <div><label class="block text-sm">Comida <select name="foodId" class="w-full px-3 py-2 border rounded">${options}</select></label></div>
      <div class="grid grid-cols-2 gap-2">
        <label class="block text-sm">Cantidad <input name="quantity" type="number" min="1" value="${editing?.quantity ?? 1}" class="w-full px-3 py-2 border rounded" /></label>
        <label class="inline-flex items-center gap-2"><input name="combo" type="checkbox" ${editing?.combo ? 'checked' : ''} /> Combo</label>
      </div>
      <div><label class="block text-sm">Fecha y hora de entrega <input name="deliveryTime" type="datetime-local" value="${editing ? toLocalDateInput(editing.deliveryTime) : ''}" required class="w-full px-3 py-2 border rounded" /></label></div>
      <div class="flex justify-end gap-2">
        <button type="button" id="cancelOrder" class="px-3 py-2 border rounded">Cancelar</button>
        <button type="submit" class="px-3 py-2 bg-accent text-white rounded">${editing ? 'Actualizar' : 'Agregar'}</button>
      </div>
    </form>
  `;
  const { close } = UI.modal(html);
  document.getElementById('cancelOrder')!.addEventListener('click', close);

  (document.getElementById('orderForm') as HTMLFormElement).addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget as HTMLFormElement);
    const fullName = normalizeName(String(data.get('fullName') || ''));
    const phone = normalizePhone(String(data.get('phone') || ''));
    const deliveryAddress = normalizeName(String(data.get('deliveryAddress') || ''));
    const foodId = String(data.get('foodId') || '');
    const quantity = Math.max(1, Number(data.get('quantity')) || 1);
    const combo = !!data.get('combo');
    const deliveryTime = new Date(String(data.get('deliveryTime'))).toISOString();

    if (!fullName || !phone || !deliveryAddress) { UI.toast('Completa los campos requeridos'); return; }
    if (!foodId) { UI.toast('Selecciona una comida'); return; }

    // gap rule
    const meta = JSON.parse(localStorage.getItem('fd_meta_v1') || '{}');
    const gap = meta.deliveryGapMinutes ?? 15;
    const conflict = OrderRepo.checkConflict(deliveryTime, phone, gap, editing?.id);
    if (conflict.conflict) {
      UI.toast(`Hay conflicto de horario (gap ${gap} min). Elige otra hora.`);
      return;
    }

    // stock check for new delivered state not needed (new orders are not delivered)
    if (editing) {
      const updated = { ...editing, fullName, phone, deliveryAddress, foodId, quantity, combo, deliveryTime };
      OrderRepo.update(updated);
      UI.toast('Pedido actualizado');
    } else {
      OrderRepo.add({ fullName, phone, deliveryAddress, foodId, quantity, combo, deliveryTime });
      UI.toast('Pedido agregado');
    }
    close();
    renderCurrent();
  }, { once: true });
}

// helper to convert ISO to local datetime-local input
function toLocalDateInput(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off*60*1000);
  return local.toISOString().slice(0,16);
}
