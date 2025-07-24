// Định nghĩa kiểu dữ liệu cho một công việc (Todo)
export interface Todo {
  id: string;           // Mã định danh duy nhất cho công việc
  text: string;         // Nội dung công việc
  completed: boolean;   // Trạng thái hoàn thành
  startDate: string;    // Ngày bắt đầu (ISO date string)
  endDate: string;      // Ngày kết thúc (ISO date string)
} 