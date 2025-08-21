// src/app/config.ts
// Configuración centralizada del proyecto food-delivery-spa

export const CONFIG = {
  // Claves de localStorage
  STORAGE_KEYS: {
    FOODS: 'fd_foods_v1',
    ORDERS: 'fd_orders_v1',
    SETTINGS: 'fd_meta_v1',
    SALES_RECORDS: 'fd_sales_records_v1'
  },

  // Configuración de negocio
  BUSINESS: {
    DEFAULT_DELIVERY_TIME: '30',
    PHONE_PREFIX: '+593',
    CURRENCY: 'USD',
    MIN_ORDER_AMOUNT: 5.00,
    MAX_DELIVERY_TIME: 120 // minutos
  },

  // Configuración de UI
  UI: {
    ANIMATION_DURATION: 150,
    TOAST_DURATION: 3000,
    SPINNER_DELAY: 150,
    SCROLL_THRESHOLD: 200
  },

  // Configuración de validación
  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MIN_PHONE_LENGTH: 10,
    MAX_PHONE_LENGTH: 15,
    MIN_ADDRESS_LENGTH: 10,
    MAX_ADDRESS_LENGTH: 200
  }
};

// Tipos de pantallas disponibles
export type ScreenType = 'dashboard' | 'clients' | 'foods' | 'settings';

// Estados de pedidos
export type OrderStatus = 'pending' | 'delivered' | 'cancelled';

// Estados de comidas
export type FoodStatus = 'active' | 'inactive' | 'out_of_stock';
