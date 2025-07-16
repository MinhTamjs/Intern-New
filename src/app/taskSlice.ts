// taskSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho một công việc
export interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  startDate: string;
  endDate: string;
  note?: string;
}

// Kiểu cho state quản lý danh sách công việc
interface TaskState {
  tasks: Task[];
  filter: "all" | "high" | "medium" | "low";
  search: string;
}

// State khởi tạo ban đầu
const initialState: TaskState = {
  tasks: [],
  filter: "all",
  search: "",
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // Thêm công việc mới
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      const newTask: Task = {
        id: Date.now().toString(), // ID duy nhất
        ...action.payload,
      };
      state.tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    // Xoá công việc theo ID
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    // Tải lại công việc từ localStorage
    loadFromLocalStorage: (state) => {
      try {
        const saved = localStorage.getItem("tasks");
        if (saved) {
          const parsed = JSON.parse(saved) as Task[];
          state.tasks = Array.isArray(parsed) ? parsed : [];
        }
      } catch (error) {
        console.error("Lỗi khi đọc từ localStorage:", error);
      }
    },

    // Đặt bộ lọc độ ưu tiên
    setFilter: (state, action: PayloadAction<"all" | "high" | "medium" | "low">) => {
      state.filter = action.payload;
    },

    // Đặt từ khoá tìm kiếm
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const {
  addTask,
  deleteTask,
  loadFromLocalStorage,
  setFilter,
  setSearch,
} = taskSlice.actions;

export default taskSlice.reducer;
