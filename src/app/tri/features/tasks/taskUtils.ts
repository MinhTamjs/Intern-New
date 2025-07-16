import { Task } from "./taskTypes";

// Save tasks to localStorage
export const saveToLocalStorage = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Load tasks from localStorage
export const loadFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
}; 