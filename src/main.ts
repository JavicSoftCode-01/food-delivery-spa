// src\main.ts
import './styles.css';
import { UI } from './ui/ui';
import { renderDashboard, renderClients, renderFoods, renderSettings } from './ui/components';
import { FoodRepo, FoodSaleRecordRepo } from './services/foodService';
import { OrderRepo } from './services/orderService';
import {
  formatCurrency,
  normalizeName,
  normalizePhone,
  getPhonePrefixError,
  debounce,
  isValidPhoneFormat,
  toCanonicalPhone
} from './utils';
import { FoodSaleRecord } from './models';

/** Tipo para pantallas. */
type Screen = 'dashboard' | 'clients' | 'foods' | 'settings';

/** Estado actual de pantalla. */
let currentScreen: Screen = 'dashboard';
/** Intervalo de countdown (si existe). */
let countdownIntervalId: number | undefined;
/** Segundos restantes para el cronómetro de archivado. */
let remainingSeconds = 60;

/** Export para que otros módulos actualicen el header global. */
export function updateGlobalHeaderState(): void {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = undefined;
  }

  const allActiveOrders = OrderRepo.getAll();
  const pendingCount = allActiveOrders.filter(o => !o.delivered).length;
  const deliveredCount = allActiveOrders.length - pendingCount;

  if (pendingCount > 0) {
    UI.updateHeaderContent(`<div class="pulse-animation bg-red-500 text-white text-base font-bold w-8 h-8 flex items-center justify-center rounded-full">${pendingCount}</div>`);
    remainingSeconds = 60;
  } else if (deliveredCount > 0) {
    startCountdown();
  } else {
    UI.updateHeaderContent('');
    remainingSeconds = 60;
  }
}

/** Inicia el conteo regresivo y muestra botón de archivar al finalizar. */
function startCountdown(): void {
  const showArchiveButton = () => {
    const buttonHtml = `<button id="archive-btn" title="Archivar pedidos entregados" class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600"><i class="fa fa-trash-can fa-lg"></i></button>`;
    if (currentScreen === 'clients') {
      UI.updateHeaderContent(buttonHtml);
      const btn = document.getElementById('archive-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          UI.confirm('¿Deseas archivar todos los pedidos ya entregados?', () => {
            OrderRepo.archiveDeliveredOrders();
            renderCurrent();
          });
        },);
      }
    } else {
      UI.updateHeaderContent('');
    }
  };

  const updateTimerDisplay = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timerHtml = `<div class="bg-gray-400 text-white text-sm font-mono w-12 h-8 flex items-center justify-center rounded-lg">${minutes}:${seconds.toString().padStart(2, '0')}</div>`;
    if (currentScreen === 'clients') UI.updateHeaderContent(timerHtml);
    else UI.updateHeaderContent('');
  };

  if (remainingSeconds <= 0) {
    showArchiveButton();
    return;
  }

  updateTimerDisplay();

  countdownIntervalId = window.setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
        countdownIntervalId = undefined;
      }
      showArchiveButton();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

/** Renderiza la pantalla actual usando los renderers del UI. */
function renderCurrent(): void {
  UI.updateTitle(currentScreen);
  UI.renderNavActive(currentScreen);
  updateGlobalHeaderState();

  const main = document.getElementById('mainArea')!;
  main.innerHTML = '';
  const container = document.createElement('div');
  main.appendChild(container);

  if (currentScreen === 'dashboard') renderDashboard(container);
  else if (currentScreen === 'clients') renderClients(container);
  else if (currentScreen === 'foods') renderFoods(container);
  else if (currentScreen === 'settings') renderSettings(container);
}

/** Inicializa el tema oscuro si está guardado en localStorage. */
function initializeTheme(): void {
  const metaRaw = localStorage.getItem('fd_meta_v1') || '{}';
  let meta: { darkMode?: boolean } = {};
  try { meta = JSON.parse(metaRaw) || {}; } catch { meta = {}; }
  if (meta.darkMode) {
    document.documentElement.classList.add('dark');
  }
}

/** Inicializa shell y listeners de navegación. */
function bootstrap(): void {
  initializeTheme();
  UI.renderShell();

  // Delegado de navegación (botones creados por renderShell)
  document.querySelectorAll<HTMLElement>('#bottomNav .nav-item').forEach((b) => {
    b.setAttribute('tabindex', '0');
    b.addEventListener('click', (e) => {
      const screen = (e.currentTarget as HTMLElement).dataset.screen as Screen | undefined;
      if (screen && screen !== currentScreen) {
        currentScreen = screen;
        renderCurrent();
      }
    });
  });

  // Eventos globales para abrir formularios desde otros módulos
  document.addEventListener('openOrderForm', (e) => {
    const id = (e as CustomEvent).detail?.id as string | undefined;
    openOrderForm(id);
  });

  document.addEventListener('openFoodForm', (e) => {
    const id = (e as CustomEvent).detail?.id as string | undefined;
    openFoodForm(id);
  });

  document.addEventListener('openSalesHistory', (e) => {
    const foodId = (e as CustomEvent).detail?.foodId as string | undefined;
    if (foodId) openSalesHistoryModal(foodId);
  });

  renderCurrent();
}

/* -------------------- Helpers para formularios de Pedido -------------------- */

/** Convierte un ISO a valor compatible con <input type="datetime-local">. */
function toLocalDateInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

/** Crea opciones HTML para el select de comidas. */
function buildFoodOptions(editingFoodId?: string): string {
  const foods = FoodRepo.getAll().filter(f => f.isActive || f.id === editingFoodId);
  return foods.map(f => `<option ${editingFoodId === f.id ? 'selected' : ''} value="${f.id}" data-price="${f.price}">${f.name} (Stock: ${f.stock})</option>`).join('');
}

/**
 * Abre el modal del formulario de pedido para crear/editar.
 * - Si se crea (no editing): al intentar guardar y existir conflicto, ajusta el input de hora automáticamente y muestra toast.
 * - Si se edita: comportamiento similar (se sugiere revisar ajuste), pero el formulario cierra al guardar normalmente.
 * @param orderId id del pedido a editar (opcional).
 */
function openOrderForm(orderId?: string): void {
  const editing = orderId ? OrderRepo.findById(orderId) : null;
  const optionsHtml = buildFoodOptions(editing?.foodId);

  // Extraer solo la hora si está editando
  const timeOnly = editing ? new Date(editing.deliveryTime).toTimeString().slice(0, 5) : '';

  const html = `
  <div class="relative max-h-[70vh] overflow-y-auto">
    <div class="pr-8 text-center mb-6">
      <h3 class="text-xl font-bold inline-flex items-center gap-2 justify-center">
        ${editing ? 'Editar pedido' : 'Agregar pedido'}
        <i class="fa-solid fa-file-invoice-dollar fa-lg"></i>
      </h3>
    </div>
    <form id="orderForm" class="space-y-4">
      <div class="pb-2">
        <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
          <i class="fa fa-user"></i>Nombre completo:
        </label>
        <input name="fullName" value="${editing?.fullName ?? ''}" required
          class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1"
          placeholder="Ingresa el nombre completo" />
      </div>

      <div class="pb-2">
        <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
          <i class="fa fa-phone"></i> Teléfono:
        </label>
        <input name="phone" id="phoneInput" value="${editing?.phone ?? ''}" required type="tel" inputmode="tel"
          placeholder="Formatos: 09xxxxxxxx, +593xxxxxxxxx"
          class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1" />
      </div>

      <div class="pb-2">
        <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
          <i class="fa fa-map-marker-alt"></i> Dirección de entrega:
        </label>
        <input name="deliveryAddress" value="${editing?.deliveryAddress ?? ''}" required
          class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1"
          placeholder="Dirección completa" />
      </div>

      <div class="grid grid-cols-2 gap-4 pb-2">
        <div>
          <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
            <i class="fa fa-clock"></i>Hora:
          </label>
          <input name="deliveryTime" type="time" value="${timeOnly}" required
            class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer">
            <div class="relative">
              <input name="combo" id="comboCheckbox" type="checkbox" ${editing?.combo ? 'checked' : ''} class="sr-only" />
              <div class="combo-checkbox w-6 h-6 border-2 border-gray-400 dark:border-dark-border rounded flex items-center justify-center transition-colors">
                <i class="fa fa-check text-white text-sm hidden"></i>
              </div>
            </div>
            <span class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
              <i class="fa fa-gift"></i> Combo
            </span>
          </label>
        </div>
      </div>

      <div class="pb-2">
        <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
          <i class="fa fa-utensils"></i> Comida:
        </label>
        <select name="foodId" id="foodSelect" class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1">
          <option value="">Seleccionar comida...</option>
          ${optionsHtml}
        </select>
      </div>

      <div class="grid grid-cols-3 gap-4 pb-2">
        <!-- Cantidad -->
        <div class="text-center">
          <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center justify-center gap-2 mb-1">
            <i class="fa fa-sort-numeric-up"></i> Cantidad:
          </label>
          <input 
            name="quantity" 
            id="quantityInput" 
            type="number" 
            min="1" 
            value="${editing?.quantity ?? 1}"
            class="w-full text-center text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1" 
          />
        </div>

        <!-- Unidad -->
        <div class="text-center">
          <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center justify-center gap-2 mb-1">
            <i class="fa fa-tag"></i> Unidad:
          </label>
          <div id="unitPrice" class="text-gray-800 dark:text-dark-text text-lg font-semibold p-1 -mt-1">$0.00</div>
        </div>

        <!-- Total -->
        <div class="text-center">
          <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center justify-center gap-2 mb-1">
            <i class="fa fa-calculator"></i> Total:
          </label>
          <div id="totalPrice" class="font-bold text-2xl text-green-600 p-1 -mt-2">$0.00</div>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-6">
        <button type="button" id="cancelOrder" class="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg">
          <i class="fa fa-times fa-lg"></i> Cancelar
        </button>
        <button type="submit" id="submitOrder" class="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors font-semibold text-lg">
          <i class="fa ${editing ? 'fa-edit' : 'fa-plus'} fa-lg"></i> ${editing ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
    </form>
  </div>
`;

  // Abrir modal y obtener elemento
  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });

  // Referencias
  const phoneInput = element.querySelector('#phoneInput') as HTMLInputElement;
  const foodSelect = element.querySelector('#foodSelect') as HTMLSelectElement;
  const quantityInput = element.querySelector('#quantityInput') as HTMLInputElement;
  const comboCheckbox = element.querySelector('#comboCheckbox') as HTMLInputElement;
  const unitPriceDiv = element.querySelector('#unitPrice')!;
  const totalPriceDiv = element.querySelector('#totalPrice')!;
  const cancelBtn = element.querySelector('#cancelOrder') as HTMLButtonElement;
  const orderForm = element.querySelector('#orderForm') as HTMLFormElement;
  const fullNameInput = orderForm.querySelector('input[name="fullName"]') as HTMLInputElement;
  const deliveryAddressInput = orderForm.querySelector('input[name="deliveryAddress"]') as HTMLInputElement;
  const timeInput = orderForm.querySelector('input[name="deliveryTime"]') as HTMLInputElement;

  // Handlers nombrados para poder removerlos
  const updateCheckboxStyle = () => {
    const checkboxContainer = element.querySelector('.combo-checkbox')!;
    const checkIcon = checkboxContainer.querySelector('.fa-check')!;
    if (comboCheckbox.checked) {
      checkboxContainer.classList.add('bg-accent', 'border-accent');
      checkboxContainer.classList.remove('border-gray-400', 'dark:border-dark-border');
      checkIcon.classList.remove('hidden');
    } else {
      checkboxContainer.classList.remove('bg-accent', 'border-accent');
      checkboxContainer.classList.add('border-gray-400', 'dark:border-dark-border');
      checkIcon.classList.add('hidden');
    }
  };

  const updatePricing = () => {
    const selectedOption = foodSelect.selectedOptions[0];
    const unitPrice = selectedOption ? parseFloat(selectedOption.dataset.price || '0') : 0;
    const quantity = Math.max(1, parseInt(quantityInput.value || '1', 10));
    const total = unitPrice * quantity;
    unitPriceDiv.textContent = formatCurrency(unitPrice);
    totalPriceDiv.textContent = formatCurrency(total);
  };

  const handlePhoneInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    input.value = normalizePhone(input.value);
  };

  const updatePhoneValidation = () => {
    const value = phoneInput.value;
    if (value.length === 0) {
      phoneInput.classList.remove('border-green-500', 'border-red-500');
      phoneInput.classList.add('border-gray-300');
    } else if (isValidPhoneFormat(value)) {
      phoneInput.classList.remove('border-gray-300', 'border-red-500');
      phoneInput.classList.add('border-green-500');
    } else {
      phoneInput.classList.remove('border-green-500', 'border-red-500');
      phoneInput.classList.add('border-gray-300');
    }
  };

  const debouncedPrefixCheck = debounce(() => {
    const errorMessage = getPhonePrefixError(phoneInput.value);
    if (errorMessage) UI.toast(errorMessage);
  }, 3000);

  /**
   * Ajusta el input timeInput al siguiente hueco libre que cumpla el gap.
   * No guarda automáticamente: se muestra un toast y se retorna al usuario para que confirme (re-entregue el submit).
   * @param requestedMs tiempo solicitado (ms)
   * @param gapMinutes brecha en minutos
   */
  const adjustTimeToGap = (requestedMs: number, gapMinutes: number): number => {
    const gapMs = Math.abs(gapMinutes) * 60 * 1000;
    const othersMs = OrderRepo.getAll()
      .filter(o => !(editing && o.id === editing.id))
      .map(o => new Date(o.deliveryTime).getTime());

    let candidate = requestedMs;
    let iter = 0;
    while (true) {
      const conflicting = othersMs.filter(oMs => Math.abs(candidate - oMs) < gapMs);
      if (conflicting.length === 0) break;
      // ajustar al máximo conflicting + gap
      const maxConflicting = Math.max(...conflicting);
      candidate = Math.max(candidate, maxConflicting + gapMs);
      iter++;
      if (iter > 50) break; // safety
    }
    return candidate;
  };

  // submit handler (nombrado para removerlo al cerrar)
  const onSubmit = (ev: Event) => {
    ev.preventDefault(); // siempre prevenir submit por defecto
    const data = new FormData(orderForm);
    const fullName = normalizeName(String(data.get('fullName') || ''));
    const phone = normalizePhone(String(data.get('phone') || ''));
    const deliveryAddress = normalizeName(String(data.get('deliveryAddress') || ''));
    const foodId = String(data.get('foodId') || '');
    const quantity = Math.max(1, Number(data.get('quantity')) || 1);
    const combo = !!data.get('combo');
    const timeValue = String(data.get('deliveryTime') || '');

    if (!timeValue) { UI.toast('Selecciona una hora de entrega.'); return; }

    let deliveryTimeIso = '';
    try {
      // Crear fecha completa combinando la fecha actual con la hora seleccionada
      const today = new Date();
      const [hours, minutes] = timeValue.split(':');
      today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      deliveryTimeIso = today.toISOString();
    } catch {
      UI.toast('Hora de entrega inválida.');
      return;
    }

    if (!fullName || !phone || !deliveryAddress) { UI.toast('Completa todos los campos requeridos.'); return; }
    if (!isValidPhoneFormat(phone)) { UI.toast('El formato del teléfono es inválido.'); phoneInput.focus(); phoneInput.classList.add('border-red-500'); return; }
    if (!foodId) { UI.toast('Selecciona una comida.'); return; }

    const food = FoodRepo.findById(foodId);
    if (!food) { UI.toast('La comida seleccionada no fue encontrada.'); return; }
    if (food.stock < quantity) { UI.toast(`Stock insuficiente para "${food.name}". Stock actual: ${food.stock}.`); return; }

    const canonicalPhone = toCanonicalPhone(phone);
    if (canonicalPhone) {
      const existingOrder = OrderRepo.getAll().find(order => {
        if (editing && order.id === editing.id) return false;
        return toCanonicalPhone(order.phone) === canonicalPhone;
      });
      if (existingOrder) {
        UI.toast(`El teléfono ya está registrado para el cliente '${existingOrder.fullName}'.`);
        phoneInput.focus();
        phoneInput.classList.add('border-red-500');
        return;
      }
    }

    const meta = JSON.parse(localStorage.getItem('fd_meta_v1') || '{}');
    const gap = meta.deliveryGapMinutes ?? 15;

    // comprobar conflicto (usa checkConflict existente)
    const conflict = OrderRepo.checkConflict(deliveryTimeIso, phone, gap, editing?.id);
    if (conflict.conflict) {
      // Ajustar automáticamente el campo de hora al siguiente hueco que cumpla el gap y avisar al admin.
      const requestedMs = new Date(deliveryTimeIso).getTime();
      const adjustedMs = adjustTimeToGap(requestedMs, gap);

      // Formatear adjustedMs a HH:MM local (para el input[type=time])
      const adjustedDate = new Date(adjustedMs);
      const hh = String(adjustedDate.getHours()).padStart(2, '0');
      const mm = String(adjustedDate.getMinutes()).padStart(2, '0');
      timeInput.value = `${hh}:${mm}`;

      UI.toast(`Conflicto de entrega. Hora ajustada para cumplir ${gap} min de intervalo.`);

      // No guardar aún: el usuario puede revisar y volver a presionar guardar.
      return;
    }

    const payload = { fullName, phone, deliveryAddress, foodId, quantity, combo, deliveryTime: deliveryTimeIso };

    let success = false;
    if (editing) {
      // edición: comportamiento previo (guardar y cerrar)
      success = OrderRepo.update({ ...editing, ...payload });
      if (success) {
        UI.toast('Pedido actualizado exitosamente.');
        // cerrar modal y limpiar listeners
        cleanup();
        close();
        renderCurrent();
      }
      return;
    } else {
      // nuevo pedido: guardar, mostrar toast, NO cerrar; limpiar inputs para nuevo ingreso
      const newOrder = OrderRepo.add(payload);
      if (newOrder) {
        success = true;
        UI.toast('Pedido agregado exitosamente.');
      }
    }

    if (success) {
      // refrescar vistas/subcomponentes (sin cerrar modal)
      renderCurrent();

      // limpiar formulario para nuevo ingreso
      orderForm.reset(); // revierte a los valores por defecto del HTML
      // asegurarse de valores por defecto coherentes
      quantityInput.value = '1';
      comboCheckbox.checked = false;
      // limpiar selects/inputs
      foodSelect.value = '';
      phoneInput.value = '';
      fullNameInput.value = '';
      deliveryAddressInput.value = '';
      // establecer hora por defecto a la hora local actual (HH:MM)
      const now = new Date();
      const nh = String(now.getHours()).padStart(2, '0');
      const nm = String(now.getMinutes()).padStart(2, '0');
      timeInput.value = `${nh}:${nm}`;

      // actualizar vistas internas del modal
      updateCheckboxStyle();
      updatePricing();
      updatePhoneValidation();

      // poner foco en nombre para entrada rápida del siguiente pedido
      fullNameInput.focus();
    }
  };

  // cleanup y listeners de cancel
  const cleanup = () => {
    try { orderForm.removeEventListener('submit', onSubmit); } catch {}
    try { cancelBtn.removeEventListener('click', onCancel); } catch {}
    try { phoneInput.removeEventListener('input', onPhoneInput); } catch {}
    try { phoneInput.removeEventListener('blur', onPhoneBlur); } catch {}
    try { phoneInput.removeEventListener('focus', onPhoneFocus); } catch {}
    try { foodSelect.removeEventListener('change', onFoodChange); } catch {}
    try { quantityInput.removeEventListener('input', onQuantityInput); } catch {}
    try { comboCheckbox.removeEventListener('change', onComboChange); } catch {}
  };

  // otros handlers nombrados para remover/añadir
  const onCancel = () => { cleanup(); close(); };
  const onPhoneInput = (ev: Event) => { handlePhoneInput(ev); updatePhoneValidation(); debouncedPrefixCheck(); };
  const onPhoneBlur = () => {
    const value = phoneInput.value;
    if (value.length > 0 && !isValidPhoneFormat(value)) {
      phoneInput.classList.add('border-red-500');
      phoneInput.classList.remove('border-gray-300', 'border-green-500');
    }
  };
  const onPhoneFocus = () => {
    if (phoneInput.classList.contains('border-red-500')) {
      phoneInput.classList.remove('border-red-500');
      phoneInput.classList.add('border-gray-300');
    }
  };
  const onFoodChange = () => updatePricing();
  const onQuantityInput = () => updatePricing();
  const onComboChange = () => updateCheckboxStyle();

  // Atachamos listeners
  orderForm.addEventListener('submit', onSubmit);
  cancelBtn.addEventListener('click', onCancel);
  phoneInput.addEventListener('input', onPhoneInput);
  phoneInput.addEventListener('blur', onPhoneBlur);
  phoneInput.addEventListener('focus', onPhoneFocus);
  foodSelect.addEventListener('change', onFoodChange);
  quantityInput.addEventListener('input', onQuantityInput);
  comboCheckbox.addEventListener('change', onComboChange);

  // init UI state
  updateCheckboxStyle();
  updatePricing();
  updatePhoneValidation();
}



/* -------------------- Helpers / Formulario Comida -------------------- */

/**
 * Abre modal para crear/editar comida.
 * Se asegura de NO usar `once:true` en submit y limpia listeners al cerrar.
 * @param foodId id de comida si se edita, undefined si se crea.
 */
function openFoodForm(foodId?: string): void {
  const editing = foodId ? FoodRepo.findById(foodId) : null;
  const isLinkedToOrder = editing ? OrderRepo.isFoodInActiveOrder(editing.id) : false;
  const activeRecord = editing ? FoodSaleRecordRepo.findLatestActiveByFoodId(editing.id) : null;
  const startTime = activeRecord?.startTime || '08:00';
  const endTime = activeRecord?.endTime || '23:00';

  let stockAndActiveHtml = '';
  if (editing) {
    const isDisabled = isLinkedToOrder;
    const disabledAttr = isDisabled ? 'disabled' : '';
    const tooltip = isDisabled ? 'title="No se puede desactivar: la comida está en un pedido activo."' : '';
    const labelClass = isDisabled ? 'cursor-not-allowed opacity-60' : '';
    stockAndActiveHtml = `
      <div class="grid grid-cols-2 gap-4">
        <div class="pb-2">
          <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
            <i class="fa fa-sort-numeric-up"></i> Stock:
          </label>
          <input name="stock" type="number" min="0" value="${editing.stock}" 
            class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
        <div class="flex items-end pb-2">
          <label class="flex items-center gap-2 cursor-pointer ${labelClass}" ${tooltip}>
            <div class="relative">
              <input name="isActive" type="checkbox" ${editing.isActive ? 'checked' : ''} ${disabledAttr} class="sr-only" />
              <div class="active-checkbox w-6 h-6 border-2 border-gray-400 dark:border-dark-border rounded flex items-center justify-center transition-colors">
                <i class="fa fa-check text-white text-sm hidden"></i>
              </div>
            </div>
            <span class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
              <i class="fa fa-power-off"></i> Activo
            </span>
          </label>
        </div>
      </div>`;
  } else {
    stockAndActiveHtml = `
      <div class="pb-2">
        <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
          <i class="fa fa-sort-numeric-up"></i> Stock inicial:
        </label>
        <input name="stock" type="number" min="0" value="0" 
          class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1" />
      </div>`;
  }

  const html = `
  <div class="relative max-h-[70vh] overflow-y-auto">
    <div class="pr-8 text-center mb-6">
      <h3 class="text-xl font-bold inline-flex items-center gap-2 justify-center">
        ${editing ? 'Editar Comida' : 'Agregar Comida'}
        <i class="fa-solid fa-utensils fa-lg"></i>
      </h3>
    </div>
    <form id="foodForm" class="space-y-4">
      <div class="pb-2">
        <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
          <i class="fa fa-tag"></i> Nombre:
        </label>
        <input name="name" value="${editing?.name ?? ''}" required
          class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1"
          placeholder="Ingresa el nombre de la comida" />
      </div>

      <div class="grid grid-cols-2 gap-4 pb-2">
        <div>
          <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
            <i class="fa fa-dollar-sign"></i> Costo:
          </label>
          <input name="cost" type="number" step="0.01" min="0" value="${editing?.cost ?? 0}" 
            class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
        <div>
          <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
            <i class="fa fa-tag"></i> Precio:
          </label>
          <input name="price" type="number" step="0.01" min="0" value="${editing?.price ?? 0}" 
            class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1" />
        </div>
      </div>

      ${stockAndActiveHtml}

      <div class="pt-4 pb-2">
        <p class="text-base text-gray-500 dark:text-gray-400 font-bold mb-4 flex items-center gap-2">
          <i class="fa fa-clock"></i> Horario de venta para esta sesión
        </p>
        <div class="grid grid-cols-2 gap-4">
          <div class="pb-2">
            <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
              <i class="fa fa-play"></i> Desde:
            </label>
            <input name="startTime" type="time" value="${startTime}" step="60"
              class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1" />
          </div>
          <div class="pb-2">
            <label class="text-base text-gray-500 dark:text-gray-400 font-bold flex items-center gap-2">
              <i class="fa fa-stop"></i> Hasta:
            </label>
            <input name="endTime" type="time" value="${endTime}" step="60"
              class="w-full text-gray-800 dark:text-dark-text bg-transparent border-0 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none p-1 mt-1" />
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-6">
        <button type="button" id="cancelFood" class="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg">
          <i class="fa fa-times fa-lg"></i> Cancelar
        </button>
        <button type="submit" id="submitFood" class="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold text-lg">
          <i class="fa ${editing ? 'fa-edit' : 'fa-plus'} fa-lg"></i> ${editing ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
    </form>
  </div>`;

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
  const cancelBtn = element.querySelector('#cancelFood') as HTMLButtonElement;
  const foodForm = element.querySelector('#foodForm') as HTMLFormElement;
  const activeCheckbox = element.querySelector('input[name="isActive"]') as HTMLInputElement;

  // Handler para actualizar el estilo del checkbox de activo
  const updateActiveCheckboxStyle = () => {
    if (!activeCheckbox) return;
    const checkboxContainer = element.querySelector('.active-checkbox')!;
    const checkIcon = checkboxContainer.querySelector('.fa-check')!;
    if (activeCheckbox.checked) {
      checkboxContainer.classList.add('bg-accent', 'border-accent');
      checkboxContainer.classList.remove('border-gray-400', 'dark:border-dark-border');
      checkIcon.classList.remove('hidden');
    } else {
      checkboxContainer.classList.remove('bg-accent', 'border-accent');
      checkboxContainer.classList.add('border-gray-400', 'dark:border-dark-border');
      checkIcon.classList.add('hidden');
    }
  };

  // Handlers nombrados
  const cleanup = () => {
    try { foodForm.removeEventListener('submit', onSubmit); } catch {}
    try { cancelBtn.removeEventListener('click', onCancel); } catch {}
    if (activeCheckbox) {
      try { activeCheckbox.removeEventListener('change', onActiveChange); } catch {}
    }
  };

  const onCancel = () => { cleanup(); close(); };

  const onActiveChange = () => updateActiveCheckboxStyle();

  const onSubmit = (ev: Event) => {
    ev.preventDefault();
    const data = new FormData(foodForm);
    const name = normalizeName(String(data.get('name') || ''));
    const cost = Number(data.get('cost')) || 0;
    const price = Number(data.get('price')) || 0;
    const stock = Math.max(0, Number(data.get('stock')) || 0);
    const startTime = String(data.get('startTime') || '');
    const endTime = String(data.get('endTime') || '');

    if (!name) { UI.toast('Nombre requerido'); return; }
    if (FoodRepo.nameExists(name, editing?.id)) { UI.toast('El nombre ya existe'); return; }
    if (!startTime || !endTime) { UI.toast('Debe especificar un horario de venta.'); return; }

    if (editing) {
      const isActive = !!data.get('isActive');
      if (isLinkedToOrder && !isActive) { UI.toast('Actualización bloqueada: pedido activo'); return; }
      const updated = { ...editing, name, cost: +cost.toFixed(2), price: +price.toFixed(2), stock, isActive };
      FoodRepo.update(updated, { startTime, endTime });
      UI.toast('Comida actualizada');
    } else {
      FoodRepo.add({ name, cost: +cost.toFixed(2), price: +price.toFixed(2), stock }, { startTime, endTime });
      UI.toast('Comida agregada');
    }

    cleanup();
    close();
    renderCurrent();
  };

  // Attach listeners
  foodForm.addEventListener('submit', onSubmit);
  cancelBtn.addEventListener('click', onCancel);
  if (activeCheckbox) {
    activeCheckbox.addEventListener('change', onActiveChange);
  }

  // Inicializar estado del checkbox
  updateActiveCheckboxStyle();
}

/** Muestra modal con historial de ventas y detalles. */
function openSalesHistoryModal(foodId: string): void {
  const food = FoodRepo.findById(foodId);
  if (!food) { UI.toast('Comida no encontrada'); return; }

  let modalRef: { close: () => void; element: HTMLElement } | null = null;

  const renderDetails = (record: FoodSaleRecord) => {
    const detailHtml = `
      <button id="closeHistory" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
      <div class="p-1">
        <button id="backToList" class="text-sm text-accent hover:underline mb-3"><i class="fa fa-arrow-left mr-2"></i>Volver a la lista</button>
        <h4 class="text-lg font-bold text-center mb-4 text-gray-800 dark:text-dark-text">Detalles del ${record.recordDate}</h4>
        <div class="space-y-3 text-sm bg-gray-50 dark:bg-dark-bg p-4 rounded-lg border dark:border-dark-border">
          <p class="flex justify-between"><strong><i class="fa fa-calendar-alt w-5 text-gray-500 dark:text-gray-400"></i>Fecha:</strong> <span>${record.recordDate}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-clock w-5 text-gray-500 dark:text-gray-400"></i>Horario:</strong> <span>${record.startTime} - ${record.endTime}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-cubes w-5 text-gray-500 dark:text-gray-400"></i>Stock Inicial:</strong> <span>${record.initialStock}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-tag w-5 text-gray-500 dark:text-gray-400"></i>Precio:</strong> <span>${formatCurrency(record.unitPrice)}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-dollar-sign w-5 text-gray-500 dark:text-gray-400"></i>Costo:</strong> <span>${formatCurrency(record.unitCost)}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-chart-line w-5 text-gray-500 dark:text-gray-400"></i>Vendidos:</strong> <span>${record.quantitySold}</span></p>
          <p class="flex justify-between"><strong><i class="fa fa-toggle-on w-5 text-gray-500 dark:text-gray-400"></i>Estado:</strong> <span class="font-semibold ${record.isActive ? 'text-green-600' : 'text-red-500'}">${record.isActive ? 'Activa' : 'Finalizada'}</span></p>
        </div>
      </div>`;
    if (!modalRef) return;
    modalRef.element.innerHTML = detailHtml;
    modalRef.element.querySelector('#closeHistory')!.addEventListener('click', modalRef.close);
    modalRef.element.querySelector('#backToList')!.addEventListener('click', renderList);
  };

  const renderList = () => {
    const history = FoodSaleRecordRepo.findByFoodId(foodId);
    let listContent: string;
    if (history.length === 0) {
      listContent = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No hay historial de ventas para esta comida.</p>';
    } else {
      const listItems = history.map(record => `
        <li class="border-b dark:border-dark-border last:border-b-0">
          <button data-record-id="${record.id}" class="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center record-item transition-colors">
            <div class="font-medium"><i class="fa fa-calendar-day mr-2 text-gray-400"></i> ${record.recordDate} <span class="text-xs text-gray-500 dark:text-gray-400">(${record.startTime} - ${record.endTime})</span></div>
            <div class="text-sm">Vendidos: <strong>${record.quantitySold}</strong> <span class="text-xs ${Math.abs(record.unitPrice - food.price) > 0.001 ? 'text-blue-500' : ''}">(${formatCurrency(record.unitPrice)})</span></div>
          </button>
        </li>`).join('');
      listContent = `<ul class="bg-white dark:bg-dark-bg rounded-lg border dark:border-dark-border">${listItems}</ul>`;
    }

    const fullHtml = `
      <button id="closeHistory" class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 z-20"><i class="fa fa-times text-lg"></i></button>
      <div class="p-1">
        <h3 class="text-xl font-bold mb-4 text-center">Historial: ${food.name}</h3>
        <div class="modal-content-container max-h-96 overflow-y-auto">
          ${listContent}
        </div>
      </div>`;

    if (!modalRef) {
      modalRef = UI.modal(fullHtml, { closeOnBackdropClick: false });
    } else {
      modalRef.element.innerHTML = fullHtml;
    }
    modalRef.element.querySelector('#closeHistory')!.addEventListener('click', modalRef.close);
    modalRef.element.querySelectorAll<HTMLElement>('.record-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const recordId = (e.currentTarget as HTMLElement).dataset.recordId!;
        const selectedRecord = history.find(r => r.id === recordId)!;
        renderDetails(selectedRecord);
      });
    });
  };

  renderList();
}

/* -------------------- Bootstrap app -------------------- */

bootstrap();
