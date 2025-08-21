// src/ui/components.ts
// Barril de UI: re-exporta pantallas y features. Contiene solo utilidades transversales de UI.

import { UI } from './ui';
import { FoodRepo } from '../services/foodService';
import { OrderRepo } from '../services/orderService';
import { formatCurrency, formatTime } from '../utils';
import { Order } from '../models';

// Re-exports de pantallas (screens)
export { renderDashboard } from './screens/dashboard';
export { renderFoods } from './screens/foods';
export { renderClients } from './screens/clients';
export { renderSettings } from './screens/settings';

// Re-exports de features
export { openSalesHistoryModal } from '../features/foods/salesHistory';
export { openFoodForm } from '../features/foods/foodForm';
export { openOrderForm } from '../features/orders/orderForm';
export { showOrderDetails } from '../features/orders/orderDetails';
export { showCallModal } from '../features/orders/callModal';

/** Cambia el estado de entrega con confirmación y spinner. */
export { handleDeliveryToggle } from '../features/orders/deliveryToggle';


