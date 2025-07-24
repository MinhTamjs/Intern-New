// Cấu hình Redux store cho toàn bộ ứng dụng
import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice"; // Import reducer quản lý Task
import filterReducer from "../features/filter/filterSlice"; // Import reducer quản lý Filter
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Khởi tạo Redux store với 2 slice: tasks và filter
export const store = configureStore({
  reducer: {
    tasks: taskReducer,   // Quản lý state cho Task
    filter: filterReducer // Quản lý state cho bộ lọc
  }
});

// Kiểu dữ liệu cho state và dispatch của app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks cho Redux
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 