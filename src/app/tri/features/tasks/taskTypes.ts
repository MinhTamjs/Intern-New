// Định nghĩa các kiểu dữ liệu cho Task

// Trạng thái công việc (Status)
export type Status = "Pending" | "In Progress" | "Done" | "Expired"; // Các trạng thái có thể có của một Task

// Độ ưu tiên công việc (Priority)
export type Priority = "High" | "Medium" | "Low"; // Các mức độ ưu tiên của Task

// Định nghĩa interface cho một công việc (Task)
export interface Task {
  id: number;              // Mã định danh duy nhất cho mỗi Task
  priority: Priority;      // Độ ưu tiên của Task
  title: string;           // Tiêu đề Task
  description: string;     // Mô tả chi tiết Task
  dayStarted: string;      // Ngày bắt đầu (dạng ISO string)
  dayExpired: string;      // Ngày kết thúc (dạng ISO string)
  status: Status;          // Trạng thái hiện tại của Task
  labels?: string[];       // Danh sách nhãn (label/tag) gắn cho Task (VD: ['Gấp', 'Bug'])
  projects?: string[];     // Danh sách dự án mà Task thuộc về (VD: ['Website bán hàng', 'Nội bộ'])
}