// src/features/tasks/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllTasks, createTask, updateTask, deleteTask } from '../api/tasksApi'; // Import các hàm API của bạn

// Định nghĩa các async thunks
// Thunk để lấy tất cả tasks
export const fetchTasks = createAsyncThunk(
    'todos/fetchTasks', // action type prefix
    async (_, { rejectWithValue }) => {
        try {
            const tasks = await getAllTasks();
            return tasks;
        } catch (error) {
            // Sử dụng rejectWithValue để truyền lỗi vào payload của rejected action
            return rejectWithValue(error.message);
        }
    }
);

// Thunk để thêm một task mới
export const addTask = createAsyncThunk(
    'todos/addTask',
    async (taskData, { rejectWithValue }) => {
        try {
            const newTask = await createTask(taskData);
            return newTask;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk để cập nhật một task
export const updateExistingTask = createAsyncThunk( // Đổi tên để tránh trùng với hàm API
    'todos/updateTask',
    async ({ taskId, updatedData }, { rejectWithValue }) => {
        try {
            // CrudCrud PUT không trả về body, nên nếu cần task đã update,
            // bạn có thể lấy lại toàn bộ danh sách hoặc cập nhật optimistic.
            // Ở đây, chúng ta sẽ trả về updatedData để cập nhật trong state.
            await updateTask(taskId, updatedData);
            // CrudCrud không trả về đối tượng đã cập nhật, nên chúng ta sẽ trả về taskId và updatedData
            return { taskId, ...updatedData }; // Trả về ID và dữ liệu đã cập nhật
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk để xóa một task
export const deleteExistingTask = createAsyncThunk( // Đổi tên để tránh trùng với hàm API
    'todos/deleteTask',
    async (taskId, { rejectWithValue }) => {
        try {
            await deleteTask(taskId);
            return taskId; // Trả về ID của task đã xóa
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const tasksSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        // Reducers đồng bộ nếu có, ví dụ: clearTasks: (state) => { state.items = []; }
    },
    extraReducers: (builder) => {
        builder
            // --- fetchTasks ---
            .addCase(fetchTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload; // payload chứa danh sách tasks từ API
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch tasks'; // payload chứa lỗi từ rejectWithValue
                state.items = []; // Xóa dữ liệu cũ khi có lỗi
            })
            // --- addTask ---
            .addCase(addTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.isLoading = false;
                // Thêm task mới vào cuối mảng items
                state.items.push(action.payload); // payload là task mới từ API (có _id)
            })
            .addCase(addTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to add task';
            })
            // --- updateExistingTask ---
            .addCase(updateExistingTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateExistingTask.fulfilled, (state, action) => {
                state.isLoading = false;
                // Tìm task trong state và cập nhật nó
                const { taskId, ...updatedFields } = action.payload;
                const existingTaskIndex = state.items.findIndex(task => task._id === taskId);
                if (existingTaskIndex !== -1) {
                    state.items[existingTaskIndex] = {
                        ...state.items[existingTaskIndex],
                        ...updatedFields, // Cập nhật các trường đã thay đổi
                    };
                }
            })
            .addCase(updateExistingTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to update task';
            })
            // --- deleteExistingTask ---
            .addCase(deleteExistingTask.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteExistingTask.fulfilled, (state, action) => {
                state.isLoading = false;
                // Lọc bỏ task đã xóa khỏi mảng items
                state.items = state.items.filter(task => task._id !== action.payload); // payload là ID của task đã xóa
            })
            .addCase(deleteExistingTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to delete task';
            });
    },
});

export default tasksSlice.reducer; // Export reducer mặc định của slice