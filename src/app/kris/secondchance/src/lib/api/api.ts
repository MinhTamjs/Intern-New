import type { Task } from '../../features/tasks/types';
import type { Employee } from '../../features/employees/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://688c3f3acd9d22dda5cc7695.mockapi.io/api/ziraprefix';

// API endpoints
const ENDPOINTS = {
  tasks: '/tasks',
  employees: '/employees',
} as const;

/**
 * Generic API request function
 * @param endpoint - API endpoint
 * @param options - Request options
 * @returns Promise with response data
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw new Error(`Failed to connect to API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * GET request helper
 * @param endpoint - API endpoint
 * @returns Promise with response data
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint);
}

/**
 * POST request helper
 * @param endpoint - API endpoint
 * @param data - Request body data
 * @returns Promise with response data
 */
export async function apiPost<T, D = Record<string, unknown>>(endpoint: string, data: D): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request helper
 * @param endpoint - API endpoint
 * @param data - Request body data
 * @returns Promise with response data
 */
export async function apiPut<T, D = Record<string, unknown>>(endpoint: string, data: D): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request helper
 * @param endpoint - API endpoint
 * @returns Promise with response data
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

// Task API functions
export const taskAPI = {
  getAll: () => apiGet<Task[]>(ENDPOINTS.tasks),
  getById: (id: string) => apiGet<Task>(`${ENDPOINTS.tasks}/${id}`),
  getByAssignee: (assigneeId: string) => apiGet<Task[]>(`${ENDPOINTS.tasks}?assigneeId=${assigneeId}`),
  create: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => apiPost<Task>(ENDPOINTS.tasks, data),
  update: (id: string, data: Partial<Task>) => apiPut<Task>(`${ENDPOINTS.tasks}/${id}`, data),
  delete: (id: string) => apiDelete<void>(`${ENDPOINTS.tasks}/${id}`),
};

// Employee API functions
export const employeeAPI = {
  getAll: () => apiGet<Employee[]>(ENDPOINTS.employees),
  getById: (id: string) => apiGet<Employee>(`${ENDPOINTS.employees}/${id}`),
  create: (data: Omit<Employee, 'id'>) => apiPost<Employee>(ENDPOINTS.employees, data),
  update: (id: string, data: Partial<Employee>) => apiPut<Employee>(`${ENDPOINTS.employees}/${id}`, data),
  delete: (id: string) => apiDelete<void>(`${ENDPOINTS.employees}/${id}`),
};

// Auth API functions
export const authAPI = {
  getCurrentUser: () => apiGet(`${ENDPOINTS.employees}?limit=1`),
};

// Legacy API export for backward compatibility
export const api = {
  tasks: taskAPI,
  employees: employeeAPI,
  auth: authAPI,
}; 