import { UI } from '../ui';
import { updateGlobalHeaderState } from '../../app/header';

export function renderSettings(container: HTMLElement): void {
  const metaRaw = localStorage.getItem('fd_meta_v1') || '{}';
  let meta: { deliveryGapMinutes?: number; darkMode?: boolean } = {};
  try { meta = JSON.parse(metaRaw) || {}; } catch { meta = {}; }
  const gap = meta.deliveryGapMinutes ?? 15;
  const dark = !!meta.darkMode;

  container.innerHTML = `
    <section class="space-y-4">
      <div class="settings-header bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm opacity-0 transform translate-y-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <i class="fa fa-gear text-xl"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Configuración</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Personaliza tu experiencia</p>
          </div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="settings-card bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300 opacity-0 transform translate-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <i class="fa fa-clock text-orange-600 dark:text-orange-400 fa-lg"></i>
              </div>
              <div>
                <div class="font-medium text-base text-gray-900 dark:text-white">Intervalo</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">De entregas</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input id="inputGap" type="number" min="0" max="120" value="${gap}" class="w-16 px-2 py-1.5 border dark:border-dark-border rounded-lg text-center text-sm bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
            </div>
          </div>
        </div>
        <div class="settings-card bg-white dark:bg-dark-bg-secondary rounded-xl p-4 border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300 opacity-0 transform translate-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div id="themeIconContainer" class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <i id="themeIcon" class="${dark ? 'fa-solid fa-cloud-moon text-purple-600 dark:text-purple-400' : 'fa-solid fa-cloud-sun text-purple-600 dark:text-purple-400'}"></i>
              </div> 
              <div>
                <div class="font-medium text-base text-gray-900 dark:text-white">Tema</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Oscuro o Claro</div>
              </div>
            </div>
            <div>
              <button id="themeToggle" aria-pressed="${dark}" title="${dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}" class="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${dark ? 'bg-blue-600' : 'bg-gray-300'}">
                <span class="sr-only">Cambiar tema</span>
                <span id="toggleDot" class="inline-block w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${dark ? 'translate-x-6' : 'translate-x-1'}"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  const animatedElements = container.querySelectorAll('.settings-header, .settings-card');
  animatedElements.forEach((element, index) => {
    const el = element as HTMLElement;
    setTimeout(() => {
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 100);
  });

  const gapInput = container.querySelector('#inputGap') as HTMLInputElement | null;
  const themeToggle = container.querySelector('#themeToggle') as HTMLButtonElement | null;
  const themeIcon = container.querySelector('#themeIcon') as HTMLElement | null;
  const toggleDot = container.querySelector('#toggleDot') as HTMLElement | null;

  const applyDarkMode = (isDark: boolean) => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    if (themeToggle && toggleDot) {
      themeToggle.classList.toggle('bg-blue-600', isDark);
      themeToggle.classList.toggle('bg-gray-300', !isDark);
      toggleDot.classList.toggle('translate-x-6', isDark);
      toggleDot.classList.toggle('translate-x-1', !isDark);
    }
    if (themeIcon) {
      themeIcon.style.transform = 'scale(0.8)';
      themeIcon.style.opacity = '0.5';
      setTimeout(() => {
        themeIcon.className = isDark ? 'fa-solid fa-cloud-moon fa-lg text-purple-600 dark:text-purple-400' : 'fa-solid fa-cloud-sun fa-lg text-purple-600 dark:text-purple-400';
        themeIcon.style.transform = 'scale(1)';
        themeIcon.style.opacity = '1';
      }, 150);
    }
    const currentMetaRaw = localStorage.getItem('fd_meta_v1') || '{}';
    let currentMeta: any = {};
    try { currentMeta = JSON.parse(currentMetaRaw) || {}; } catch { currentMeta = {}; }
    currentMeta.darkMode = !!isDark;
    localStorage.setItem('fd_meta_v1', JSON.stringify(currentMeta));
  };

  const onGapChange = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const v = Number(input.value || 0);
    if (v < 0 || v > 120) {
      input.style.borderColor = '#ef4444';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }
    input.style.borderColor = '#10b981';
    input.style.backgroundColor = '#f0fdf4';
    setTimeout(() => { input.style.borderColor = ''; input.style.backgroundColor = ''; }, 1000);
    const mRaw = localStorage.getItem('fd_meta_v1') || '{}';
    let m: any = {};
    try { m = JSON.parse(mRaw) || {}; } catch { m = {}; }
    m.deliveryGapMinutes = v;
    localStorage.setItem('fd_meta_v1', JSON.stringify(m));
    UI.toast('Intervalo actualizado correctamente');
  };

  const onThemeToggle = () => {
    const current = document.documentElement.classList.contains('dark');
    const next = !current;
    if (themeToggle) {
      themeToggle.style.transform = 'scale(0.95)';
      setTimeout(() => { themeToggle.style.transform = 'scale(1)'; }, 100);
    }
    applyDarkMode(next);
    UI.toast(`Modo ${next ? 'oscuro' : 'claro'} activado`);
    updateGlobalHeaderState();
  };

  gapInput?.addEventListener('change', onGapChange);
  gapInput?.addEventListener('input', (e) => {
    const input = e.currentTarget as HTMLInputElement;
    const v = Number(input.value);
    if (v < 0 || v > 120) input.style.borderColor = '#ef4444';
    else input.style.borderColor = '';
  });
  themeToggle?.addEventListener('click', onThemeToggle);
  applyDarkMode(dark);
}


