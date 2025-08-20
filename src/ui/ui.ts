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

/** Variable para almacenar el handle del modal del spinner */
let spinnerModalHandle: ModalHandle | null = null;

/** UI utilities for rendering and interactions. */
export const UI = {
  /**
    * Muestra un spinner moderno con mensaje opcional
    * @param message - Mensaje opcional a mostrar debajo del spinner
    */
  showSpinner(message?: string) {
    // Si ya hay un spinner activo, no crear otro
    if (spinnerModalHandle) return;

    const spinnerContent = `
      <div class="flex flex-col items-center justify-center py-8 px-6">
        <!-- Spinner moderno -->
        <div class="relative mb-6">
          <!-- Círculo de fondo -->
          <div class="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <!-- Círculo animado -->
          <div class="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#0F9FE0] rounded-full animate-spin"></div>
          <!-- Punto central -->
          <div class="absolute top-1/2 left-1/2 w-2 h-2 bg-[#0F9FE0] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        ${message ? `
        <!-- Mensaje opcional -->
        <div class="text-center">
          <p class="text-gray-700 dark:text-gray-300 text-lg font-medium animate-pulse-text">
            ${message}
          </p>
          <div class="flex justify-center mt-3 space-x-1">
            <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 300ms"></div>
          </div>
        </div>
        ` : ''}
      </div>
    `;

    // Añadir estilos de animación si no existen
    if (!document.getElementById('spinner-animations')) {
      const style = document.createElement('style');
      style.id = 'spinner-animations';
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes bounce-dot {
          0%, 80%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.7;
          }
          40% { 
            transform: translateY(-8px) scale(1.1); 
            opacity: 1;
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
        }
        
        .animate-bounce-dot {
          animation: bounce-dot 1.4s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    // Crear modal usando el sistema existente
    spinnerModalHandle = UI.modal(spinnerContent, {
      closeOnBackdropClick: false
    });

    // Añadir clases adicionales para el spinner
    const modalContent = spinnerModalHandle.element.querySelector('.modal-content');
    if (modalContent) {
      modalContent.classList.add('!max-w-sm', '!p-0');
      // Remover el margen negativo para centrar mejor
      modalContent.classList.remove('-mt-[70px]', 'sm:-mt-[60px]', 'md:-mt-[80px]', 'lg:-mt-[100px]');
    }
  },

  /**
   * Oculta el spinner activo
   */
  hideSpinner() {
    if (spinnerModalHandle) {
      spinnerModalHandle.close();
      spinnerModalHandle = null;
    }
  },

  /**
   * Actualiza el mensaje del spinner sin cerrarlo
   * @param message - Nuevo mensaje a mostrar
   */
  updateSpinnerMessage(message: string) {
    if (!spinnerModalHandle) return;

    const messageContainer = spinnerModalHandle.element.querySelector('.text-center');
    if (messageContainer) {
      messageContainer.innerHTML = `
        <p class="text-gray-700 dark:text-gray-300 text-lg font-medium animate-pulse-text">
          ${message}
        </p>
        <div class="flex justify-center mt-3 space-x-1">
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 0ms"></div>
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 150ms"></div>
          <div class="w-2 h-2 bg-[#0F9FE0] rounded-full animate-bounce-dot" style="animation-delay: 300ms"></div>
        </div>
      `;
    }
  },
  /** Timer for toast dismissal. */
  toastTimer: 0 as number | undefined,

  /** Renders the main application shell. */
  renderShell() {
    root.innerHTML = `
      <header class="bg-white dark:bg-dark-bg-secondary rounded-xl p-3 shadow-sm border dark:border-dark-border flex items-center justify-between gap-3 mb-4">
        <div class="flex-grow">
          <h1 id="main-title" class="text-lg font-bold text-gray-900 dark:text-white">Gestión Delivery</h1>
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
    <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-2 opacity-0 transition-opacity duration-300 ease-out" style="z-index: ${zIndex};">
      <div class="modal-content bg-white dark:bg-dark-bg-secondary rounded-xl w-full max-w-xl p-2 shadow-lg relative
          -mt-[70px] sm:-mt-[60px] md:-mt-[80px] lg:-mt-[100px] transform -translate-y-10 scale-95 opacity-0 transition-all duration-300 ease-out">
        ${html}
      </div>
    </div>
  `;

    mRoot.appendChild(modalWrapper);

    // Force reflow to ensure initial styles are applied
    modalWrapper.offsetHeight;

    // Trigger entrance animation
    const backdrop = modalWrapper.querySelector('.modal-backdrop');
    const content = modalWrapper.querySelector('.modal-content');

    requestAnimationFrame(() => {
      backdrop?.classList.remove('opacity-0');
      content?.classList.remove('-translate-y-10', 'scale-95', 'opacity-0');
      content?.classList.add('translate-y-0', 'scale-100', 'opacity-100');
    });

    const close = () => {
      // Exit animation
      backdrop?.classList.add('opacity-0');
      content?.classList.remove('translate-y-0', 'scale-100', 'opacity-100');
      content?.classList.add('-translate-y-10', 'scale-95', 'opacity-0');

      // Remove element after animation completes
      const onTransitionEnd = () => {
        if (modalWrapper.parentNode) {
          modalWrapper.parentNode.removeChild(modalWrapper);
        }
      };

      // Listen to transitionend on content (since it has more transitions)
      content?.addEventListener('transitionend', onTransitionEnd, { once: true });

      // Safety timeout in case transitionend doesn't fire
      setTimeout(onTransitionEnd, 350);
    };

    if (closeOnBackdropClick) {
      backdrop?.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          close();
        }
      });
    }

    return { close, element: modalWrapper };
  },

  /** Shows a confirmation modal with improved UI structure. */
 confirm(message: string, onConfirm: () => void, onCancel?: () => void): void {
    const html = `
      <div class="text-center p-2">
        <div class="mb-2">
          <div class="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
            <i class="fa fa-exclamation-triangle text-3xl text-yellow-600 dark:text-yellow-400"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirmación Requerida</h3>
          <div class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">${message}</div>
        </div>
        
        <!-- <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
            <i class="fa fa-info-circle"></i>
            <span class="font-medium">Esta acción modificará el estado del pedido</span>
          </div>
        </div> -->

        <div class="flex gap-8 justify-center">
          <button id="confirmCancel" class="px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-semibold min-w-[50px] hover:scale-105 active:scale-95">
            <i class="fa fa-times fa-lg"></i> Cancelar
          </button>
          <button id="confirmOk" class="px-2 py-3 text-white rounded-lg bg-accent hover:bg-accent/90 transition-all duration-200 font-bold min-w-[100px] hover:scale-105 active:scale-95 shadow-lg">
            <i class="fa fa-check fa-lg"></i> Confirmar
          </button>
        </div>
        
        <!-- <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Esta acción se registrará en el sistema
        </div> -->
      </div>
    `;

    // Bloquear scroll del fondo
    document.documentElement.style.overflow = 'hidden';

    const { close, element } = this.modal(html, { closeOnBackdropClick: false });

    const closeAndRestore = () => {
      close();
      document.documentElement.style.overflow = '';
    };

    element.querySelector('#confirmOk')!.addEventListener('click', () => {
      closeAndRestore();
      onConfirm();
    });

    element.querySelector('#confirmCancel')!.addEventListener('click', () => {
      closeAndRestore();
      if (onCancel) {
        onCancel();
      }
    });

    // Enfocar el botón de confirmar después de un momento
    setTimeout(() => {
      const confirmBtn = element.querySelector('#confirmOk') as HTMLButtonElement;
      confirmBtn?.focus();
    }, 200);
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