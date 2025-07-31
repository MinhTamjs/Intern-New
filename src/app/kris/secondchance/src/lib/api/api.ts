// API base URL
const API_BASE_URL = 'https://6881dc8866a7eb81224c5612.mockapi.io';

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
export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
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
export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
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
  getAll: () => apiGet(ENDPOINTS.tasks),
  getById: (id: string) => apiGet(`${ENDPOINTS.tasks}/${id}`),
  getByAssignee: (assigneeId: string) => apiGet(`${ENDPOINTS.tasks}?assigneeId=${assigneeId}`),
  create: (data: any) => apiPost(ENDPOINTS.tasks, data),
  update: (id: string, data: any) => apiPut(`${ENDPOINTS.tasks}/${id}`, data),
  delete: (id: string) => apiDelete(`${ENDPOINTS.tasks}/${id}`),
};

// Employee API functions
export const employeeAPI = {
  getAll: () => apiGet(ENDPOINTS.employees),
  getById: (id: string) => apiGet(`${ENDPOINTS.employees}/${id}`),
  create: (data: any) => apiPost(ENDPOINTS.employees, data),
  update: (id: string, data: any) => apiPut(`${ENDPOINTS.employees}/${id}`, data),
  delete: (id: string) => apiDelete(`${ENDPOINTS.employees}/${id}`),
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