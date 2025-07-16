import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Task } from "./taskTypes";
import { loadFromLocalStorage, saveToLocalStorage } from "./taskUtils";

// State quản lý toàn bộ task
export interface TaskState {
  tasks: Task[];           // Danh sách công việc
  editingId: number | null;// ID công việc đang sửa (nếu có)
  currentId: number;       // ID tiếp theo sẽ dùng khi thêm mới
  loading?: boolean;       // Trạng thái loading cho async
  error?: string | null;   // Lỗi khi fetch
}
const initialState: TaskState = {
  tasks: loadFromLocalStorage(),
  editingId: null,
  currentId: loadFromLocalStorage().reduce((max, t) => Math.max(max, t.id), 0) + 1,
  loading: false,
  error: null,
};

// Async thunk: fetchTasks (giả lập fetch từ API)
export const fetchTasks = createAsyncThunk<Task[], void>(
  "tasks/fetchTasks",
  async () => {
    // Giả lập fetch API, trả về mảng Task sau 1s
    return new Promise<Task[]>((resolve) => {
      setTimeout(() => {
        const data = loadFromLocalStorage();
        resolve(data);
      }, 1000);
    });
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      const task: Task = { id: state.currentId++, ...action.payload };
      state.tasks.push(task);
      saveToLocalStorage(state.tasks);
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      saveToLocalStorage(state.tasks);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        saveToLocalStorage(state.tasks);
      }
    },
    markAsDone: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task && task.status !== "Done") {
        task.status = "Done";
        saveToLocalStorage(state.tasks);
      }
    },
    setEditing: (state, action: PayloadAction<number | null>) => {
      state.editingId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tasks";
      });
  },
});

export const { addTask, deleteTask, updateTask, markAsDone, setEditing } = taskSlice.actions;
export default taskSlice.reducer; 