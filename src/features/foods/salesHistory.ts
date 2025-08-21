import { UI } from '../../ui/ui';
import { FoodRepo, FoodSaleRecordRepo } from '../../services/foodService';
import { FoodSaleRecord } from '../../models';
import { formatCurrency, formatClockTime, formatTime } from '../../utils';

export function openSalesHistoryModal(foodId: string) {
  const food = FoodRepo.findById(foodId);
  if (!food) { UI.toast('Comida no encontrada'); return; }

  const history = FoodSaleRecordRepo.findByFoodId(foodId);
  let historyModalRef: { close: () => void; element: HTMLElement } | null = null;

  const showSalesRecordDetails = (record: FoodSaleRecord, onBackToHistory: () => void) => {
    const singleItemsSold = record.quantitySoldSingle || 0;
    const comboSalesEntries = Object.entries(record.comboSales || {});
    const totalSingleRevenue = singleItemsSold * record.unitPrice;
    let totalItemsFromCombos = 0;
    let totalComboRevenue = 0;
    comboSalesEntries.forEach(([_, sale]) => {
      totalItemsFromCombos += sale.quantity * sale.count;
      totalComboRevenue += sale.price * sale.count;
    });
    const totalSoldItems = singleItemsSold + totalItemsFromCombos;
    const totalRevenue = totalSingleRevenue + totalComboRevenue;
    const totalProfit = totalRevenue - (totalSoldItems * record.unitCost);

    const salesBreakdownHtml = `
      <tr class="border-b dark:border-dark-border">
        <td class="py-2 pr-2">Venta Unitaria</td>
        <td class="py-2 text-center">${singleItemsSold}</td>
        <td class="py-2 text-center">${formatCurrency(record.unitPrice)}</td>
        <td class="py-2 text-right font-semibold">${formatCurrency(totalSingleRevenue)}</td>
      </tr>
      ${comboSalesEntries.map(([_, sale]) => `
        <tr class="border-b dark:border-dark-border">
          <td class="py-2 pr-2">Combo (${sale.quantity}u) x ${sale.count}</td>
          <td class="py-2 text-center">${sale.quantity * sale.count}</td>
          <td class="py-2 text-center">${formatCurrency(sale.price)}</td>
          <td class="py-2 text-right font-semibold">${formatCurrency(sale.price * sale.count)}</td>
        </tr>
      `).join('')}
    `;

    const html = `
      <div class="flex flex-col h-full max-h-[90vh] text-sm sm:text-base bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        <div class="flex-shrink-0 p-3 sm:p-4 border-b dark:border-dark-border flex items-center justify-between gap-4">
          <button id="backToHistoryList" class="text-accent hover:underline flex items-center gap-1.5 text-sm">
            <i class="fa fa-arrow-left"></i>
            <span class="hidden sm:inline">Volver</span>
          </button>
          <h3 class="text-base sm:text-xl font-bold text-center truncate">Detalles ${record.recordDate}</h3>
          <button id="closeRecordDetails" class="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-transform hover:scale-110 flex-shrink-0">
            <i class="fa fa-times text-base"></i>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
          <div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-b dark:border-dark-border pb-2">
              <div>
                <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-bowl-food w-4 text-center"></i>Comida:</label>
                <div class="text-gray-900 dark:text-dark-text font-medium pl-6">${food.name}</div>
              </div>
              <div>
                <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold"><i class="fa fa-clock w-4 text-center"></i>Horario:</label>
                <div class="text-gray-900 dark:text-dark-text font-medium pl-6">${formatClockTime(record.startTime)} - ${formatClockTime(record.endTime)}</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center mt-3">
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa-solid fa-boxes-stacked"></i> Stock
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${record.initialStock}</div>
              </div>
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa fa-shopping-cart"></i> Vendido
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${totalSoldItems}</div>
              </div>
              <div>
                <label class="flex flex-row items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
                  <i class="fa-solid fa-box"></i> Disponible
                </label>
                <div class="text-gray-900 dark:text-dark-text text-lg sm:text-xl font-bold">${record.initialStock - totalSoldItems}</div>
              </div>
            </div>
            <div class="border-t dark:border-dark-border pt-3">
              <label class="flex items-center gap-2 text-base sm:text-lg text-gray-600 dark:text-gray-300 font-semibold mb-2"><i class="fa fa-receipt"></i>Desglose de Ventas</label>
              <div class="overflow-x-auto">
                <table class="w-full text-xs sm:text-sm">
                  <thead>
                    <tr class="text-left text-gray-500 dark:text-gray-400">
                      <th class="py-1 font-semibold">Tipo</th>
                      <th class="py-1 font-semibold text-center">Unidades</th>
                      <th class="py-1 font-semibold text-center">Precio</th>
                      <th class="py-1 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>${salesBreakdownHtml}</tbody>
                </table>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
              <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Costo Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${formatCurrency(record.unitCost)}</div>
                </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Precio Unit.</label>
                  <div class="font-semibold text-sm sm:text-base">${formatCurrency(record.unitPrice)}</div>
                </div>
                <div>
                  <label class="text-xs sm:text-sm text-gray-500">Lucro Unit.</label>
                  <div class="font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400">${formatCurrency(record.unitPrice - record.unitCost)}</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 sm:gap-4 pt-3 border-t dark:border-dark-border text-center">
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-piggy-bank"></i>Lucro Total</label>
                  <div class="font-bold text-blue-700 dark:text-blue-400 text-xl sm:text-2xl">${formatCurrency(totalProfit)}</div>
                </div>
                <div>
                  <label class="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300"><i class="fa fa-coins"></i>Venta Total</label>
                  <div class="font-bold text-green-700 dark:text-green-400 text-xl sm:text-2xl">${formatCurrency(totalRevenue)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    const { close, element } = UI.modal(html, { closeOnBackdropClick: false });
    element.querySelector('#closeRecordDetails')!.addEventListener('click', close);
    element.querySelector('#backToHistoryList')!.addEventListener('click', () => { close(); onBackToHistory(); });
  };

  const showHistoryModal = () => {
    let listContent;
    if (history.length === 0) {
      listContent = `<div class="text-gray-500 dark:text-gray-400 text-center py-8 flex flex-col items-center gap-2"><i class="fa fa-inbox text-3xl opacity-50"></i><p>No hay historial de ventas para esta comida.</p></div>`;
    } else {
      const listItems = history.map(record => {
        const singleItemsSold = record.quantitySoldSingle || 0;
        const totalItemsFromCombos = Object.values(record.comboSales || {}).reduce((acc, comboSale) => acc + (comboSale.count * comboSale.quantity), 0);
        const totalSoldItems = singleItemsSold + totalItemsFromCombos;
        const totalSingleRevenue = singleItemsSold * record.unitPrice;
        const totalComboRevenue = Object.values(record.comboSales || {}).reduce((acc, comboSale) => acc + (comboSale.count * comboSale.price), 0);
        const totalRevenue = totalSingleRevenue + totalComboRevenue;
        return `
          <div class="border-b dark:border-dark-border last:border-b-0">
            <button data-record-id="${record.id}" class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 record-detail-btn transition-colors">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full ${record.isActive ? 'bg-green-500' : 'bg-gray-400'}"></div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-dark-text"><i class="fa fa-calendar-day mr-2 text-gray-400"></i>${record.recordDate}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${formatClockTime(record.startTime)} - ${formatClockTime(record.endTime)}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-dark-text">Vendí: <span class="text-gray-600 dark:text-gray-300">${totalSoldItems}</span></div>
                  <div class="text-base font-bold text-green-600">${formatCurrency(totalRevenue)}</div>
                </div>
              </div>
            </button>
          </div>`;
      }).join('');
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
          <div class="max-h-96 overflow-y-auto">${listContent}</div>
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
        showSalesRecordDetails(selectedRecord, showHistoryModal);
      });
    });
  };

  showHistoryModal();
}


