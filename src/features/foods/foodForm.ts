import { UI } from '../../ui/ui';
import { FoodRepo, FoodSaleRecordRepo } from '../../services/foodService';
import { OrderRepo } from '../../services/orderService';
import { Combo } from '../../models';
import { formatCurrency, normalizeName } from '../../utils';

export function openFoodForm(foodId?: string): void {
  if (document.getElementById('foodForm')) return;

  const editing = foodId ? FoodRepo.findById(foodId) : null;
  const isLinkedToOrder = editing ? OrderRepo.isFoodInActiveOrder(editing.id) : false;
  const originalCombos: Combo[] = editing ? JSON.parse(JSON.stringify(editing.combos)) : [];
  let tempCombos: Combo[] = editing ? JSON.parse(JSON.stringify(editing.combos)) : [];

  const activeRecord = editing ? FoodSaleRecordRepo.findLatestActiveByFoodId(editing.id) : null;
  const startTime = activeRecord?.startTime || '08:00';
  const endTime = activeRecord?.endTime || '23:00';

  const disabledClass = isLinkedToOrder ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : '';
  const disabledAttr = isLinkedToOrder ? 'disabled' : '';
  const comboToggleDisabled = isLinkedToOrder && originalCombos.length > 0;

  const html = `
  <div class="flex flex-col h-full max-h-[calc(90*var(--vh,1vh))] bg-white dark:bg-gray-900 rounded-lg overflow-hidden text-sm sm:text-base">
    <div class="flex-shrink-0 p-2">
      <h3 class="text-xl font-bold text-center flex items-center justify-center gap-2">
        <i class="fa-solid fa-utensils"></i>
        <span>${editing ? 'Editar Comida' : 'Agregar Comida'}</span>
        ${isLinkedToOrder ? '<span class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">🔒 EN USO</span>' : ''}
      </h3>
      ${isLinkedToOrder ? '<div class="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">Solo se permite agregar nuevos combos.</div>' : ''}
    </div>
    <div class="flex-1 overflow-y-auto p-2 -mt-4">
      <form id="foodForm" class="space-y-3">
        <div>
          <label for="name" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400"><i class="fa fa-tag w-4"></i>Nombre</label>
          <input id="name" name="name" value="${editing?.name ?? ''}" required ${disabledAttr}
            class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"
            placeholder="Ej: Hamburguesa Clásica" />
        </div>
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
          ${editing ? `
            <div class="flex flex-col justify-center ${isLinkedToOrder ? 'opacity-60' : ''}" 
                 title="${isLinkedToOrder ? 'No se puede desactivar: la comida está en un pedido activo.' : 'Activar/desactivar comida'}">
              <label for="isActive" class="flex flex-col gap-2 ${isLinkedToOrder ? 'cursor-not-allowed' : 'cursor-pointer'}">
                <span class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
                  <i class="fa fa-power-off w-3"></i> Activa
                </span>
                <div class="relative">
                  <input id="isActive" name="isActive" type="checkbox" ${editing.isActive ? 'checked' : ''} ${disabledAttr} class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 
                              peer-checked:after:translate-x-full peer-checked:after:border-white 
                              after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                              after:bg-white after:border after:rounded-full after:h-5 after:w-5 
                              after:transition-all dark:border-gray-600 peer-checked:bg-accent">
                  </div>
                </div>
              </label>
            </div>` : ''}
        </div>
        <div class="grid grid-cols-[70px_100px_105px] gap-x-3">
          <div>
            <label for="stock" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-boxes-stacked w-4"></i>Stock
            </label>
            <input id="stock" name="stock" type="number" min="0" value="${editing?.stock ?? 0}" ${disabledAttr}
                   class="text-base text-center w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none ${disabledClass}"/>
          </div>
          <div>
            <label for="startTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-play w-3"></i>Hora I.
            </label>
            <input id="startTime" name="startTime" type="time" value="${startTime}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>
          <div>
            <label for="endTime" class="flex items-center gap-2 text-lg font-bold text-gray-600 dark:text-gray-400">
              <i class="fa fa-stop w-3"></i>Hora F.
            </label>
            <input id="endTime" name="endTime" type="time" value="${endTime}" step="60"
                   class="text-base w-full bg-transparent p-1 border-b border-gray-300 dark:border-dark-border focus:border-accent focus:outline-none"/>
          </div>
        </div>
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
            <div id="comboList" class="space-y-2 max-h-24 overflow-y-auto pr-2 "></div>
          </div>
        </div>
      </form>
    </div>
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
  const cleanupAndClose = () => { close(); window.removeEventListener('resize', setVH); };

  const foodForm = element.querySelector('#foodForm') as HTMLFormElement;
  const submitBtn = element.querySelector('#submitFood') as HTMLButtonElement;
  const comboToggle = element.querySelector('#comboToggle') as HTMLInputElement;
  const comboFieldsContainer = element.querySelector('#comboFieldsContainer') as HTMLDivElement;
  const addComboBtn = element.querySelector('#addComboBtn') as HTMLButtonElement;
  const comboListContainer = element.querySelector('#comboList') as HTMLDivElement;
  const comboQuantityInput = element.querySelector('#comboQuantity') as HTMLInputElement;
  const comboPriceInput = element.querySelector('#comboPrice') as HTMLInputElement;
  const combosText = element.querySelector('#combosText') as HTMLSpanElement;

  let originalFormStateJSON = '';

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
        await FoodRepo.add({ name, cost, price, stock, combos: combosToSave } as any, { startTime, endTime });
        UI.toast('Comida agregada.');
      }
      cleanupAndClose();
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
    if (!comboToggle.checked) tempCombos = [];
    renderComboList();
    updateSubmitButtonState();
  });

  renderComboList();
  if (editing) {
    setTimeout(() => { captureFormState(); updateSubmitButtonState(); }, 50);
    foodForm.querySelectorAll('input, select').forEach(el => {
      if (!(el as HTMLInputElement).disabled) {
        el.addEventListener('input', updateSubmitButtonState);
        el.addEventListener('change', updateSubmitButtonState);
      }
    });
  }
}


