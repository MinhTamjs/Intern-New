import type { Employee, CreateEmployeeData } from '../features/employees/types';
import type { Task, CreateTaskData, UpdateTaskData } from '../features/tasks/types';

// API Configuration and base setup
export const API_CONFIG = {
  BASE_URL: 'https://6881dc8866a7eb81224c5612.mockapi.io',
  ENDPOINTS: {
    EMPLOYEES: '/employees',
    TASKS: '/tasks',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Generic API client for making requests
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string, defaultHeaders: HeadersInit = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<void> {
    return this.request<void>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL, API_CONFIG.HEADERS);

// API service functions
export const api = {
  // Employee endpoints
  employees: {
    getAll: () => apiClient.get<Employee[]>(API_CONFIG.ENDPOINTS.EMPLOYEES),
    create: (data: CreateEmployeeData) => apiClient.post<Employee>(API_CONFIG.ENDPOINTS.EMPLOYEES, data),
    update: (id: string, data: Partial<CreateEmployeeData>) => apiClient.put<Employee>(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`, data),
    delete: (id: string) => apiClient.delete(`${API_CONFIG.ENDPOINTS.EMPLOYEES}/${id}`),
  },

  // Task endpoints
  tasks: {
    getAll: () => apiClient.get<Task[]>(API_CONFIG.ENDPOINTS.TASKS),
    getByAssignee: (assigneeId: string) => 
      apiClient.get<Task[]>(`${API_CONFIG.ENDPOINTS.TASKS}?assigneeId=${assigneeId}`),
    create: (data: CreateTaskData) => apiClient.post<Task>(API_CONFIG.ENDPOINTS.TASKS, data),
    update: (id: string, data: UpdateTaskData) => apiClient.put<Task>(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`, data),
    delete: (id: string) => apiClient.delete(`${API_CONFIG.ENDPOINTS.TASKS}/${id}`),
  },

  // Auth endpoints
  auth: {
    getCurrentUser: () => apiClient.get<Employee[]>(`${API_CONFIG.ENDPOINTS.EMPLOYEES}?limit=1`),
  },
}; 