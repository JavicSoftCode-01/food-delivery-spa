// src/ui/layout/MainLayout.ts
// Layout principal de la aplicación food-delivery-spa

import { UI } from '../ui';
import { CONFIG } from '../../app/config';

export interface MainLayoutProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  children?: HTMLElement | HTMLElement[];
}

/**
 * Renderiza el layout principal de la aplicación
 */
export function renderMainLayout(
  container: HTMLElement,
  props: MainLayoutProps = {}
): HTMLElement {
  const { title, showBackButton = false, onBack, children } = props;

  // Limpiar contenedor
  container.innerHTML = '';

  // Crear estructura del layout
  const layout = document.createElement('div');
  layout.className = 'min-h-screen bg-gray-50 dark:bg-gray-900';

  // Header del layout
  const header = document.createElement('header');
  header.className = `
    bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 
    sticky top-0 z-40 shadow-sm
  `;

  const headerContent = document.createElement('div');
  headerContent.className = 'px-4 py-3 flex items-center justify-between';

  // Botón de retroceso (opcional)
  if (showBackButton) {
    const backButton = document.createElement('button');
    backButton.className = `
      p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white
      hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors
    `;
    backButton.innerHTML = '<i class="fa fa-arrow-left text-lg"></i>';
    backButton.addEventListener('click', () => {
      if (onBack) onBack();
      else window.history.back();
    });
    headerContent.appendChild(backButton);
  }

  // Título del layout
  if (title) {
    const titleElement = document.createElement('h1');
    titleElement.className = `
      text-xl font-semibold text-gray-900 dark:text-white
      ${showBackButton ? 'ml-3' : ''}
    `;
    titleElement.textContent = title;
    headerContent.appendChild(titleElement);
  }

  // Botón de tema (derecha)
  const themeButton = document.createElement('button');
  themeButton.className = `
    p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white
    hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors
  `;
  themeButton.innerHTML = '<i class="fa fa-moon text-lg"></i>';
  themeButton.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      themeButton.innerHTML = '<i class="fa fa-moon text-lg"></i>';
      localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify({ darkMode: false }));
    } else {
      document.documentElement.classList.add('dark');
      themeButton.innerHTML = '<i class="fa fa-sun text-lg"></i>';
      localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify({ darkMode: true }));
    }
  });

  // Verificar tema actual
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
    themeButton.innerHTML = '<i class="fa fa-sun text-lg"></i>';
  }

  headerContent.appendChild(themeButton);
  header.appendChild(headerContent);

  // Contenido principal
  const main = document.createElement('main');
  main.className = 'flex-1 p-4';

  // Agregar children si existen
  if (children) {
    if (Array.isArray(children)) {
      children.forEach(child => main.appendChild(child));
    } else {
      main.appendChild(children);
    }
  }

  // Footer del layout
  const footer = document.createElement('footer');
  footer.className = `
    bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 
    px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400
  `;
  footer.innerHTML = `
    <p>© ${new Date().getFullYear()} Food Delivery SPA. Todos los derechos reservados.</p>
  `;

  // Construir layout completo
  layout.appendChild(header);
  layout.appendChild(main);
  layout.appendChild(footer);

  // Agregar al contenedor
  container.appendChild(layout);

  return layout;
}

/**
 * Renderiza un layout de página con scroll infinito
 */
export function renderPageLayout(
  container: HTMLElement,
  props: MainLayoutProps & {
    onScrollEnd?: () => void;
    scrollThreshold?: number;
  } = {}
): HTMLElement {
  const { onScrollEnd, scrollThreshold = CONFIG.UI.SCROLL_THRESHOLD, ...layoutProps } = props;

  const layout = renderMainLayout(container, layoutProps);

  // Agregar scroll infinito si se especifica
  if (onScrollEnd) {
    const main = layout.querySelector('main');
    if (main) {
      main.addEventListener('scroll', (e) => {
        const target = e.target as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        
        if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
          onScrollEnd();
        }
      });
    }
  }

  return layout;
}

/**
 * Renderiza un layout de modal
 */
export function renderModalLayout(
  container: HTMLElement,
  props: {
    title: string;
    onClose?: () => void;
    children?: HTMLElement | HTMLElement[];
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }
): HTMLElement {
  const { title, onClose, children, size = 'md' } = props;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const modal = document.createElement('div');
  modal.className = `
    fixed inset-0 z-50 flex items-center justify-center p-4
    bg-black bg-opacity-50 backdrop-blur-sm
  `;

  const modalContent = document.createElement('div');
  modalContent.className = `
    bg-white dark:bg-gray-800 rounded-lg shadow-xl
    ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden
  `;

  // Header del modal
  const modalHeader = document.createElement('div');
  modalHeader.className = `
    flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700
  `;

  const modalTitle = document.createElement('h2');
  modalTitle.className = 'text-lg font-semibold text-gray-900 dark:text-white';
  modalTitle.textContent = title;

  const closeButton = document.createElement('button');
  closeButton.className = `
    p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
    hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors
  `;
  closeButton.innerHTML = '<i class="fa fa-times text-lg"></i>';
  closeButton.addEventListener('click', () => {
    if (onClose) onClose();
    else modal.remove();
  });

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  // Contenido del modal
  const modalBody = document.createElement('div');
  modalBody.className = 'p-4 overflow-y-auto';

  if (children) {
    if (Array.isArray(children)) {
      children.forEach(child => modalBody.appendChild(child));
    } else {
      modalBody.appendChild(children);
    }
  }

  // Construir modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  // Cerrar al hacer clic en el backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (onClose) onClose();
      else modal.remove();
    }
  });

  // Agregar al contenedor
  container.appendChild(modal);

  return modal;
}
