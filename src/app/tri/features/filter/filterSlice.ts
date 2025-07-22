// Slice quản lý bộ lọc (filter) cho Task
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa state cho bộ lọc Task
export interface FilterState {
  keyword: string;   // Từ khóa tìm kiếm
  status: string;    // Trạng thái filter ("All", "Pending", ...)
  priority: string;  // Độ ưu tiên filter ("All", "High", ...)
  labels: string[];  // Danh sách nhãn filter (lọc nhiều nhãn cùng lúc)
  projects: string[]; // Danh sách dự án filter (lọc nhiều project cùng lúc)
}

// State khởi tạo mặc định cho filter
const initialState: FilterState = {
  keyword: "",
  status: "",
  priority: "",
  labels: [],    // Danh sách nhãn filter mặc định
  projects: [],  // Danh sách dự án filter mặc định
};

// Slice quản lý filter với 1 reducer setFilter
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // Cập nhật filter (gộp các trường mới vào state cũ)
    setFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer; 