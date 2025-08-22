import { OrderRepo } from '../../services/orderService';
import { normalizeName, getSearchablePhone, formatTime } from '../../utils';
import { handleDeliveryToggle } from '../../features/orders/deliveryToggle';

export function renderClients(container: HTMLElement): void {
  setTimeout(() => window.scrollTo(0, 0), 0);
  container.innerHTML = `
    <div class="clients-container bg-white dark:bg-dark-bg-secondary rounded-xl p-3 border dark:border-dark-border space-y-3 mb-32 opacity-0 transform translate-y-4">
      <div class="flex gap-2 items-center">
        <input id="inputFilterPhone" placeholder="Buscar por nombre o teléfono..." class="flex-1 px-3 py-2 border dark:border-dark-border rounded-lg bg-transparent transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" inputmode="text" />
        <button id="btnAddOrder" class="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95">
          <i class="fa-solid fa-plus fa-lg"></i>
        </button>
      </div>
      <div id="ordersList" class="space-y-3"></div>
    </div>`;

  const mainContainer = container.querySelector('.clients-container') as HTMLElement;
  requestAnimationFrame(() => {
    mainContainer.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    mainContainer.style.opacity = '1';
    mainContainer.style.transform = 'translateY(0)';
  });

  const filterInp = container.querySelector('#inputFilterPhone') as HTMLInputElement;
  const ordersListContainer = container.querySelector('#ordersList')!;

  const renderList = (list: any[], animate = false) => {
    ordersListContainer.innerHTML = '';
    if (!list.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'text-gray-500 dark:text-gray-400 text-center py-8 opacity-0 transform translate-y-4';
      emptyState.innerHTML = `
        <i class="fa-solid fa-bag-shopping text-4xl mb-2 opacity-50"></i>
        <p>Sin resultados.</p>`;
      ordersListContainer.appendChild(emptyState);
      requestAnimationFrame(() => {
        emptyState.style.transition = 'all 0.4s ease-out';
        emptyState.style.opacity = '1';
        emptyState.style.transform = 'translateY(0)';
      });
      return;
    }
    list.forEach((o, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = `order-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer ${o.delivered ? 'opacity-60' : ''}`;
      if (animate) wrapper.classList.add('opacity-0', 'transform', 'translate-y-4');
      wrapper.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="font-semibold text-xl flex items-center min-w-0">
            <i class="fa fa-user mr-2 shrink-0 text-blue-500"></i>
            <span class="truncate text-gray-900 dark:text-white" title="${o.fullName}">${o.fullName}</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${o.delivered ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}">
              <i class="fa ${o.delivered ? 'fa-check-circle' : 'fa-times-circle'} mr-1 text-base"></i>
              ${o.delivered ? 'Entregado' : 'Pendiente'}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-lg text-gray-600 dark:text-gray-300 mb-3">
          <div class="flex items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30">
            <i class="fa fa-clock text-blue-500 text-2xl"></i>
            <span class="font-semibold"><strong>${new Date(o.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</strong></span>
          </div>
          <div class="flex items-center gap-1 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
            <i class="fa fa-mobile text-indigo-500 text-2xl"></i>
            <span class="font-semibold"><strong>${o.phone}</strong></span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button data-phone="${o.phone}" class="callBtn flex-1 px-1 py-[17.5px] bg-green-500 text-white rounded flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-phone fa-lg"></i>
          </button>
          <button data-id="${o.id}" class="viewOrder flex-1 px-1 py-[17.5px] bg-blue-500 text-white rounded flex items-center justify-center gap-2 hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa fa-eye fa-lg"></i>
          </button>
          <button data-id="${o.id}" class="editOrder flex-1 px-1 py-[17.5px] bg-yellow-500 text-white rounded flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 font-semibold">
            <i class="fa-solid fa-pencil fa-lg"></i>
          </button>
          <label class="relative inline-flex items-center cursor-pointer ml-2">
            <input data-id="${o.id}" type="checkbox" ${o.delivered ? 'checked' : ''} class="sr-only deliveredToggle">
            <div class="toggle-bg w-11 h-6 ${o.delivered ? 'bg-green-600' : 'bg-red-500'} rounded-full transition-all duration-300">
              <div class="toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${o.delivered ? 'translate-x-5' : 'translate-x-0'}"></div>
            </div>
          </label>
        </div>`;
      ordersListContainer.appendChild(wrapper);
      if (animate) {
        setTimeout(() => {
          wrapper.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          wrapper.style.opacity = o.delivered ? '0.6' : '1';
          wrapper.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });

    setTimeout(() => {
      ordersListContainer.querySelectorAll<HTMLInputElement>('.deliveredToggle').forEach(inp => {
        inp.addEventListener('change', e => {
          const toggle = e.currentTarget as HTMLInputElement;
          const id = toggle.dataset.id!;
          const order = OrderRepo.findById(id);
          if (order) {
            const updateVisuals = (isDelivered: boolean) => {
              const bg = toggle.nextElementSibling!;
              const dot = bg.firstElementChild!;
              bg.className = `toggle-bg w-11 h-6 ${isDelivered ? 'bg-green-600' : 'bg-red-500'} rounded-full transition-all duration-300`;
              dot.className = `toggle-dot absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${isDelivered ? 'translate-x-5' : 'translate-x-0'}`;
              const statusPill = toggle.closest('.p-3')?.querySelector('span.inline-flex');
              if (statusPill) {
                statusPill.className = `inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-all duration-200 ${isDelivered ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`;
                statusPill.innerHTML = `${isDelivered ? '<i class="fa fa-check-circle mr-1 text-base"></i>Entregado' : '<i class="fa fa-times-circle mr-1 text-base"></i>Pendiente'}`;
              }
              const card = toggle.closest('.p-3');
              if (card) {
                (card as HTMLElement).className = `order-item p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border dark:border-dark-border hover:shadow-md transition-all duration-300 hover:scale-[1.02] ${isDelivered ? 'opacity-60' : ''}`;
              }
            };
            handleDeliveryToggle(order, toggle, updateVisuals, () => refreshListView(false));
          }
        });
      });
      ordersListContainer.querySelectorAll<HTMLElement>('.callBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            document.dispatchEvent(new CustomEvent('openCallModal', { detail: { phone: button.dataset.phone! } }));
          }, 100);
        });
      });
      ordersListContainer.querySelectorAll<HTMLElement>('.viewOrder').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            document.dispatchEvent(new CustomEvent('openOrderDetails', { detail: { id: button.dataset.id! } }));
          }, 100);
        });
      });
      ordersListContainer.querySelectorAll<HTMLElement>('.editOrder').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const button = e.currentTarget as HTMLElement;
          button.style.transform = 'scale(0.95)';
          setTimeout(() => {
            button.style.transform = '';
            document.dispatchEvent(new CustomEvent('openOrderForm', { detail: { id: button.dataset.id! } }));
          }, 100);
        });
      });
    }, list.length * 100 + 100);
  };

  const refreshListView = (animate = false) => {
    const list = OrderRepo.getSorted();
    const filterText = filterInp.value.toLowerCase().trim();
    if (!filterText) { renderList(list, animate); return; }
    const searchablePhoneTerm = getSearchablePhone(filterText);
    const filtered = list.filter(order => {
      const nameMatch = normalizeName(order.fullName).toLowerCase().includes(filterText);
      let phoneMatch = false;
      if (searchablePhoneTerm.length > 0) {
        const orderPhoneAsSearchable = getSearchablePhone(order.phone);
        phoneMatch = orderPhoneAsSearchable.includes(searchablePhoneTerm);
      }
      return nameMatch || phoneMatch;
    });
    renderList(filtered, animate);
  };

  filterInp.addEventListener('input', () => refreshListView(false));
  container.querySelector('#btnAddOrder')?.addEventListener('click', (e) => {
    const button = e.currentTarget as HTMLElement;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
      document.dispatchEvent(new CustomEvent('openOrderForm'));
    }, 100);
  });
  document.addEventListener('refreshViews', () => refreshListView(false));
  refreshListView(true);
}


