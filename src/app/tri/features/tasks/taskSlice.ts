import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"; // Import các hàm từ Redux Toolkit
import type { Task } from "../../../types/schema"; // Chỉ dùng type Task cho state, bỏ Employee
import * as taskApi from "./taskApi"; // Import các hàm gọi API

// Định nghĩa state cho slice quản lý Task
export interface TaskState {
  tasks: Task[];              // Danh sách các Task
  editingId: string | null;   // ID của Task đang được chỉnh sửa (nếu có)
  loading?: boolean;          // Trạng thái loading khi gọi API
  error?: string | null;      // Thông báo lỗi (nếu có)
}

// State khởi tạo ban đầu
const initialState: TaskState = {
  tasks: [],
  editingId: null,
  loading: false,
  error: null,
};

// Thunk lấy danh sách Task từ API
export const fetchTasks = createAsyncThunk<Task[], void>(
  "tasks/fetchTasks",
  async () => {
    return await taskApi.getTasks(); // Gọi hàm lấy danh sách Task từ API
  }
);

// Thunk thêm mới Task lên API
export const addTask = createAsyncThunk<Task, Omit<Task, "id">>(
  "tasks/addTask",
  async (task) => {
    return await taskApi.createTask(task); // Gọi hàm tạo Task mới trên API
  }
);

// Thunk cập nhật Task lên API
export const updateTaskAsync = createAsyncThunk<Task, { id: string; updates: Partial<Task> }>(
  "tasks/updateTask",
  async ({ id, updates }) => {
    return await taskApi.updateTask(id, updates); // Gọi hàm cập nhật Task trên API
  }
);

// Thunk xóa Task khỏi API
export const deleteTaskAsync = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (id) => {
    await taskApi.deleteTask(id); // Gọi hàm xóa Task trên API
    return id; // Trả về id để cập nhật lại state
  }
);

// Slice quản lý Task với các reducer và extraReducers cho các thunk
const taskSlice = createSlice({
  name: "tasks", // Tên slice
  initialState,
  reducers: {
    // Đặt ID của Task đang chỉnh sửa
    setEditing: (state, action: PayloadAction<string | null>) => {
      state.editingId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý trạng thái khi fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        // Chuẩn hóa: luôn đảm bảo mỗi task có labels/projects là mảng
        state.tasks = action.payload.map(task => ({
          ...task,
          labels: Array.isArray(task.labels) ? task.labels : [],
          projects: Array.isArray(task.projects) ? task.projects : [],
        }));
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      })
      // Xử lý khi thêm Task thành công
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Xử lý khi cập nhật Task thành công
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      // Xử lý khi xóa Task thành công
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id.toString() !== action.payload);
      });
  },
});

// Export action và reducer
export const { setEditing } = taskSlice.actions;
export default taskSlice.reducer; 