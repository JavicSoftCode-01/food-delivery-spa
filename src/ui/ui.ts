// src/ui/ui.ts
/** Type for modal handle with close function and element. */
type ModalHandle = { close: () => void; element: HTMLElement };
const root = document.getElementById('app')!;

/** Creates a DOM element with options. */
function createEl(tag = 'div', opts: Record<string, any> = {}): HTMLElement {
  const el = document.createElement(tag);
  Object.entries(opts).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  return el;
}

/** UI utilities for rendering and interactions. */
export const UI = {
  /** Timer for toast dismissal. */
  toastTimer: 0 as number | undefined,

  /** Renders the main application shell. */
  renderShell() {
    root.innerHTML = `
      <header class="bg-white dark:bg-dark-bg-secondary rounded-xl p-4 shadow-sm border dark:border-dark-border flex items-center justify-between gap-3 mb-4">
        <div class="flex-grow">
          <h1 id="main-title" class="font-bold">Gestión Delivery</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">JavicSoftCode · Developer</p>
        </div>
        <div id="header-extra" class="flex-shrink-0 flex items-center justify-center h-12 w-14 translate-x-2">
          <!-- El contador o botón de archivar se renderizará aquí -->
        </div>
      </header>
      <main id="mainArea"></main>
      <nav id="bottomNav" class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-sm border-t dark:border-dark-border z-50" role="navigation" aria-label="Navegación principal">
        <div class="max-w-3xl mx-auto px-2 py-1.5">
          <div class="flex items-center justify-center gap-1 sm:gap-2">
            <button data-screen="dashboard" class="nav-item flex-1 max-w-[80px] sm:max-w-none flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200" aria-label="Dashboard">
              <i class="fa fa-chart-simple text-2xl" aria-hidden="true"></i>
              <span class="text-xs font-semibold">Dashboard</span>
            </button>
            <button data-screen="clients" class="nav-item flex-1 max-w-[80px] sm:max-w-none flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200" aria-label="Clientes">
              <i class="fa fa-users text-2xl" aria-hidden="true"></i>
              <span class="text-xs font-semibold">Clientes</span>
            </button>
            <button data-screen="foods" class="nav-item flex-1 max-w-[80px] sm:max-w-none flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200" aria-label="Comidas">
              <i class="fa fa-bowl-food text-2xl" aria-hidden="true"></i>
              <span class="text-xs font-semibold">Comidas</span>
            </button>
            <button data-screen="settings" class="nav-item flex-1 max-w-[80px] sm:max-w-none flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-lg transition-all duration-200" aria-label="Ajustes">
              <i class="fa fa-gear text-2xl" aria-hidden="true"></i>
              <span class="text-xs font-semibold">Ajustes</span>
            </button>
          </div>
        </div>
      </nav>

      <div id="modalRoot"></div>
      <div id="toastRoot" class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4"></div>
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

  /** Displays a temporary toast message. */
    /** Displays a temporary toast message with optional custom duration. */
  toast(msg: string, duration = 3000) {
    const troot = document.getElementById('toastRoot')!;
    troot.innerHTML = `
      <div class="toast bg-sky-500 text-white rounded-xl p-4 shadow-xl border border-sky-400 
                  transform transition-all duration-500 ease-out scale-95 opacity-0
                  backdrop-blur-sm font-medium text-center text-sm text-lg
                  animate-pulse-gentle">
        <div class="flex items-center justify-center gap-2">
          <i class="fa fa-info-circle fa-lg"></i>
          <span>${msg}</span>
        </div>
      </div>
    `;

    // Añadir animaciones si no existen
    if (!document.getElementById('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes pulse-gentle {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.3), 0 4px 6px -2px rgba(14, 165, 233, 0.1);
          }
          50% { 
            transform: scale(1.02);
            box-shadow: 0 20px 35px -5px rgba(14, 165, 233, 0.4), 0 8px 12px -2px rgba(14, 165, 233, 0.15);
          }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        .toast-enter {
          transform: translateY(-100%) scale(0.9);
          opacity: 0;
        }
        .toast-show {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        .toast-exit {
          transform: translateY(-100%) scale(0.9);
          opacity: 0;
        }
      `;
      document.head.appendChild(style);
    }

    const toastEl = troot.querySelector('.toast') as HTMLElement;

    // Animación de entrada
    setTimeout(() => {
      if (toastEl) {
        toastEl.classList.remove('scale-95', 'opacity-0');
        toastEl.classList.add('toast-show');
      }
    }, 10);

    if (UI.toastTimer) window.clearTimeout(UI.toastTimer);
    UI.toastTimer = window.setTimeout(() => {
      if (toastEl) {
        toastEl.classList.add('toast-exit');
        setTimeout(() => {
          troot.innerHTML = '';
        }, 500);
      }
    }, duration); // 👈 aquí usamos el parámetro
  },


  /** Opens a modal with HTML content and options. */
  modal(html: string, options: { closeOnBackdropClick?: boolean } = {}): ModalHandle {
    const { closeOnBackdropClick = true } = options;
    const mRoot = document.getElementById('modalRoot')!;

    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal-instance';

    const zIndex = 20 + (mRoot.children.length * 10);

    modalWrapper.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-2" style="z-index: ${zIndex};">
        <div class="modal-content bg-white dark:bg-dark-bg-secondary rounded-xl w-full max-w-xl p-2 shadow-lg relative
            -mt-[70px] sm:-mt-[60px] md:-mt-[80px] lg:-mt-[100px]">
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

  /** Shows a confirmation modal with message and callback on yes. */
  confirm(message: string, onYes: () => void) {
    const { close, element } = UI.modal(
      `<div>
        <p class="text-gray-700 dark:text-dark-text">${message}</p>
        <div class="mt-4 flex justify-end gap-2">
          <button class="confirm-no-btn px-4 py-2 rounded-lg border dark:border-dark-border">No</button>
          <button class="confirm-yes-btn px-4 py-2 rounded-lg bg-accent text-white">Sí</button>
        </div>
      </div>`,
      { closeOnBackdropClick: false }
    );

    const noBtn = element.querySelector('.confirm-no-btn');
    const yesBtn = element.querySelector('.confirm-yes-btn');

    noBtn?.addEventListener('click', close);
    yesBtn?.addEventListener('click', () => {
      close();
      onYes();
    });
  },

  /** Updates the main title based on screen. */
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

  /** Updates extra content in header. */
  updateHeaderContent(html: string) {
    const headerExtraEl = document.getElementById('header-extra');
    if (headerExtraEl) {
      headerExtraEl.innerHTML = html;
    }
  },

  /** Highlights active navigation item. */
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