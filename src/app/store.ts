// store.ts
import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";

export const store = configureStore({
  reducer: {
    task: taskReducer,
  },
});

// Type hỗ trợ cho useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
