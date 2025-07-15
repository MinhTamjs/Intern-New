export type Status = "Pending" | "In Progress" | "Done" | "Expired";
export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: number;
  priority: Priority;
  title: string;
  description: string;
  dayStarted: string; // ISO string
  dayExpired: string;
  status: Status;
}
