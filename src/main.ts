// src\main.ts
import './styles.css';
import { UI } from './ui/ui';
import { renderDashboard, renderClients, renderFoods, renderSettings, openOrderForm, openFoodForm, openSalesHistoryModal } from './ui/components';
import { updateGlobalHeaderState } from './app/header';
import { Router, Screen } from './app/router';

/** Renderiza la pantalla actual usando los renderers del UI. */
function renderCurrent(): void {
	const current = Router.getScreen();
	UI.updateTitle(current);
	UI.renderNavActive(current);
	updateGlobalHeaderState();

	const main = document.getElementById('mainArea')!;
	main.innerHTML = '';
	const container = document.createElement('div');
	main.appendChild(container);

	if (current === 'dashboard') renderDashboard(container);
	else if (current === 'clients') renderClients(container);
	else if (current === 'foods') renderFoods(container);
	else if (current === 'settings') renderSettings(container);
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
		b.addEventListener('click', (e) => {
			const screen = (e.currentTarget as HTMLElement).dataset.screen as Screen | undefined;
			if (screen) Router.setScreen(screen);
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

	// Eventos globales para abrir formularios desde otros módulos
	document.addEventListener('openOrderForm', (e) => {
		const id = (e as CustomEvent).detail?.id as string | undefined;
		openOrderForm(id);
	});

	document.addEventListener('openFoodForm', (e) => {
		const id = (e as CustomEvent).detail?.id as string | undefined;
		openFoodForm(id);
	});

	document.addEventListener('openSalesHistory', (e) => {
		const foodId = (e as CustomEvent).detail?.foodId as string | undefined;
		if (foodId) openSalesHistoryModal(foodId);
	});

	// Eventos auxiliares para abrir modales transversales
	document.addEventListener('openOrderDetails', (e) => {
		const id = (e as CustomEvent).detail?.id as string | undefined;
		if (!id) return;
		import('./ui/components').then(m => m.showOrderDetails(id, () => document.dispatchEvent(new CustomEvent('refreshViews'))));
	});

	document.addEventListener('openCallModal', (e) => {
		const phone = (e as CustomEvent).detail?.phone as string | undefined;
		if (!phone) return;
		import('./ui/components').then(m => m.showCallModal(phone));
	});

	Router.subscribe(() => renderCurrent());
	renderCurrent();
}

/* -------------------- Bootstrap app -------------------- */

bootstrap();