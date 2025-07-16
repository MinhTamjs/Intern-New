// Trạng thái công việc
export type Status = "Pending" | "In Progress" | "Done" | "Expired";

// Độ ưu tiên công việc
export type Priority = "High" | "Medium" | "Low";

// Định nghĩa một công việc (Task)
export interface Task {
  id: number;              // Mã định danh duy nhất
  priority: Priority;      // Độ ưu tiên
  title: string;           // Tiêu đề
  description: string;     // Mô tả
  dayStarted: string;      // Ngày bắt đầu (ISO string)
  dayExpired: string;      // Ngày kết thúc (ISO string)
  status: Status;          // Trạng thái
}