import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice";
import filterReducer from "../features/filter/filterSlice";
import { loadState, saveState } from "../utils/localStorage";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    filter: filterReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    tasks: store.getState().tasks,
    filter: store.getState().filter,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 