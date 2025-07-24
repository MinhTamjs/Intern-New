// src/todos/todosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../api/todosApi';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, { rejectWithValue }) => {
  try {
    return await getTodos();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createTodo = createAsyncThunk('todos/createTodo', async (todo, { rejectWithValue }) => {
  try {
    return await addTodo(todo);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const editTodo = createAsyncThunk('todos/editTodo', async ({ id, updatedTodo }, { rejectWithValue }) => {
  try {
    await updateTodo(id, updatedTodo);
    return { id, updatedTodo };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const removeTodo = createAsyncThunk('todos/removeTodo', async (id, { rejectWithValue }) => {
  try {
    await deleteTodo(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTodos.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(fetchTodos.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(createTodo.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(createTodo.fulfilled, (state, action) => { state.isLoading = false; state.items.push(action.payload); })
      .addCase(createTodo.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(editTodo.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(editTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex(t => t._id === action.payload.id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload.updatedTodo };
      })
      .addCase(editTodo.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(removeTodo.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(t => t._id !== action.payload);
      })
      .addCase(removeTodo.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  }
});

export default todosSlice.reducer;