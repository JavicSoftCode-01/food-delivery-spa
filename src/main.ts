// src\main.ts
import './styles.css';
import { UI } from './ui/ui';
import { updateGlobalHeaderState } from './app/header';
import { Router, Screen } from './app/router';
import { loadFeature } from './app/lazyLoader';
import { prefetchCritical } from './app/intelligentPrefetch';

/** Renderiza la pantalla actual usando lazy loading. */
async function renderCurrent(): Promise<void> {
	const current = Router.getScreen();
	UI.updateTitle(current);
	UI.renderNavActive(current);
	updateGlobalHeaderState();

	const main = document.getElementById('mainArea')!;
	main.innerHTML = '';
	
	// Mostrar loading state
	main.innerHTML = '<div class="flex items-center justify-center h-32"><div class="spinner"></div></div>';
	
	try {
		// Obtener el renderizador lazy
		const renderer = await Router.getRenderer(current);
		
		// Limpiar y renderizar
		main.innerHTML = '';
		const container = document.createElement('div');
		main.appendChild(container);
		
		renderer(container);
	} catch (error) {
		console.error('Error renderizando pantalla:', error);
		main.innerHTML = `
			<div class="flex flex-col items-center justify-center h-32 text-red-500">
				<i class="fa fa-exclamation-triangle fa-2x mb-2"></i>
				<p>Error cargando la pantalla</p>
				<button onclick="location.reload()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
					Recargar
				</button>
			</div>
		`;
	}
}

import { CONFIG } from './app/config';

/** Inicializa el tema oscuro si está guardado en localStorage. */
function initializeTheme(): void {
	const metaRaw = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS) || '{}';
	let meta: { darkMode?: boolean } = {};
	try { meta = JSON.parse(metaRaw) || {}; } catch { meta = {}; }
	if (meta.darkMode) {
		document.documentElement.classList.add('dark');
	}
}

/** Inicializa shell y listeners de navegación. */
function bootstrap(): void {
	initializeTheme();
	UI.renderShell();

	// Delegado de navegación (botones creados por renderShell)
	document.querySelectorAll<HTMLElement>('#bottomNav .nav-item').forEach((b) => {
		b.setAttribute('tabindex', '0');
		b.addEventListener('click', async (e) => {
			const screen = (e.currentTarget as HTMLElement).dataset.screen as Screen | undefined;
			if (screen) {
				// Mostrar loading state en el botón
				const button = e.currentTarget as HTMLElement;
				const originalText = button.innerHTML;
				button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
				button.setAttribute('disabled', 'true');
				
				try {
					await Router.setScreen(screen);
				} finally {
					// Restaurar botón
					button.innerHTML = originalText;
					button.removeAttribute('disabled');
				}
			}
		});
	});

	// Scroll-to-top button logic
	const scrollToTopBtn = document.getElementById('scrollToTopBtn');
	if (scrollToTopBtn) {
		window.addEventListener('scroll', () => {
			const s = Router.getScreen();
			const shouldBeVisible = window.scrollY > 200 && (s === 'clients' || s === 'foods');
			if (shouldBeVisible) {
				scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
			} else {
				scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
			}
		}, { passive: true });

		scrollToTopBtn.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	// Eventos globales para abrir formularios usando lazy loading
	document.addEventListener('openOrderForm', async (e) => {
		const id = (e as CustomEvent).detail?.id as string | undefined;
		try {
			const { openOrderForm } = await loadFeature('orderForm');
			openOrderForm(id);
		} catch (error) {
			console.error('Error abriendo formulario de pedido:', error);
		}
	});

	document.addEventListener('openFoodForm', async (e) => {
		const id = (e as CustomEvent).detail?.id as string | undefined;
		try {
			const { openFoodForm } = await loadFeature('foodForm');
			openFoodForm(id);
		} catch (error) {
			console.error('Error abriendo formulario de comida:', error);
		}
	});

	document.addEventListener('openSalesHistory', async (e) => {
		const foodId = (e as CustomEvent).detail?.foodId as string | undefined;
		if (foodId) {
			try {
				const { openSalesHistoryModal } = await loadFeature('salesHistory');
				openSalesHistoryModal(foodId);
			} catch (error) {
				console.error('Error abriendo historial de ventas:', error);
			}
		}
	});

	// Eventos auxiliares para abrir modales transversales usando lazy loading
	document.addEventListener('openOrderDetails', async (e) => {
		const id = (e as CustomEvent).detail?.id as string | undefined;
		if (!id) return;
		try {
			const { showOrderDetails } = await loadFeature('orderDetails');
			showOrderDetails(id, () => document.dispatchEvent(new CustomEvent('refreshViews')));
		} catch (error) {
			console.error('Error abriendo detalles del pedido:', error);
		}
	});

	document.addEventListener('openCallModal', async (e) => {
		const phone = (e as CustomEvent).detail?.phone as string | undefined;
		if (!phone) return;
		try {
			const { showCallModal } = await loadFeature('callModal');
			showCallModal(phone);
		} catch (error) {
			console.error('Error abriendo modal de llamada:', error);
		}
	});

	// Precarga todas las pantallas en background para mejorar UX
	Router.preloadAll();

	// Iniciar prefetching inteligente de módulos críticos
	prefetchCritical();

	Router.subscribe(() => renderCurrent());
	renderCurrent();
}

/* -------------------- Bootstrap app -------------------- */

bootstrap();

// Inicializar monitoreo de bundle en desarrollo
if (typeof window !== 'undefined') {
  import('./utils/bundleAnalyzer').then(({ initializeBundleMonitoring }) => {
    initializeBundleMonitoring();
  }).catch(console.error);
}