// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../todos/todosSlice'; // Đổi import và tên state từ tasks sang todos

export const store = configureStore({
    reducer: {
        todos: todosReducer, // Đăng ký tasksReducer dưới key 'tasks'
        // Bạn có thể thêm các reducers khác ở đây nếu có nhiều slices
    },
});