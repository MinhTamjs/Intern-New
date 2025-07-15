import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "./taskTypes";
import { loadFromLocalStorage, saveToLocalStorage } from "./taskUtils";

interface TaskState {
  tasks: Task[];
  editingId: number | null;
  currentId: number;
}

const initialState: TaskState = {
  tasks: loadFromLocalStorage(),
  editingId: null,
  currentId: loadFromLocalStorage().reduce((max, t) => Math.max(max, t.id), 0) + 1,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      const task: Task = { id: state.currentId++, ...action.payload };
      state.tasks.push(task);
      saveToLocalStorage(state.tasks);
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      saveToLocalStorage(state.tasks);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        saveToLocalStorage(state.tasks);
      }
    },
    markAsDone: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task && task.status !== "Done") {
        task.status = "Done";
        saveToLocalStorage(state.tasks);
      }
    },
    setEditing: (state, action: PayloadAction<number | null>) => {
      state.editingId = action.payload;
    }
  }
});

export const { addTask, deleteTask, updateTask, markAsDone, setEditing } = taskSlice.actions;
export default taskSlice.reducer;
