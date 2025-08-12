// src/main.ts
import './styles.css';
import { UI } from './ui/ui';
import { renderDashboard, renderClients, renderFoods, renderSettings } from './ui/components';
import { FoodRepo } from './services/foodService';
import { OrderRepo } from './services/orderService';
import { formatCurrency, normalizeName, normalizePhone, getPhonePrefixError, debounce, isValidPhoneFormat, toCanonicalPhone  } from './utils';

// --- Estado Global de la Aplicación ---
let currentScreen: 'dashboard' | 'clients' | 'foods' | 'settings' = 'dashboard';
let countdownIntervalId: number | undefined;
let remainingSeconds = 60;

/**
 * Función global que decide qué mostrar en el header.
 * Es la única fuente de verdad para el contenido del header.
 */
export function updateGlobalHeaderState() {
  // 1. Detiene cualquier cronómetro que esté corriendo para re-evaluar el estado.
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = undefined;
  }

  const allActiveOrders = OrderRepo.getAll();
  const pendingCount = allActiveOrders.filter(o => !o.delivered).length;
  const deliveredCount = allActiveOrders.length - pendingCount;

  // 2. Decide qué mostrar
  if (pendingCount > 0) {
    // CASO A: Hay pedidos pendientes. Muestra el contador en TODAS las pantallas.
    const counterHtml = `<div class="pulse-animation bg-red-500 text-white text-base font-bold w-8 h-8 flex items-center justify-center rounded-full">${pendingCount}</div>`;
    UI.updateHeaderContent(counterHtml);
    remainingSeconds = 60; // Resetea el cronómetro para la próxima vez.
  } else if (deliveredCount > 0) {
    // CASO B: No hay pendientes, pero sí entregados. El cronómetro debe correr.
    startCountdown();
  } else {
    // CASO C: No hay pedidos activos. Limpia el header y resetea el cronómetro.
    UI.updateHeaderContent('');
    remainingSeconds = 60;
  }
}

/**
 * Inicia y gestiona el cronómetro.
 * El contador de segundos disminuye en segundo plano, sin importar la pantalla.
 * La VISUALIZACIÓN del cronómetro/botón solo ocurre si estamos en 'clients'.
 */
function startCountdown() {
  const showArchiveButton = () => {
    const buttonHtml = `<button id="archive-btn" title="Archivar pedidos entregados" class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600"><i class="fa fa-trash-can fa-lg"></i></button>`;
    if (currentScreen === 'clients') {
      UI.updateHeaderContent(buttonHtml);
      document.getElementById('archive-btn')?.addEventListener('click', () => {
        UI.confirm('¿Deseas archivar todos los pedidos ya entregados?', () => {
          OrderRepo.archiveDeliveredOrders();
          renderCurrent();
        });
      });
    } else {
      UI.updateHeaderContent(''); // En otras pantallas no se muestra nada.
    }
  };

  const updateTimerDisplay = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timerHtml = `<div class="bg-gray-400 text-white text-sm font-mono w-12 h-8 flex items-center justify-center rounded-lg">${minutes}:${seconds.toString().padStart(2, '0')}</div>`;
    if (currentScreen === 'clients') {
      UI.updateHeaderContent(timerHtml);
    } else {
      UI.updateHeaderContent(''); // En otras pantallas no se muestra nada.
    }
  };

  if (remainingSeconds <= 0) {
    showArchiveButton();
    return;
  }

  updateTimerDisplay(); // Muestra el estado actual del tiempo si estamos en 'clients'

  countdownIntervalId = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = undefined;
      showArchiveButton();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

// Inicial render shell
UI.renderShell();

function renderCurrent() {
  UI.updateTitle(currentScreen);
  UI.renderNavActive(currentScreen);
  updateGlobalHeaderState(); // Llama a la lógica del header cada vez que se cambia de pantalla

  const main = document.getElementById('mainArea')!;
  main.innerHTML = '';
  const container = document.createElement('div');
  main.appendChild(container);

  if (currentScreen === 'dashboard') renderDashboard(container);
  else if (currentScreen === 'clients') renderClients(container);
  else if (currentScreen === 'foods') renderFoods(container);
  else if (currentScreen === 'settings') renderSettings(container);
}

// Navegación
document.querySelectorAll('.nav-item').forEach((b: Element) => {
  b.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLElement;
    const screen = btn.dataset.screen as typeof currentScreen;
    if (screen && screen !== currentScreen) {
      currentScreen = screen;
      renderCurrent();
    }
  });
});

// Eventos para abrir formularios
document.addEventListener('openOrderForm', (e: Event) => {
  const id = (e as CustomEvent).detail?.id as string | undefined;
  openOrderForm(id);
});
document.addEventListener('openFoodForm', (e: Event) => {
  const id = (e as CustomEvent).detail?.id as string | undefined;
  openFoodForm(id);
});

// Render inicial de la aplicación
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
  const options = foods.map(f => `<option ${editing?.foodId === f.id ? 'selected' : ''} value="${f.id}" data-price="${f.price}">${f.name}</option>`).join('');

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
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-user"></i> Nombre completo:
            </label>
            <input name="fullName" value="${editing?.fullName ?? ''}" required 
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" 
              placeholder="Ingresa el nombre completo" />
          </div>
          
          <div class="pb-2">
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-phone"></i> Teléfono:
            </label>
            <input
              name="phone"
              id="phoneInput"
              value="${editing?.phone ?? ''}"
              required
              type="tel"
              inputmode="tel"
              placeholder="Formatos: 09xxxxxxxx, +593xxxxxxxxx o +593 9X XXX XXXX"
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1"
            />
          </div>
          
          <div class="pb-2">
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-map-marker-alt"></i> Dirección de entrega:
            </label>
            <input name="deliveryAddress" value="${editing?.deliveryAddress ?? ''}" required 
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" 
              placeholder="Dirección completa" />
          </div>

          <div class="pb-2">
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-clock"></i>Hora de entrega:
            </label>
            <input name="deliveryTime" type="datetime-local" value="${editing ? toLocalDateInput(editing.deliveryTime) : ''}" required 
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
          </div>
          
          <div class="pb-2">
            <label class="text-base text-gray-500 font-bold flex items-center gap-2">
              <i class="fa fa-utensils"></i> Comida:
            </label>
            <select name="foodId" id="foodSelect" 
              class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1">
              <option value="">Seleccionar comida...</option>
              ${options}
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4 pb-2">
            <div>
              <label class="text-base text-gray-500 font-bold flex items-center gap-2">
                <i class="fa fa-sort-numeric-up"></i> Cantidad:
              </label>
              <input name="quantity" id="quantityInput" type="number" min="1" value="${editing?.quantity ?? 1}" 
                class="w-full text-gray-800 bg-transparent border-0 border-b border-gray-300 focus:border-accent focus:outline-none p-1 mt-1" />
            </div>
            <div class="flex items-end">
              <label class="flex items-center gap-2 cursor-pointer">
                <div class="relative">
                  <input name="combo" id="comboCheckbox" type="checkbox" ${editing?.combo ? 'checked' : ''} 
                    class="sr-only" />
                  <div class="combo-checkbox w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center transition-colors">
                    <i class="fa fa-check text-white text-sm hidden"></i>
                  </div>
                </div>
                <span class="text-base text-gray-500 font-bold flex items-center gap-2">
                  <i class="fa fa-gift"></i> Combo
                </span>
              </label>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 pb-2">
            <div>
              <label class="text-base text-gray-500 font-bold flex items-center gap-2">
                <i class="fa fa-tag"></i> P. unitario:
              </label>
              <div id="unitPrice" class="text-gray-800 mt-1">$0.00</div>
            </div>
            <div>
              <label class="text-base text-gray-500 font-bold flex items-center gap-2">
                <i class="fa fa-calculator"></i> Total:
              </label>
              <div id="totalPrice" class="font-bold text-lg text-green-600 mt-1">$0.00</div>
            </div>
          </div>
          
          <div class="flex justify-center gap-4 mt-6">
            <button type="button" id="cancelOrder" class="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg">
              <i class="fa fa-times fa-lg"></i> Cancelar
            </button>
            <button type="submit" class="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold text-lg">
              <i class="fa ${editing ? 'fa-edit' : 'fa-plus'} fa-lg"></i> ${editing ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
    </div>
  `;

  const { close } = UI.modal(html, { closeOnBackdropClick: false });

  // Referencias a elementos
  const phoneInput = document.getElementById('phoneInput') as HTMLInputElement;
  const foodSelect = document.getElementById('foodSelect') as HTMLSelectElement;
  const quantityInput = document.getElementById('quantityInput') as HTMLInputElement;
  const comboCheckbox = document.getElementById('comboCheckbox') as HTMLInputElement;
  const unitPriceDiv = document.getElementById('unitPrice')!;
  const totalPriceDiv = document.getElementById('totalPrice')!;

  // Estilo del checkbox personalizado
  const updateCheckboxStyle = () => {
    const checkboxContainer = document.querySelector('.combo-checkbox')!;
    const checkIcon = checkboxContainer.querySelector('.fa-check')!;

    if (comboCheckbox.checked) {
      checkboxContainer.classList.add('bg-accent', 'border-accent');
      checkboxContainer.classList.remove('border-gray-400');
      checkIcon.classList.remove('hidden');
    } else {
      checkboxContainer.classList.remove('bg-accent', 'border-accent');
      checkboxContainer.classList.add('border-gray-400');
      checkIcon.classList.add('hidden');
    }
  };

  // Función para calcular y mostrar precios
  const updatePricing = () => {
    const selectedOption = foodSelect.selectedOptions[0];
    const unitPrice = selectedOption ? parseFloat(selectedOption.dataset.price || '0') : 0;
    const quantity = parseInt(quantityInput.value) || 1;
    const total = unitPrice * quantity;

    unitPriceDiv.textContent = formatCurrency(unitPrice);
    totalPriceDiv.textContent = formatCurrency(total);
  };

  // -- LÓGICA DE VALIDACIÓN DE TELÉFONO MEJORADA --

  // 1. Formateo en tiempo real para el campo de teléfono con límites dinámicos
  const handlePhoneInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement;
    const caretPosition = input.selectionStart;
    const originalValue = input.value;

    // Normalizar el valor con límites dinámicos
    const normalizedValue = normalizePhone(originalValue);

    // Solo actualizar si hay cambios para evitar interferencia con el cursor
    if (normalizedValue !== originalValue) {
      input.value = normalizedValue;

      // Restaurar posición del cursor de forma inteligente
      if (caretPosition !== null) {
        // Si se eliminaron caracteres, mantener posición
        // Si se agregaron (espacios), mover cursor adelante
        const lengthDiff = normalizedValue.length - originalValue.length;
        const newPosition = Math.min(caretPosition + lengthDiff, normalizedValue.length);
        input.setSelectionRange(newPosition, newPosition);
      }
    }
  };

  // 2. Validación visual en tiempo real
  const updatePhoneValidation = () => {
    const value = phoneInput.value;
    const isComplete = isValidPhoneFormat(value);

    // Cambiar estilo del borde según validación
    if (value.length === 0) {
      // Campo vacío - estilo normal
      phoneInput.classList.remove('border-green-500', 'border-red-500');
      phoneInput.classList.add('border-gray-300');
    } else if (isComplete) {
      // Formato válido y completo - verde
      phoneInput.classList.remove('border-gray-300', 'border-red-500');
      // phoneInput.classList.add('border-green-500');
    } else {
      // Incompleto o inválido - mantener gris mientras escribe
      phoneInput.classList.remove('border-green-500', 'border-red-500');
      phoneInput.classList.add('border-gray-300');
    }
  };

  // 3. Validación de prefijo con retardo
  const debouncedPrefixCheck = debounce(() => {
    const errorMessage = getPhonePrefixError(phoneInput.value);
    if (errorMessage) {
      UI.toast(errorMessage);
    }
  }, 3000); // Reducido a 3 segundos para mejor UX

  // Asignar listeners al campo de teléfono
  phoneInput.addEventListener('input', (ev) => {
    handlePhoneInput(ev);
    updatePhoneValidation();
    debouncedPrefixCheck();
  });

  phoneInput.addEventListener('blur', () => {
    // Validación final al salir del campo
    const value = phoneInput.value;
    if (value.length > 0 && !isValidPhoneFormat(value)) {
      phoneInput.classList.add('border-red-500');
      phoneInput.classList.remove('border-gray-300', 'border-green-500');
    }
  });

  phoneInput.addEventListener('focus', () => {
    // Limpiar estilo de error al enfocar
    if (phoneInput.classList.contains('border-red-500')) {
      phoneInput.classList.remove('border-red-500');
      phoneInput.classList.add('border-gray-300');
    }
  });

  // --- FIN DE LA LÓGICA DE VALIDACIÓN ---

  // Event listeners para actualizar precios
  foodSelect.addEventListener('change', updatePricing);
  quantityInput.addEventListener('input', updatePricing);
  comboCheckbox.addEventListener('change', updateCheckboxStyle);

  // Inicializar estilos y precios
  updateCheckboxStyle();
  updatePricing();
  updatePhoneValidation(); // Inicializar validación visual

  // Event listeners
  document.getElementById('cancelOrder')!.addEventListener('click', close);

   (document.getElementById('orderForm') as HTMLFormElement).addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget as HTMLFormElement);
    const fullName = normalizeName(String(data.get('fullName') || ''));
    const phone = normalizePhone(String(data.get('phone') || '')); // Se mantiene para la visualización y validación de formato
    const deliveryAddress = normalizeName(String(data.get('deliveryAddress') || ''));
    const foodId = String(data.get('foodId') || '');
    const quantity = Math.max(1, Number(data.get('quantity')) || 1);
    const combo = !!data.get('combo');
    const deliveryTime = new Date(String(data.get('deliveryTime'))).toISOString();

    // -- VALIDACIÓN FINAL AL ENVIAR --
    if (!fullName || !phone || !deliveryAddress) {
      UI.toast('Completa todos los campos requeridos.');
      return;
    }

    if (!isValidPhoneFormat(phone)) {
      UI.toast('El formato del teléfono es inválido. Use: 09xxxxxxxx, +593xxxxxxxxx o +593 9X XXX XXXX');
      phoneInput.focus();
      phoneInput.classList.add('border-red-500');
      phoneInput.classList.remove('border-gray-300', 'border-green-500');
      return;
    }

    if (!foodId) {
      UI.toast('Selecciona una comida.');
      return;
    }

    // --- VALIDACIÓN DE UNICIDAD DE TELÉFONO AJUSTADA ---
    const canonicalPhone = toCanonicalPhone(phone);
    if (canonicalPhone) {
      const existingOrder = OrderRepo.getAll().find(order => {
        // Excluir la orden actual si se está editando
        if (editing && order.id === editing.id) {
          return false;
        }
        // Comparar la versión canónica del teléfono de la orden existente con la actual
        return toCanonicalPhone(order.phone) === canonicalPhone;
      });

      if (existingOrder) {
        UI.toast(`El teléfono ya está registrado para el cliente '${existingOrder.fullName}'.`);
        phoneInput.focus();
        phoneInput.classList.add('border-red-500');
        return; // Detener el proceso
      }
    }
    // --- FIN DE LA VALIDACIÓN DE UNICIDAD ---

    // Verificación de conflictos de horario (esto se mantiene igual)
    const meta = JSON.parse(localStorage.getItem('fd_meta_v1') || '{}');
    const gap = meta.deliveryGapMinutes ?? 15;
    const conflict = OrderRepo.checkConflict(deliveryTime, phone, gap, editing?.id);
    if (conflict.conflict) {
      UI.toast(`Hay conflicto de horario (gap ${gap} min). Elige otra hora.`);
      return;
    }

    // Guardar pedido (esto se mantiene igual)
    if (editing) {
      const updated = { ...editing, fullName, phone, deliveryAddress, foodId, quantity, combo, deliveryTime };
      OrderRepo.update(updated);
      UI.toast('Pedido actualizado exitosamente.');
    } else {
      OrderRepo.add({ fullName, phone, deliveryAddress, foodId, quantity, combo, deliveryTime });
      UI.toast('Pedido agregado exitosamente.');
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
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
}
