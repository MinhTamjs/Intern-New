// src/store/taskSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTasks as apiGetTasks,
  addTask as apiAddTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from './utils/API'; // đường dẫn tới API.ts

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  note?: string;
}

interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
};

export const fetchTasksAsync = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiGetTasks();
      return data.map(task => ({
        _id: task._id!,
        title: task.title ?? '',
        completed: !!task.completed,
        priority: task.priority ?? 'medium',
        startDate: task.startDate ?? '',
        endDate: task.endDate ?? '',
        note: task.note ?? '',
      }));
    } catch (err: any) {
      return rejectWithValue(err.message || 'Không thể tải công việc');
    }
  }
);

export const addTaskAsync = createAsyncThunk<Task, Omit<Task, '_id'>, { rejectValue: string }>(
  'tasks/addTask',
  async (newTask, { rejectWithValue }) => {
    try {
      const added = await apiAddTask(newTask);
      return { ...newTask, _id: added._id! };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Không thể thêm công việc');
    }
  }
);

export const updateTaskAsync = createAsyncThunk<Task, Task, { rejectValue: string }>(
  'tasks/updateTask',
  async (task, { rejectWithValue }) => {
    try {
      const { _id, ...body } = task;
      await apiUpdateTask(_id, body);
      return task;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Không thể cập nhật công việc');
    }
  }
);

export const deleteTaskAsync = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/deleteTask',
  async (_id, { rejectWithValue }) => {
    try {
      await apiDeleteTask(_id);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Không thể xoá công việc');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasksAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || null;
      })
      .addCase(addTaskAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
