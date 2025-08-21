import { UI } from '../../ui/ui';
import { OrderRepo } from '../../services/orderService';
import { updateGlobalHeaderState } from '../../app/header';
import { formatTime } from '../../utils';
import { Order } from '../../models';

/** Cambia el estado de entrega con confirmación y spinner. */
export function handleDeliveryToggle(
  order: Order,
  toggle: HTMLInputElement,
  updateVisuals: (isDelivered: boolean) => void,
  onUpdate: () => void
) {
  const isChecked = toggle.checked;
  const actionText = isChecked ? 'ENTREGAR' : 'REVERTIR ENTREGA';
  // Revertir visualmente antes de confirmar
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
    </div>`;

  UI.confirm(confirmMessage, () => {
    UI.showSpinner(`${isChecked ? 'Entregando' : 'Revirtiendo'} pedido...`);
    setTimeout(async () => {
      try {
        const success = await OrderRepo.updateDeliveryStatus(order.id, isChecked);
        if (success) {
          toggle.checked = isChecked;
          updateVisuals(isChecked);
          updateGlobalHeaderState();
          onUpdate();
          UI.toast(isChecked ? `Pedido ENTREGADO a ${order.fullName}` : `Entrega REVERTIDA para ${order.fullName}`);
        } else {
          UI.toast('❌ Error: No se pudo actualizar el pedido');
        }
      } catch (e) {
        UI.toast('❌ Error crítico al actualizar el pedido');
      } finally {
        UI.hideSpinner();
      }
    }, 150);
  }, () => { /* cancel */ });
}


