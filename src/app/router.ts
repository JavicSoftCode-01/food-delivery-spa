// Enrutador mínimo para manejar la pantalla actual y suscriptores

export type Screen = 'dashboard' | 'clients' | 'foods' | 'settings';

type Listener = (screen: Screen) => void;

let currentScreen: Screen = 'dashboard';
const listeners = new Set<Listener>();

export const Router = {
  getScreen(): Screen {
    return currentScreen;
  },
  setScreen(next: Screen) {
    if (next === currentScreen) return;
    currentScreen = next;
    listeners.forEach(l => l(currentScreen));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};


