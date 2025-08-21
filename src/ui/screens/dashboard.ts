import { UI } from '../ui';
import { FoodRepo } from '../../services/foodService';
import { OrderRepo } from '../../services/orderService';
import { formatCurrency } from '../../utils';

export function renderDashboard(container: HTMLElement): void {
  setTimeout(() => window.scrollTo(0, 0), 0);

  const _render = (animate: boolean) => {
    const foods = FoodRepo.getAll();
    const orders = OrderRepo.getSorted().filter((o) => o.state);
    const pending = orders.filter((o) => !o.delivered).length;
    const delivered = orders.filter((o) => o.delivered).length;
    const revenue = FoodRepo.totalProfit();

    container.innerHTML = `<section class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fa fa-clock text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Pendientes</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${pending}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <i class="fa fa-check text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Entregados</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${delivered}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <i class="fa fa-utensils text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Productos</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${foods.length}</div>
      </div>
      <div class="dashboard-card cursor-pointer p-3 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border dark:border-dark-border">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <i class="fa fa-dollar-sign text-white fa-lg"></i>
          </div>
          <div class="text-lg font-bold text-gray-600 dark:text-gray-400">Beneficios</div>
        </div>
        <div class="text-2xl text-center font-bold text-gray-900 dark:text-white">${formatCurrency(revenue)}</div>
      </div>
    </div>
    <div class="flex gap-2">
      <button id="btnAddOrderQuick" class="flex-1 px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-plus fa-lg"></i>
          <span class="text-base font-semibold">Nuevo pedido</span>
        </div>
      </button>
      <button id="btnAddFoodQuick" class="flex-1 px-2 py-2 border-2 border-accent hover:border-accent text-gray-700 dark:text-gray-300 hover:text-accent rounded-lg font-medium transition-all duration-200">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-utensils fa-lg"></i>
          <span class="text-base font-semibold">Nueva comida</span>
        </div>
      </button>
    </div>
  </section>`;

    if (animate) {
      const cards = container.querySelectorAll('.dashboard-card');
      cards.forEach((card, index) => {
        const element = card as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
          element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }

    container.querySelector('#btnAddOrderQuick')?.addEventListener('click', (e) => {
      const button = e.currentTarget as HTMLElement;
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
        document.dispatchEvent(new CustomEvent('openOrderForm'));
      }, 100);
    });

    container.querySelector('#btnAddFoodQuick')?.addEventListener('click', (e) => {
      const button = e.currentTarget as HTMLElement;
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
        document.dispatchEvent(new CustomEvent('openFoodForm'));
      }, 100);
    });
  };

  _render(true);
  document.addEventListener('refreshViews', () => {
    if (container.querySelector('.dashboard-card')) _render(false);
  });
  UI.updateHeaderContent;
}


