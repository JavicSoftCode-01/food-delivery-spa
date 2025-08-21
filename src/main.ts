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
import { Combo, FoodSaleRecord } from './models';

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

  // Scroll-to-top button logic
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      const shouldBeVisible = window.scrollY > 200 && (currentScreen === 'clients' || currentScreen === 'foods');
      if (shouldBeVisible) {
        scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      } else {
        scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      }
    }, { passive: true });

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

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
  return foods.map(f => {
    const reservedStock = OrderRepo.getReservedStockForFood(f.id);
    const availableStock = f.stock - reservedStock;
    return `<option ${editingFoodId === f.id ? 'selected' : ''} value="${f.id}" data-price="${f.price}">${f.name} (Disp: ${availableStock})</option>`
  }).join('');
}

/**
 * Abre el modal del formulario de pedido para crear/editar.
 * - Si se crea (no editing): al intentar guardar y existir conflicto, ajusta el input de hora automáticamente y muestra toast.
 */
function openOrderForm(orderId?: string): void {
  if (document.getElementById('orderForm')) {
    return;
  }

  const editing = orderId ? OrderRepo.findById(orderId) : null;
  const optionsHtml = buildFoodOptions(editing?.foodId);

  const timeOnly = editing ? new Date(editing.deliveryTime).toTimeString().slice(0, 5) : '';

  // 🔒 Determinar si el pedido está entregado (bloqueo de edición)
  const isDelivered = editing ? editing.delivered : false;
  const disabledAttr = isDelivered ? 'disabled' : '';
  const disabledClass = isDelivered ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : '';

  const html = `
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">
    
    <!-- 1. CABECERA FIJA -->
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar"></i>
        <span>${editing ? 'Editar Pedido' : 'Agregar Pedido'}</span>
        ${isDelivered ? '<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">🔒 ENTREGADO</span>' : ''}
      </h3>
    <!--  ${isDelivered ? '<div class="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">Los campos están bloqueados porque el pedido fue entregado</div>' : ''} -->
    </div>

    <!-- 2. CONTENIDO DEL FORMULARIO (LA ÚNICA PARTE CON SCROLL) -->
    <div class="flex-1 overflow-y-auto p-2 -mt-1">
      <form id="orderForm" class="space-y-4">
        
        <!-- Nombre completo -->
        <div>
          <label for="fullName" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-user w-4"></i>Nombres</label>
          <input id="fullName" name="fullName" value="${editing?.fullName ?? ''}" required ${disabledAttr}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"
            placeholder="Ingresar nombres completos" />
        </div>
        
        <!-- Dirección de entrega -->
        <div>
          <label for="deliveryAddress" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-map-marker-alt w-4"></i>Dirección</label>
          <input id="deliveryAddress" name="deliveryAddress" value="${editing?.deliveryAddress ?? ''}" required ${disabledAttr}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"
            placeholder="Ingresar dirección" />
        </div>
        
        <!-- Rejilla: Teléfono y Hora (2 Columnas) -->
        <div class="grid grid-cols-2 gap-x-4">
          <div>
            <label for="phone" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-phone w-4"></i>Teléfono</label>
            <input id="phone" name="phone" value="${editing?.phone ?? ''}" required type="tel" inputmode="tel" ${disabledAttr}
              placeholder="Formato 09 o +593"
              class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}" />
          </div>
          <div>
            <label for="deliveryTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-clock w-4"></i>Hora</label>
            <input id="deliveryTime" name="deliveryTime" type="time" value="${timeOnly}" required ${disabledAttr}
              class="text-base w-full bg-transparent p-1 mb-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}" />
          </div>
        </div>
        
        <!-- Rejilla: Comida y Combo (2 Columnas) -->
        <div class="grid grid-cols-2 gap-x-4">
          <div>
            <div class="flex justify-between items-center">
              <label for="foodId" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-utensils w-4"></i>Comida</label>
              <div id="unitPriceDisplay" class="text-sm text-gray-500 dark:text-gray-400 font-semibold"></div>
            </div>
            <select id="foodId" name="foodId" ${disabledAttr} class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}">
              <option value="">Elegir comida</option>
              ${optionsHtml}
            </select>
          </div>
          <div id="comboContainer">
            <label for="comboId" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-gift w-4"></i>Combo</label>
            <select id="comboId" name="comboId" ${disabledAttr} class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}">
              <option value="">Sin combo</option>
            </select>
          </div>
        </div>
        
        <!-- Rejilla: Cantidades y Total (3 Columnas) -->
        <div class="grid grid-cols-3 gap-x-4">
          <div class="text-center">
            <label for="quantity" class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-sort-numeric-up w-4"></i>Cant. U.</label>
            <input id="quantity" name="quantity" type="number" min="0" value="${editing?.quantity ?? 0}" ${disabledAttr}
              class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"/>
          </div>
          <div class="text-center">
            <label for="comboQuantity" class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-gift w-4"></i>Combos</label>
            <input id="comboQuantity" name="comboQuantity" type="number" min="0" value="${editing?.comboQuantity ?? 0}" ${disabledAttr}
              class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"/>
          </div>
          <div class="text-center">
            <label class="flex items-center justify-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-calculator w-3"></i>Total</label>
            <div id="totalPrice" class="font-bold text-xl text-green-600 p-1">$0.00</div>
          </div>
        </div>
      </form>
    </div>

    <!-- 3. PIE DE PÁGINA FIJO (BOTONES SIEMPRE VISIBLES) -->
    <div class="flex-shrink-0 flex justify-center gap-10 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <button type="button" id="cancelOrder" class="flex items-center gap-2 p-2 text-white bg-red-500 rounded-lg hover:bg-red-600 font-semibold text-base"><i class="fa fa-times fa-lg"></i> Cancelar</button>
      <button type="submit" form="orderForm" id="submitOrder" 
              class="flex items-center gap-2 p-2 bg-accent text-white rounded-lg font-semibold text-base transition-all duration-200 ${editing && !isDelivered ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent/90'}" 
              ${editing && !isDelivered ? 'disabled' : ''}>
        <i class="fa ${editing ? 'fa-save' : 'fa-plus'} fa-lg"></i> 
        ${editing ? 'Actualizar' : 'Agregar'}
      </button>
    </div>
  </div>`;

  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });

  const cleanupAndClose = () => {
    close();
    window.removeEventListener('resize', setVH);
  };

  const phoneInput = element.querySelector('input[name="phone"]') as HTMLInputElement;
  const foodSelect = element.querySelector('select[name="foodId"]') as HTMLSelectElement;
  const comboSelect = element.querySelector('select[name="comboId"]') as HTMLSelectElement;
  const quantityInput = element.querySelector('input[name="quantity"]') as HTMLInputElement;
  const comboQuantityInput = element.querySelector('input[name="comboQuantity"]') as HTMLInputElement;
  const totalPriceDiv = element.querySelector('#totalPrice')!;
  const unitPriceDiv = element.querySelector('#unitPriceDisplay')!;
  const cancelBtn = element.querySelector('#cancelOrder') as HTMLButtonElement;
  const orderForm = element.querySelector('#orderForm') as HTMLFormElement;
  const fullNameInput = orderForm.querySelector('input[name="fullName"]') as HTMLInputElement;
  const deliveryAddressInput = orderForm.querySelector('input[name="deliveryAddress"]') as HTMLInputElement;
  const timeInput = orderForm.querySelector('input[name="deliveryTime"]') as HTMLInputElement;
  const submitBtn = element.querySelector('#submitOrder') as HTMLButtonElement;

  // 🔍 DETECCIÓN DE CAMBIOS PARA HABILITAR/DESHABILITAR BOTÓN DE ACTUALIZAR
  let originalData: any = null;

  const captureOriginalData = () => {
    if (editing) {
      originalData = {
        fullName: fullNameInput.value,
        phone: phoneInput.value,
        deliveryAddress: deliveryAddressInput.value,
        deliveryTime: timeInput.value,
        foodId: foodSelect.value,
        quantity: parseInt(quantityInput.value, 10) || 0,
        comboId: comboSelect.value,
        comboQuantity: parseInt(comboQuantityInput.value, 10) || 0
      };
    }
  };

  const getCurrentData = () => ({
    fullName: fullNameInput.value,
    phone: phoneInput.value,
    deliveryAddress: deliveryAddressInput.value,
    deliveryTime: timeInput.value,
    foodId: foodSelect.value,
    quantity: parseInt(quantityInput.value, 10) || 0,
    comboId: comboSelect.value,
    comboQuantity: parseInt(comboQuantityInput.value, 10) || 0
  });

  const hasChanges = () => {
    if (!editing || !originalData) return true; // Si no está editando, siempre permitir

    const current = getCurrentData();
    return JSON.stringify(originalData) !== JSON.stringify(current);
  };

  const updateSubmitButton = () => {
    if (!editing) return; // Si no está editando, no hacer nada

    if (isDelivered) {
      // Si está entregado, el botón permanece deshabilitado
      submitBtn.disabled = true;
      submitBtn.className = "flex items-center gap-2 p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-base opacity-50";
      submitBtn.title = "No se puede modificar un pedido entregado";
      return;
    }

    const changed = hasChanges();
    submitBtn.disabled = !changed;

    if (changed) {
      submitBtn.className = "flex items-center gap-2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold text-base transition-all duration-200";
      submitBtn.title = "Guardar cambios";
    } else {
      submitBtn.className = "flex items-center gap-2 p-2 bg-gray-400 text-white rounded-lg cursor-not-allowed font-semibold text-base opacity-50 transition-all duration-200";
      submitBtn.title = "No hay cambios para guardar";
    }
  };

  // 📝 Event listeners para detectar cambios
  const onFieldChange = () => {
    updatePricing();
    updateSubmitButton();
  };

  const updatePricing = () => {
    const selectedFoodOption = foodSelect.selectedOptions[0];
    const food = selectedFoodOption ? FoodRepo.findById(selectedFoodOption.value) : null;

    if (!food) {
      totalPriceDiv.textContent = formatCurrency(0);
      unitPriceDiv.textContent = '';
      comboSelect.innerHTML = '<option value="">Elegir combo</option>';
      comboQuantityInput.disabled = true;
      return;
    }

    unitPriceDiv.textContent = `${formatCurrency(food.price)}`;

    const comboId = comboSelect.value;
    const singleQuantity = parseInt(quantityInput.value, 10) || 0;
    const comboQuantity = parseInt(comboQuantityInput.value, 10) || 0;

    let total = singleQuantity * food.price;

    if (comboId) {
      const combo = food.combos.find(c => c.id === comboId);
      if (combo) {
        total += comboQuantity * combo.price;
      }
      comboQuantityInput.disabled = isDelivered; // Solo deshabilitar si está entregado
    } else {
      comboQuantityInput.disabled = true;
    }

    totalPriceDiv.textContent = formatCurrency(total);
  };

  const populateCombos = (foodId: string) => {
    const food = FoodRepo.findById(foodId);
    comboSelect.innerHTML = '<option value="">Sin combo</option>';
    if (food && food.combos.length > 0) {
      food.combos.forEach(combo => {
        const option = document.createElement('option');
        option.value = combo.id;
        option.textContent = `${combo.quantity} Uds. x ${formatCurrency(combo.price)}`;
        if (editing && editing.comboId === combo.id) {
          option.selected = true;
        }
        comboSelect.appendChild(option);
      });
    }
    if (comboSelect.value) {
      comboQuantityInput.value = editing?.comboQuantity.toString() || '1';
    }
    updatePricing();
    updateSubmitButton(); // Actualizar estado del botón después de poblar combos
  };

  comboSelect.addEventListener('change', () => {
    if (comboSelect.value && !isDelivered) {
      comboQuantityInput.value = '1';
    } else {
      comboQuantityInput.value = '0';
    }
    onFieldChange();
  });

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
      const maxConflicting = Math.max(...conflicting);
      candidate = Math.max(candidate, maxConflicting + gapMs);
      iter++;
      if (iter > 50) break;
    }
    return candidate;
  };

  const onSubmit = async (ev: Event) => {
    ev.preventDefault();

    // 🔒 Verificar que el pedido no esté entregado
    if (editing && editing.delivered) {
      UI.toast('❌ No se puede modificar un pedido que ya fue entregado');
      return;
    }

    // 🔍 Verificar que haya cambios (solo para edición)
    if (editing && !hasChanges()) {
      UI.toast('ℹ️ No hay cambios para guardar');
      return;
    }

    submitBtn.disabled = true;
    UI.showSpinner('Espere un momento...');

    try {
      const data = new FormData(orderForm);
      const fullName = normalizeName(String(data.get('fullName') || ''));
      const phone = normalizePhone(String(data.get('phone') || ''));
      const deliveryAddress = normalizeName(String(data.get('deliveryAddress') || ''));
      const foodId = String(data.get('foodId') || '');
      const quantity = parseInt(String(data.get('quantity') || '0'), 10);
      const comboId = String(data.get('comboId') || '') || null;
      const comboQuantity = parseInt(String(data.get('comboQuantity') || '0'), 10);
      const timeValue = String(data.get('deliveryTime') || '');

      if (!timeValue) { UI.toast('Selecciona una hora de entrega.'); return; }

      let deliveryTimeIso = '';
      try {
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

      let totalItemsNeeded = quantity;
      if (comboId) {
        const combo = food.combos.find(c => c.id === comboId);
        if (combo) {
          totalItemsNeeded += combo.quantity * comboQuantity;
        }
      }

      if (food.stock < totalItemsNeeded) {
        UI.toast(`Stock insuficiente para "${food.name}". Stock actual: ${food.stock}. Necesario: ${totalItemsNeeded}`);
        return;
      }

      if (quantity === 0 && !comboId) {
        UI.toast('Agrega al menos un item o un combo al pedido.');
        return;
      }

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

      const conflict = OrderRepo.checkConflict(deliveryTimeIso, gap, editing?.id);
      if (conflict.conflict) {
        const requestedMs = new Date(deliveryTimeIso).getTime();
        const adjustedMs = adjustTimeToGap(requestedMs, gap);

        const adjustedDate = new Date(adjustedMs);
        const hh = String(adjustedDate.getHours()).padStart(2, '0');
        const mm = String(adjustedDate.getMinutes()).padStart(2, '0');
        timeInput.value = `${hh}:${mm}`;

        UI.toast(`Conflicto de entrega. Hora ajustada para cumplir ${gap} min de intervalo.`, 7000);
        updateSubmitButton(); // Actualizar botón después del cambio de hora
        return;
      }

      const payload = { fullName, phone, deliveryAddress, foodId, quantity, comboId, comboQuantity, deliveryTime: deliveryTimeIso };

      let success = false;
      if (editing) {
        success = await OrderRepo.update({ ...editing, ...payload });
        if (success) {
          UI.toast('Pedido actualizado.');
          cleanup();
          cleanupAndClose();
          document.dispatchEvent(new CustomEvent('refreshViews'));
        }
        return;
      } else {
        const newOrder = await OrderRepo.add(payload);
        if (newOrder) {
          success = true;
          UI.toast('Pedido agregado.');
        }
      }

      if (success) {
        document.dispatchEvent(new CustomEvent('refreshViews'));

        orderForm.reset();
        quantityInput.value = '0';
        comboQuantityInput.value = '0';
        foodSelect.value = '';
        comboSelect.innerHTML = '<option value="">Sin combo</option>';
        phoneInput.value = '';
        fullNameInput.value = '';
        deliveryAddressInput.value = '';
        const now = new Date();
        const nh = String(now.getHours()).padStart(2, '0');
        const nm = String(now.getMinutes()).padStart(2, '0');
        timeInput.value = `${nh}:${nm}`;

        updatePricing();
        updatePhoneValidation();
        updateSubmitButton();

        fullNameInput.focus();
      }
    } finally {
      if (!editing || !isDelivered) {
        submitBtn.disabled = false;
      }
      UI.hideSpinner();
    }
  };

  const cleanup = () => {
    orderForm.removeEventListener('submit', onSubmit);
    cancelBtn.removeEventListener('click', onCancel);
    phoneInput.removeEventListener('input', onPhoneInput);
    phoneInput.removeEventListener('blur', onPhoneBlur);
    phoneInput.removeEventListener('focus', onPhoneFocus);
    foodSelect.removeEventListener('change', onFoodChange);
    comboSelect.removeEventListener('change', onComboChange);
    quantityInput.removeEventListener('input', onQuantityInput);
    comboQuantityInput.removeEventListener('input', onComboQuantityInput);
    fullNameInput.removeEventListener('input', onFormFieldChange);
    deliveryAddressInput.removeEventListener('input', onFormFieldChange);
    timeInput.removeEventListener('change', onFormFieldChange);
  };

  const onCancel = () => { cleanup(); cleanupAndClose(); };
  const onPhoneInput = (ev: Event) => {
    handlePhoneInput(ev);
    updatePhoneValidation();
    debouncedPrefixCheck();
    updateSubmitButton();
  };
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
  const onFoodChange = () => {
    populateCombos(foodSelect.value);
    onFieldChange();
  };
  const onComboChange = () => onFieldChange();
  const onQuantityInput = () => onFieldChange();
  const onComboQuantityInput = () => {
    if (parseInt(comboQuantityInput.value, 10) === 0) {
      UI.toast('La cantidad de combos debe ser mayor a 0.');
    }
    onFieldChange();
  };
  const onFormFieldChange = () => updateSubmitButton();

  // 🔗 Event Listeners
  orderForm.addEventListener('submit', onSubmit);
  cancelBtn.addEventListener('click', onCancel);
  phoneInput.addEventListener('input', onPhoneInput);
  phoneInput.addEventListener('blur', onPhoneBlur);
  phoneInput.addEventListener('focus', onPhoneFocus);
  foodSelect.addEventListener('change', onFoodChange);
  comboSelect.addEventListener('change', onComboChange);
  quantityInput.addEventListener('input', onQuantityInput);
  comboQuantityInput.addEventListener('input', onComboQuantityInput);

  // Event listeners adicionales para detectar cambios en texto
  fullNameInput.addEventListener('input', onFormFieldChange);
  deliveryAddressInput.addEventListener('input', onFormFieldChange);
  timeInput.addEventListener('change', onFormFieldChange);

  // 🚀 Inicialización
  if (editing) {
    populateCombos(editing.foodId);
    // Capturar datos originales después de poblar el formulario
    setTimeout(() => {
      captureOriginalData();
      updateSubmitButton();
    }, 100);
  }

  updatePricing();
  updatePhoneValidation();
  updateSubmitButton();
}

/* -------------------- Helpers / Formulario Comida -------------------- */

/**
 * Abre modal para crear/editar comida.
 */
function openFoodForm(foodId?: string): void {
  // Prevenir apertura de modal si ya hay uno abierto
  if (document.getElementById('foodForm')) {
    return;
  }

  const editing = foodId ? FoodRepo.findById(foodId) : null;
  const isLinkedToOrder = editing ? OrderRepo.isFoodInActiveOrder(editing.id) : false;

  // Almacenar combos originales para comparar cambios y determinar si se pueden borrar
  const originalCombos: Combo[] = editing ? JSON.parse(JSON.stringify(editing.combos)) : [];
  let tempCombos: Combo[] = editing ? JSON.parse(JSON.stringify(editing.combos)) : [];

  const activeRecord = editing ? FoodSaleRecordRepo.findLatestActiveByFoodId(editing.id) : null;
  const startTime = activeRecord?.startTime || '08:00';
  const endTime = activeRecord?.endTime || '23:00';

  // Clases y atributos para deshabilitar campos si la comida está en un pedido activo
  const disabledClass = isLinkedToOrder ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : '';
  const disabledAttr = isLinkedToOrder ? 'disabled' : '';

  // Condición para deshabilitar el toggle de combos
  const comboToggleDisabled = isLinkedToOrder && originalCombos.length > 0;

  const html = `
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">

    <!-- 1. CABECERA FIJA -->
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-utensils"></i>
        <span>${editing ? 'Editar Comida' : 'Agregar Comida'}</span>
        ${isLinkedToOrder ? '<span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">🔒 EN USO</span>' : ''}
      </h3>
       ${isLinkedToOrder ? '<div class="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">Solo se permite agregar nuevos combos.</div>' : ''}
    </div>

    <!-- 2. CONTENIDO DEL FORMULARIO (LA ÚNICA PARTE CON SCROLL) -->
    <div class="flex-1 overflow-y-auto p-2 -mt-4">
      <form id="foodForm" class="space-y-3">

        <!-- Nombre -->
        <div>
          <label for="name" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-tag w-4"></i>Nombre</label>
          <input id="name" name="name" value="${editing?.name ?? ''}" required ${disabledAttr}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"
            placeholder="Ej: Hamburguesa Clásica" />
        </div>

        <!-- Rejilla 1: Costo, Precio y Estado (3 Columnas) -->
        <div class="${editing ? 'grid grid-cols-3 gap-x-4' : 'grid grid-cols-2 gap-x-4'}">
          <div>
            <label for="cost" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-dollar-sign w-3"></i>Costo</label>
            <input id="cost" name="cost" type="number" step="0.01" min="0" value="${editing?.cost ?? 0}" ${disabledAttr}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"/>
          </div>
          <div>
            <label for="price" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-tag w-3"></i>Precio</label>
            <input id="price" name="price" type="number" step="0.01" min="0" value="${editing?.price ?? 0}" ${disabledAttr}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"/>
          </div>

          <!-- Checkbox 'Activo' (Solo en modo edición) -->
          ${editing ? `
            <div class="flex flex-col justify-center ${isLinkedToOrder ? 'opacity-60' : ''}" 
     title="${isLinkedToOrder ? 'No se puede desactivar: la comida está en un pedido activo.' : 'Activar/desactivar comida'}">
  
  <label for="isActive" class="flex flex-col gap-2 ${isLinkedToOrder ? 'cursor-not-allowed' : 'cursor-pointer'}">
    <!-- Texto -->
    <span class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
      <i class="fa fa-power-off w-3"></i> Activa
    </span>
    <!-- Toggle debajo -->
    <div class="relative">
      <input id="isActive" name="isActive" type="checkbox" 
             ${editing.isActive ? 'checked' : ''} ${disabledAttr} 
             class="sr-only peer" />
      <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 
                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                  after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                  after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                  after:transition-all dark:border-gray-600 peer-checked:bg-accent">
      </div>
    </div>
  </label>
</div>

          ` : ``}
        </div>

        <!-- Rejilla 2: Stock, Horario (3 Columnas) -->
        <div class="grid grid-cols-[70px_100px_105px] gap-x-3">
          <!-- Stock -->
          <div>
            <label for="stock" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-boxes-stacked w-4"></i>Stock
            </label>
            <input id="stock" name="stock" type="number" min="0" value="${editing?.stock ?? 0}" ${disabledAttr}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"/>
          </div>

          <!-- Hora Inicio -->
          <div>
            <label for="startTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-play w-3"></i>Hora I.
            </label>
            <input id="startTime" name="startTime" type="time" value="${startTime}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>

          <!-- Hora Fin -->
          <div>
            <label for="endTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-stop w-3"></i>Hora F.
            </label>
            <input id="endTime" name="endTime" type="time" value="${endTime}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>
        </div>

        <!-- SECCIÓN: COMBOS CON SCROLL INTERNO -->
        <div>
          <div class="flex items-center justify-between">
            <label class="text-lg font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2"><i class="fa fa-gift"></i><span id="combosText">Combos</span></label>
            <label class="relative inline-flex items-center cursor-pointer ${comboToggleDisabled ? 'opacity-50 cursor-not-allowed' : ''}" title="${comboToggleDisabled ? 'No se puede desactivar: hay combos en uso.' : ''}">
              <input id="comboToggle" type="checkbox" class="sr-only peer" ${tempCombos.length > 0 ? 'checked' : ''} ${comboToggleDisabled ? 'disabled' : ''}>
              <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
            </label>
          </div>
          <div id="comboFieldsContainer" class="mt-2 space-y-2 ${tempCombos.length === 0 ? 'hidden' : ''}">
            <div class="flex items-end gap-2">
              <div class="flex-1"><label class="block text-sm text-gray-500 dark:text-gray-400">Cantidad</label><input id="comboQuantity" type="number" min="2" placeholder="Ej: 2" class="p-1 w-full bg-transparent border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"></div>
              <div class="flex-1"><label class="block text-sm text-gray-500 dark:text-gray-400">Precio Total</label><input id="comboPrice" type="number" step="0.01" min="0" placeholder="Ej: 3.50" class="p-1 w-full bg-transparent border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"></div>
              <button type="button" id="addComboBtn" class="flex-shrink-0 w-10 h-9 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600"><i class="fa fa-plus"></i></button>
            </div>
            <!-- CONTENEDOR DE COMBOS CON SCROLL (MAX 3-4 items visibles) -->
            <div id="comboList" class="space-y-2 max-h-24 overflow-y-auto pr-2 "></div>
          </div>
        </div>
      </form>
    </div>

    <!-- 3. PIE DE PÁGINA FIJO (BOTONES SIEMPRE VISIBLES) -->
    <div class="flex-shrink-0 flex justify-center gap-10 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <button type="button" id="cancelFood" class="flex items-center gap-2 p-2 text-white bg-red-500 rounded-lg hover:bg-red-600 font-semibold text-base"><i class="fa fa-times fa-lg"></i> Cancelar</button>
      <button type="submit" form="foodForm" id="submitFood" class="flex items-center gap-2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 font-semibold text-base"><i class="fa ${editing ? 'fa-save' : 'fa-plus'} fa-lg"></i> ${editing ? 'Actualizar' : 'Agregar'}</button>
    </div>
  </div>`;

  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);

  const { close, element } = UI.modal(html, { closeOnBackdropClick: false });

  const cleanupAndClose = () => {
    close();
    window.removeEventListener('resize', setVH);
  };

  const foodForm = element.querySelector('#foodForm') as HTMLFormElement;
  const submitBtn = element.querySelector('#submitFood') as HTMLButtonElement;
  const comboToggle = element.querySelector('#comboToggle') as HTMLInputElement;
  const comboFieldsContainer = element.querySelector('#comboFieldsContainer') as HTMLDivElement;
  const addComboBtn = element.querySelector('#addComboBtn') as HTMLButtonElement;
  const comboListContainer = element.querySelector('#comboList') as HTMLDivElement;
  const comboQuantityInput = element.querySelector('#comboQuantity') as HTMLInputElement;
  const comboPriceInput = element.querySelector('#comboPrice') as HTMLInputElement;
  const combosText = element.querySelector('#combosText') as HTMLSpanElement;

  let originalFormStateJSON: string = '';

  const captureFormState = () => {
    const data = new FormData(foodForm);
    const state = {
      name: data.get('name'),
      cost: data.get('cost'),
      price: data.get('price'),
      stock: data.get('stock'),
      isActive: data.get('isActive') === 'on',
      startTime: data.get('startTime'),
      endTime: data.get('endTime'),
      combos: JSON.stringify(tempCombos)
    };
    originalFormStateJSON = JSON.stringify(state);
  };

  const hasFormChanged = () => {
    const data = new FormData(foodForm);
    const currentState = {
      name: data.get('name'),
      cost: data.get('cost'),
      price: data.get('price'),
      stock: data.get('stock'),
      isActive: data.get('isActive') === 'on',
      startTime: data.get('startTime'),
      endTime: data.get('endTime'),
      combos: JSON.stringify(tempCombos)
    };
    return originalFormStateJSON !== JSON.stringify(currentState);
  };

  const updateSubmitButtonState = () => {
    if (!editing) return;
    const changed = hasFormChanged();
    submitBtn.disabled = !changed;
    submitBtn.classList.toggle('opacity-50', !changed);
    submitBtn.classList.toggle('cursor-not-allowed', !changed);
  };

  const renderComboList = () => {
    comboListContainer.innerHTML = !tempCombos.length ? '<p class="text-xs text-center text-gray-500">Aún no hay combos.</p>' : '';
    tempCombos.forEach((combo) => {
      const isOriginal = originalCombos.some(c => c.id === combo.id);
      const canDelete = !isLinkedToOrder || !isOriginal;
      const deleteDisabledAttr = canDelete ? '' : 'disabled';
      const deleteDisabledClass = canDelete ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed';

      const comboCard = document.createElement('div');
      comboCard.className = 'flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-base';
      comboCard.innerHTML = `<div><span class="font-semibold">${combo.quantity}</span> unidades por <span class="font-semibold text-green-500">${formatCurrency(combo.price)}</span></div><button data-id="${combo.id}" ${deleteDisabledAttr} class="remove-combo-btn w-7 h-7 ${deleteDisabledClass} text-white rounded-full flex items-center justify-center flex-shrink-0"><i class="fa fa-times text-xs"></i></button>`;
      comboListContainer.appendChild(comboCard);
    });

    comboListContainer.querySelectorAll('.remove-combo-btn').forEach(button => {
      if (!(button as HTMLButtonElement).disabled) {
        button.addEventListener('click', (e) => {
          const comboId = (e.currentTarget as HTMLElement).dataset.id!;
          tempCombos = tempCombos.filter(c => c.id !== comboId);
          renderComboList();
          updateSubmitButtonState();
        });
      }
    });
    combosText.textContent = `Combos${tempCombos.length > 0 ? ` (${tempCombos.length})` : ''}`;
  };

  addComboBtn.addEventListener('click', () => {
    const quantity = parseInt(comboQuantityInput.value, 10);
    const price = parseFloat(comboPriceInput.value);
    if (isNaN(quantity) || quantity < 2) { UI.toast('El combo debe tener al menos 2 U.'); return; }
    if (isNaN(price) || price <= 0) { UI.toast('El precio del combo debe ser positivo.'); return; }
    if (tempCombos.some(c => c.quantity === quantity)) { UI.toast('Ya existe un combo con esa cantidad.'); return; }

    tempCombos.push({ id: `combo_${Date.now()}` as any, quantity, price });
    tempCombos.sort((a, b) => a.quantity - b.quantity);
    renderComboList();
    comboQuantityInput.value = '';
    comboPriceInput.value = '';
    comboQuantityInput.focus();
    updateSubmitButtonState();
  });

  const onSubmit = async (ev: Event) => {
    ev.preventDefault();
    submitBtn.disabled = true;
    UI.showSpinner('Guardando...');

    try {
      const data = new FormData(foodForm);
      
      // Si la comida está en uso, toma los valores del objeto original, si no, del formulario.
      const name = isLinkedToOrder ? editing!.name : normalizeName(String(data.get('name') || ''));
      const cost = isLinkedToOrder ? editing!.cost : parseFloat(String(data.get('cost') || '0'));
      const price = isLinkedToOrder ? editing!.price : parseFloat(String(data.get('price') || '0'));
      const stock = isLinkedToOrder ? editing!.stock : parseInt(String(data.get('stock') || '0'), 10);
      const isActive = isLinkedToOrder ? editing!.isActive : data.get('isActive') === 'on';
      
      const startTime = String(data.get('startTime') || '');
      const endTime = String(data.get('endTime') || '');

      if (!name) { UI.toast('Nombre requerido'); return; }
      if (FoodRepo.nameExists(name, editing?.id)) { UI.toast('Comida existente', 5000); return; }

      const combosToSave = comboToggle.checked ? tempCombos : [];

      if (editing) {
        const updatedFood = { ...editing, name, cost, price, stock, isActive, combos: combosToSave };
        await FoodRepo.update(updatedFood, { startTime, endTime });
        UI.toast('Comida actualizada.');
      } else {
        await FoodRepo.add({ name, cost, price, stock, combos: combosToSave }, { startTime, endTime });
        UI.toast('Comida agregada.');
      }

      cleanupAndClose();
      // Defer UI update to prevent race conditions that cause a page reload effect.
      setTimeout(() => document.dispatchEvent(new CustomEvent('refreshViews')), 0);
    } finally {
      submitBtn.disabled = false;
      UI.hideSpinner();
    }
  };

  foodForm.addEventListener('submit', onSubmit);
  element.querySelector('#cancelFood')!.addEventListener('click', cleanupAndClose);
  comboToggle.addEventListener('change', () => {
    comboFieldsContainer.classList.toggle('hidden', !comboToggle.checked);
    if (!comboToggle.checked) {
      tempCombos = [];
    }
    renderComboList();
    updateSubmitButtonState();
  });

  // Inicialización
  renderComboList();
  if (editing) {
    // Capturar estado inicial para detectar cambios
    setTimeout(() => {
      captureFormState();
      updateSubmitButtonState();
    }, 50);
    // Añadir listeners para detectar cambios y actualizar el botón
    foodForm.querySelectorAll('input, select').forEach(el => {
      if (!(el as HTMLInputElement).disabled) {
          el.addEventListener('input', updateSubmitButtonState);
          el.addEventListener('change', updateSubmitButtonState);
      }
    });
  }
}


/** Muestra modal con historial de ventas y detalles. */
function openSalesHistoryModal(foodId: string): void {
  const food = FoodRepo.findById(foodId);
  if (!food) { UI.toast('Comida no encontrada'); return; }

  let modalRef: { close: () => void; element: HTMLElement } | null = null;

  const renderDetails = (record: FoodSaleRecord) => {
    const comboSalesHtml = Object.entries(record.comboSales || {}).map(([comboId, comboSale]) => {
      const combo = food.combos.find(c => c.id === comboId);
      if (!combo) return '';
      return `<p class="flex justify-between"><strong><i class="fa fa-gift w-5 text-gray-500 dark:text-gray-400"></i>Combo ${combo.quantity}x:</strong> <span>${comboSale.count} vendidos (${formatCurrency(comboSale.price * comboSale.count)})</span></p>`;
    }).join('');

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
          <p class="flex justify-between"><strong><i class="fa fa-chart-line w-5 text-gray-500 dark:text-gray-400"></i>Vendidos:</strong> <span>${record.quantitySoldSingle}</span></p>
          ${comboSalesHtml}
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
      const listItems = history.map(record => {
        const singleItemsSold = record.quantitySoldSingle || 0;
        const totalItemsFromCombos = Object.values(record.comboSales || {}).reduce((acc, comboSale) => acc + (comboSale.count * comboSale.quantity), 0);
        const totalSoldItems = singleItemsSold + totalItemsFromCombos;

        const totalSingleRevenue = singleItemsSold * record.unitPrice;
        const totalComboRevenue = Object.values(record.comboSales || {}).reduce((acc, comboSale) => acc + (comboSale.count * comboSale.price), 0);
        const totalRevenue = totalSingleRevenue + totalComboRevenue;

        return `
        <li class="border-b dark:border-dark-border last:border-b-0">
          <button data-record-id="${record.id}" class="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center record-item transition-colors">
            <div class="font-medium"><i class="fa fa-calendar-day mr-2 text-gray-400"></i> ${record.recordDate} <span class="text-xs text-gray-500 dark:text-gray-400">(${record.startTime} - ${record.endTime})</span></div>
            <div class="text-sm">Vendidos: <strong>${totalSoldItems}</strong> <span class="text-xs ${Math.abs(record.unitPrice - food.price) > 0.001 ? 'text-blue-500' : ''}">(${formatCurrency(totalRevenue)})</span></div>
          </button>
        </li>`}).join('');
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