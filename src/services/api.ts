// src/services/api.ts
// Cliente HTTP centralizado para el proyecto food-delivery-spa

import { CONFIG } from '../app/config';

/**
 * Configuración base para las llamadas API
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

/**
 * Clase para manejar errores de API
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Cliente HTTP simple usando fetch
 */
class APIClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  /**
   * Realiza una petición HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      // Si la respuesta es vacía, retornar null
      if (response.status === 204) {
        return null as T;
      }

      // Intentar parsear JSON
      try {
        return await response.json();
      } catch {
        // Si no es JSON, retornar texto
        return response.text() as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      if (error.name === 'AbortError') {
        throw new APIError('Timeout de la petición', 408);
      }
      
      throw new APIError(
        error.message || 'Error de conexión',
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Instancia singleton del cliente API
export const apiClient = new APIClient();

/**
 * Funciones helper para endpoints específicos
 */
export const api = {
  // Foods
  foods: {
    getAll: () => apiClient.get('/foods'),
    getById: (id: string) => apiClient.get(`/foods/${id}`),
    create: (data: any) => apiClient.post('/foods', data),
    update: (id: string, data: any) => apiClient.put(`/foods/${id}`, data),
    delete: (id: string) => apiClient.delete(`/foods/${id}`),
    getSalesHistory: (foodId: string) => apiClient.get(`/foods/${foodId}/sales`),
  },

  // Orders
  orders: {
    getAll: () => apiClient.get('/orders'),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    create: (data: any) => apiClient.post('/orders', data),
    update: (id: string, data: any) => apiClient.put(`/orders/${id}`, data),
    delete: (id: string) => apiClient.delete(`/orders/${id}`),
    updateDeliveryStatus: (id: string, delivered: boolean) => 
      apiClient.patch(`/orders/${id}/delivery`, { delivered }),
  },

  // Sales Records
  salesRecords: {
    getAll: () => apiClient.get('/sales-records'),
    getByFoodId: (foodId: string) => apiClient.get(`/sales-records/food/${foodId}`),
    create: (data: any) => apiClient.post('/sales-records', data),
    update: (id: string, data: any) => apiClient.put(`/sales-records/${id}`, data),
  },

  // Analytics
  analytics: {
    getDashboard: () => apiClient.get('/analytics/dashboard'),
    getSalesReport: (startDate: string, endDate: string) => 
      apiClient.get(`/analytics/sales?start=${startDate}&end=${endDate}`),
  }
};
