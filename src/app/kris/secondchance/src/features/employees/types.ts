// Define the possible user roles in the system
export type Role = 'admin' | 'manager' | 'employee';

/**
 * Core Employee interface representing a user in the system
 * Contains employee data and role information
 */
export interface Employee {
  id: string; // Unique identifier for the employee
  name: string; // Full name of the employee
  email: string; // Email address for communication
  role: Role; // User role determining permissions and access
}

/**
 * Data structure for creating new employees
 * Used when submitting employee creation forms
 */
export interface CreateEmployeeData {
  name: string; // Employee name (required)
  email: string; // Employee email (required)
  role: Role; // Employee role (required)
} 