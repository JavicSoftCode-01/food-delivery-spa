// src/ui/ui.ts
type ModalHandle = { close: () => void; element: HTMLElement };
const root = document.getElementById('app')!;

function createEl(tag = 'div', opts: Record<string, any> = {}) {
  const el = document.createElement(tag);
  Object.entries(opts).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  return el;
}

export const UI = {
  renderShell() {
    root.innerHTML = `
      <header class="bg-white rounded-xl p-4 shadow-sm border border-border flex items-center justify-between gap-3 mb-4">
        <div class="flex-grow">
          <h1 id="main-title" class="font-bold">Gestión Delivery</h1>
          <p class="text-sm text-gray-500">JavicSoftCode · Back-End Developer</p>
        </div>
        <div id="header-extra" class="flex-shrink-0 flex items-center justify-center h-12 w-14 translate-x-2">
          <!-- El contador o botón de archivar se renderizará aquí -->
        </div>
      </header>
      <main id="mainArea"></main>
      <nav id="bottomNav" class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border safe-bottom p-2 md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:rounded-full md:px-2 md:py-1 md:w-auto flex items-center justify-between gap-2" role="navigation" aria-label="Navegación principal">
        <button data-screen="dashboard" class="nav-item flex-1 md:w-auto flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg" aria-label="Dashboard"><i class="fa fa-chart-simple text-2xl" aria-hidden="true"></i><span class="text-xs">Dashboard</span></button>
        <button data-screen="clients" class="nav-item flex-1 md:w-auto flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg" aria-label="Clientes"><i class="fa fa-users text-2xl" aria-hidden="true"></i><span class="text-xs">Clientes</span></button>
        <button data-screen="foods" class="nav-item flex-1 md:w-auto flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg" aria-label="Comidas"><i class="fa fa-bowl-food text-2xl" aria-hidden="true"></i><span class="text-xs">Comidas</span></button>
        <button data-screen="settings" class="nav-item flex-1 md:w-auto flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg" aria-label="Ajustes"><i class="fa fa-gear text-2xl" aria-hidden="true"></i><span class="text-xs">Ajustes</span></button>
      </nav>
      <div id="modalRoot"></div>
      <div id="toastRoot" class="fixed right-4 bottom-24"></div>
    `;

    document.querySelectorAll<HTMLElement>('#bottomNav .nav-item').forEach((b) => {
      b.setAttribute('tabindex', '0');
      b.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          (e.currentTarget as HTMLElement).click();
          e.preventDefault();
        }
      });
    });
  },

  toastTimer: 0 as number | undefined,
  toast(msg: string) {
    const troot = document.getElementById('toastRoot')!;
    troot.innerHTML = `<div class="toast bg-gray-900 text-white rounded-lg p-3 shadow">${msg}</div>`;
    if (UI.toastTimer) window.clearTimeout(UI.toastTimer);
    UI.toastTimer = window.setTimeout(() => {
      troot.innerHTML = '';
    }, 3500);
  },

  modal(html: string, options: { closeOnBackdropClick?: boolean } = {}): ModalHandle {
    const { closeOnBackdropClick = true } = options;
    const mRoot = document.getElementById('modalRoot')!;

    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal-instance';

    // Increment z-index for each new modal to allow stacking
    const zIndex = 20 + (mRoot.children.length * 10);

    modalWrapper.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-4" style="z-index: ${zIndex};">
        <div class="modal-content bg-white rounded-xl w-full max-w-xl p-4 shadow-lg relative -mt-12">
          ${html}
        </div>
      </div>
    `;

    mRoot.appendChild(modalWrapper);

    const close = () => {
      if (modalWrapper.parentNode) {
        modalWrapper.parentNode.removeChild(modalWrapper);
      }
    };

    if (closeOnBackdropClick) {
      const backdrop = modalWrapper.querySelector('.modal-backdrop');
      backdrop?.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          close();
        }
      });
    }

    return { close, element: modalWrapper };
  },

  confirm(message: string, onYes: () => void) {
    // For confirmation, we don't want it to close on backdrop click.
    const { close, element } = UI.modal(
      `<div>
        <p class="text-gray-700">${message}</p>
        <div class="mt-4 flex justify-end gap-2">
          <button class="confirm-no-btn px-4 py-2 rounded-lg border">No</button>
          <button class="confirm-yes-btn px-4 py-2 rounded-lg bg-accent text-white">Sí</button>
        </div>
      </div>`,
      { closeOnBackdropClick: false }
    );

    // Scope the query to the modal's element to avoid conflicts
    const noBtn = element.querySelector('.confirm-no-btn');
    const yesBtn = element.querySelector('.confirm-yes-btn');

    noBtn?.addEventListener('click', close);
    yesBtn?.addEventListener('click', () => {
      close();
      onYes();
    });
  },

  updateTitle(screen: string) {
    const titleEl = document.getElementById('main-title')!;
    let title = 'Gestión Delivery';
    if (screen === 'clients') {
      title += ' -- Clientes';
    } else if (screen === 'foods') {
      title += ' -- Comidas';
    } else if (screen === 'settings') {
      title += ' -- Ajustes';
    }
    titleEl.textContent = title;
  },

  updateHeaderContent(html: string) {
    const headerExtraEl = document.getElementById('header-extra');
    if (headerExtraEl) {
      headerExtraEl.innerHTML = html;
    }
  },

  renderNavActive(screen = 'dashboard') {
    document.querySelectorAll<HTMLElement>('#bottomNav .nav-item').forEach((btn) => {
      const ds = btn.dataset.screen;
      const isActive = ds === screen;
      btn.classList.toggle('bg-accent', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('shadow-lg', isActive);
      if (isActive) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
  },
};