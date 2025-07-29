export type Employee = {
  id: string;
  name: string;
  email: string;
  position: "employee" | "manager" | "admin";
  // ... các trường khác nếu có
};
  
  const API_URL = 'https://6881dc8866a7eb81224c5612.mockapi.io/employees';
  
  export async function getEmployees() {
    const res = await fetch(API_URL);
    return res.json();
  }
  
  export async function addEmployee(employee: Omit<Employee, 'id'>) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    return res.json();
  }
  
  export async function deleteEmployee(id: string) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return res.json();
  }
  
  export async function updateEmployee(id: string, update: Partial<Employee>) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    return res.json();
  }
  
  export const EmployeeService = {
    getEmployees,
    addEmployee,
    deleteEmployee,
    updateEmployee,
  }; 