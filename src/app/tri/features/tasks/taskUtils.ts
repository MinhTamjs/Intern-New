import { Task } from "./taskTypes";

export const saveToLocalStorage = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const loadFromLocalStorage = (): Task[] => {
  const data = localStorage.getItem("tasks");
  return data ? JSON.parse(data) : [];
};
