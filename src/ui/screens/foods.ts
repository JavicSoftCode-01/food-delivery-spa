import { FoodRepo } from '../../services/foodService';
import { OrderRepo } from '../../services/orderService';
import { formatCurrency, normalizeName } from '../../utils';

export function renderFoods(container: HTMLElement): void {
  setTimeout(() => window.scrollTo(0, 0), 0);
  container.innerHTML = `<div class="food-container bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-32 opacity-0 transform translate-y-4">
    <div class="flex gap-2 items-center">
      <input id="inputFilterFood" placeholder="Buscar por comida..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-1 focus:ring-blue-500" />
      <button id="btnAddFood" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95">
        <i class="fa-solid fa-plus fa-lg"></i>
      </button>
    </div>
    <div id="foodsList" class="space-y-3"></div>
  </div>`;

  const mainContainer = container.querySelector('.food-container') as HTMLElement;
  requestAnimationFrame(() => {
    mainContainer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    mainContainer.style.opacity = '1';
    mainContainer.style.transform = 'translateY(0)';
  });

  const filterInp = container.querySelector('#inputFilterFood') as HTMLInputElement;
  const foodsListContainer = container.querySelector('#foodsList')!;

  const renderFoodList = (list: any[], animate = false) => {
    foodsListContainer.innerHTML = '';
    if (list.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'text-gray-500 dark:text-gray-400 text-center py-8 opacity-0 transform translate-y-4';
      emptyState.innerHTML = `
        <i class="fa fa-bowl-food text-4xl mb-2 opacity-50"></i>
        <p>Sin resultados.</p>`;
      foodsListContainer.appendChild(emptyState);
      requestAnimationFrame(() => {
        emptyState.style.transition = 'all 0.4s ease-out';
        emptyState.style.opacity = '1';
        emptyState.style.transform = 'translateY(0)';
      });
      return;
    }
    list.forEach((f, index) => {
      const row = document.createElement('div');
      row.className = `food-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer ${!f.isActive ? 'opacity-60' : ''}`;
      if (animate) row.classList.add('opacity-0', 'transform', 'translate-y-4');
      row.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl text-gray-900 dark:text-white">${f.name}</div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${f.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}">
              <i class="fa ${f.isActive ? 'fa-check-circle' : 'fa-times-circle'} mr-1 text-base"></i>
              ${f.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <i class="fa-solid fa-shopping-cart text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${f.amountSold || 0}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900/30">
            <i class="fa-solid fa-boxes-stacked text-orange-500 text-2xl"></i>
            <span class="font-semibold"><strong>${f.stock - OrderRepo.getReservedStockForFood(f.id)}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30">
            <i class="fa-solid fa-dollar-sign text-green-500 text-2xl"></i>
            <span class="font-semibold"><strong>${formatCurrency(f.price)}</strong></span>
          </div>
        </div>
        <div class="flex gap-2">
          <button data-id="${f.id}" class="salesHistoryBtn flex-1 px-1 py-1 bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-history text-lg"></i>
            Historial
          </button>
          <button data-id="${f.id}" class="editFood flex-1 px-1 py-1 bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa-solid fa-store text-lg"></i>
            Venta
          </button>
        </div>`;
      foodsListContainer.appendChild(row);
      if (animate) {
        setTimeout(() => {
          row.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          row.style.opacity = f.isActive ? '1' : '0.6';
          row.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });

    setTimeout(() => {
      foodsListContainer.querySelectorAll<HTMLElement>('.editFood').forEach((b) => {
        b.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            document.dispatchEvent(new CustomEvent('openFoodForm', { detail: { id: button.dataset.id! } }));
          }, 100);
        });
      });
      foodsListContainer.querySelectorAll<HTMLElement>('.salesHistoryBtn').forEach((b) => {
        b.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          const foodId = button.dataset.id!;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            document.dispatchEvent(new CustomEvent('openSalesHistory', { detail: { foodId } }));
          }, 100);
        });
      });
    }, list.length * 100 + 100);
  };

  const refreshFoodListView = (animate = false) => {
    const allFoods = FoodRepo.getAll();
    allFoods.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return a.name.localeCompare(b.name);
    });
    const filterText = normalizeName(filterInp.value).toLowerCase();
    const filteredFoods = filterText ? allFoods.filter((food) => normalizeName(food.name).toLowerCase().includes(filterText)) : allFoods;
    renderFoodList(filteredFoods, animate);
  };

  filterInp.addEventListener('input', () => refreshFoodListView(false));
  container.querySelector('#btnAddFood')?.addEventListener('click', (e) => {
    const button = e.currentTarget as HTMLElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
      document.dispatchEvent(new CustomEvent('openFoodForm'));
    }, 100);
  });
  document.addEventListener('refreshViews', () => refreshFoodListView(false));
  refreshFoodListView(true);
}


