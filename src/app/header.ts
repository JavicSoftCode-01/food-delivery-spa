import { Router } from './router';
import { UI } from '../ui/ui';
import { OrderRepo } from '../services/orderService';

let countdownIntervalId: number | undefined;
let remainingSeconds = 60;

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

function startCountdown(): void {
  const showArchiveButton = () => {
    const buttonHtml = `<button id="archive-btn" title="Archivar pedidos entregados" class="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600"><i class="fa fa-trash-can fa-lg"></i></button>`;
    if (Router.getScreen() === 'clients') {
      UI.updateHeaderContent(buttonHtml);
      const btn = document.getElementById('archive-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          UI.confirm('¿Deseas archivar todos los pedidos ya entregados?', () => {
            OrderRepo.archiveDeliveredOrders();
            document.dispatchEvent(new CustomEvent('refreshViews'));
            updateGlobalHeaderState();
          });
        });
      }
    } else {
      UI.updateHeaderContent('');
    }
  };

  const updateTimerDisplay = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timerHtml = `<div class="bg-gray-400 text-white text-sm font-mono w-12 h-8 flex items-center justify-center rounded-lg">${minutes}:${seconds.toString().padStart(2, '0')}</div>`;
    if (Router.getScreen() === 'clients') UI.updateHeaderContent(timerHtml);
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


