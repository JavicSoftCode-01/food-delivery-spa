import { UI } from '../../ui/ui';
import { FoodRepo } from '../../services/foodService';
import { OrderRepo } from '../../services/orderService';
import { formatCurrency, normalizeName, normalizePhone, debounce, isValidPhoneFormat, toCanonicalPhone } from '../../utils';

// Extraído desde main.ts: openOrderForm, con pequeñas mejoras de aislamiento.

export function openOrderForm(orderId?: string): void {
  if (document.getElementById('orderForm')) return;

  const editing = orderId ? OrderRepo.findById(orderId) : null;
  const foods = FoodRepo.getAll().filter(f => f.isActive || (editing && f.id === editing.foodId));
  const optionsHtml = foods.map(f => {
    const reservedStock = OrderRepo.getReservedStockForFood(f.id);
    const availableStock = f.stock - reservedStock;
    return `<option ${editing?.foodId === f.id ? 'selected' : ''} value="${f.id}" data-price="${f.price}">${f.name} (Disp: ${availableStock})</option>`;
  }).join('');

  const timeOnly = editing ? new Date(editing.deliveryTime).toTimeString().slice(0, 5) : '';
  const isDelivered = editing ? editing.delivered : false;
  const disabledAttr = isDelivered ? 'disabled' : '';
  const disabledClass = isDelivered ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : '';

  const html = `
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar"></i>
        <span>${editing ? 'Editar Pedido' : 'Agregar Pedido'}</span>
        ${isDelivered ? '<span class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">🔒 ENTREGADO</span>' : ''}
      </h3>
    </div>
    <div class="flex-1 overflow-y-auto p-2 -mt-1">
      <form id="orderForm" class="space-y-4">
        <div>
          <label for="fullName" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-user w-4"></i>Nombres</label>
          <input id="fullName" name="fullName" value="${editing?.fullName ?? ''}" required ${disabledAttr}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"
            placeholder="Ingresar nombres completos" />
        </div>
        <div>
          <label for="deliveryAddress" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-map-marker-alt w-4"></i>Dirección</label>
          <input id="deliveryAddress" name="deliveryAddress" value="${editing?.deliveryAddress ?? ''}" required ${disabledAttr}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"
            placeholder="Ingresar dirección" />
        </div>
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
    if (!editing || !originalData) return true;
    const current = getCurrentData();
    return JSON.stringify(originalData) !== JSON.stringify(current);
  };

  const updateSubmitButton = () => {
    if (!editing) return;
    if (isDelivered) {
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
      if (combo) total += comboQuantity * combo.price;
      comboQuantityInput.disabled = isDelivered;
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
        if (editing && editing.comboId === combo.id) option.selected = true;
        comboSelect.appendChild(option);
      });
    }
    if (comboSelect.value) {
      comboQuantityInput.value = editing?.comboQuantity.toString() || '1';
    }
    updatePricing();
    updateSubmitButton();
  };

  const debouncedPrefixCheck = debounce(() => {
    const errorMessage = ((): string | null => {
      const value = phoneInput.value.replace(/\s/g, '');
      if (value.startsWith('09') || value.startsWith('+5939')) return null;
      if (!value) return null;
      return "Formato válido: '09xxxxxxxx' o '+5939xxxxxxxx'";
    })();
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
    if (editing && editing.delivered) { UI.toast('❌ No se puede modificar un pedido que ya fue entregado'); return; }
    if (editing && !hasChanges()) { UI.toast('ℹ️ No hay cambios para guardar'); return; }
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
      } catch { UI.toast('Hora de entrega inválida.'); return; }

      if (!fullName || !phone || !deliveryAddress) { UI.toast('Completa todos los campos requeridos.'); return; }
      if (!isValidPhoneFormat(phone)) { UI.toast('El formato del teléfono es inválido.'); phoneInput.focus(); phoneInput.classList.add('border-red-500'); return; }
      if (!foodId) { UI.toast('Selecciona una comida.'); return; }

      const food = FoodRepo.findById(foodId);
      if (!food) { UI.toast('La comida seleccionada no fue encontrada.'); return; }

      let totalItemsNeeded = quantity;
      if (comboId) {
        const combo = food.combos.find(c => c.id === comboId);
        if (combo) totalItemsNeeded += combo.quantity * comboQuantity;
      }
      if (food.stock < totalItemsNeeded) { UI.toast(`Stock insuficiente para "${food.name}".`); return; }
      if (quantity === 0 && !comboId) { UI.toast('Agrega al menos un item o un combo al pedido.'); return; }

      const canonicalPhone = toCanonicalPhone(phone);
      if (canonicalPhone) {
        const existingOrder = OrderRepo.getAll().find(order => {
          if (editing && order.id === editing.id) return false;
          return toCanonicalPhone(order.phone) === canonicalPhone;
        });
        if (existingOrder) { UI.toast(`El teléfono ya está registrado para el cliente '${existingOrder.fullName}'.`); phoneInput.focus(); phoneInput.classList.add('border-red-500'); return; }
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
        updateSubmitButton();
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
        const newOrder = await OrderRepo.add(payload as any);
        if (newOrder) { success = true; UI.toast('Pedido agregado.'); }
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
        updateSubmitButton();
        fullNameInput.focus();
      }
    } finally {
      if (!editing || !isDelivered) submitBtn.disabled = false;
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
  const onFoodChange = () => { populateCombos(foodSelect.value); onFieldChange(); };
  const onComboChange = () => { comboQuantityInput.value = comboSelect.value ? '1' : '0'; onFieldChange(); };
  const onQuantityInput = () => onFieldChange();
  const onComboQuantityInput = () => { if (parseInt(comboQuantityInput.value, 10) === 0) UI.toast('La cantidad de combos debe ser mayor a 0.'); onFieldChange(); };
  const onFormFieldChange = () => updateSubmitButton();
  const onFieldChange = () => { updatePricing(); updateSubmitButton(); };

  orderForm.addEventListener('submit', onSubmit);
  cancelBtn.addEventListener('click', onCancel);
  phoneInput.addEventListener('input', onPhoneInput);
  phoneInput.addEventListener('blur', onPhoneBlur);
  phoneInput.addEventListener('focus', onPhoneFocus);
  foodSelect.addEventListener('change', onFoodChange);
  comboSelect.addEventListener('change', onComboChange);
  quantityInput.addEventListener('input', onQuantityInput);
  comboQuantityInput.addEventListener('input', onComboQuantityInput);
  fullNameInput.addEventListener('input', onFormFieldChange);
  deliveryAddressInput.addEventListener('input', onFormFieldChange);
  timeInput.addEventListener('change', onFormFieldChange);

  if (editing) {
    populateCombos(editing.foodId);
    setTimeout(() => { captureOriginalData(); updateSubmitButton(); }, 100);
  }
  updatePricing();
  updatePhoneValidation();
  updateSubmitButton();
}


