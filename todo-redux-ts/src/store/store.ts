import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

// Cấu hình Redux store
export const store = configureStore({
  reducer: {
    todo: todoReducer
  },
  // Middleware mặc định của Redux Toolkit
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Cho phép Date objects trong actions
        ignoredActions: ['todo/addTodo'],
        ignoredPaths: ['todo.todos']
      }
    })
});

// Export types cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 