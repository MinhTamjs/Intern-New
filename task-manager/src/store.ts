import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loadState, saveState } from './utils/localStorage'; // Import các hàm tiện ích mới

export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  note?: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Khởi tạo trạng thái ban đầu bằng cách tải từ localStorage
const initialState: TasksState = {
  tasks: loadState(), // Sử dụng hàm loadState() ở đây
  status: 'idle',
  error: null,
};

export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (taskData: Omit<Task, 'id' | 'completed'>, { rejectWithValue }) => {
    try {
      const response = await new Promise<Task>(resolve =>
        setTimeout(() => {
          const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            completed: false,
          };
          resolve(newTask);
        }, 1000)
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Chúng ta vẫn giữ reducer 'add' cho trường hợp bạn muốn dùng nó trực tiếp
    // nhưng trong App.tsx chúng ta dùng addTaskAsync
    add: (state, action: PayloadAction<Omit<Task, 'id' | 'completed'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        completed: false
      };
      state.tasks.push(newTask);
      saveState(state.tasks); // Sử dụng saveState()
    },
    update: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        saveState(state.tasks); // Sử dụng saveState()
      }
    },
    remove: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      saveState(state.tasks); // Sử dụng saveState()
    },
    toggle: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveState(state.tasks); // Sử dụng saveState()
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
        saveState(state.tasks); // Sử dụng saveState()
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { update, remove, toggle, add } = taskSlice.actions; // Thêm add nếu bạn muốn giữ nó

const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer
  }
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
