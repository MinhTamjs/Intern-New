import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTasks, addTask, updateTask, deleteTask } from '../../api/taskApi';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return await getTasks();
});

export const createTask = createAsyncThunk('tasks/createTask', async (task, { rejectWithValue }) => {
  try {
    // Bỏ kiểm tra trùng tên ở đây, chỉ gọi addTask
    return await addTask(task);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateTaskAsync = createAsyncThunk('tasks/updateTask', async ({ id, updatedTask }) => {
  await updateTask(id, updatedTask); // chỉ cần chờ PUT thành công
  return { id, updatedTask }; // trả về object đã update
});

export const deleteTaskAsync = createAsyncThunk('tasks/deleteTask', async (id) => {
  const response = await deleteTask(id);
  // Nếu response là object có id, trả về response.id, nếu không thì trả về id truyền vào
  return (response && response.id) ? response.id : id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.error = null; // Reset error khi tạo task thành công
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const { id, updatedTask } = action.payload;
        const index = state.tasks.findIndex(task => task.id === id);
        if (index !== -1) state.tasks[index] = { ...state.tasks[index], ...updatedTask };
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;