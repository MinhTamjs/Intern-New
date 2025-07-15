import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../features/todo/todoSlice';
import filterReducer from '../features/filter/filterSlice';
import { loadState, saveState } from '../utils/localStorage';

// Lấy state từ localStorage (nếu có) để khởi tạo store
const preloadedState = loadState();

// Tạo Redux store, combine các slice reducer
export const store = configureStore({
  reducer: {
    todo: todoReducer,   // Quản lý state công việc
    filter: filterReducer // Quản lý state filter
  },
  preloadedState
});

// Lưu state vào localStorage mỗi khi state thay đổi
store.subscribe(() => {
  saveState({
    todo: store.getState().todo,
    filter: store.getState().filter
  });
});

// Kiểu RootState và AppDispatch cho toàn bộ app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 