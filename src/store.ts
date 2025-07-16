import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Task = {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
};

type State = {
  tasks: Task[];
};

const load = (): Task[] => {
  const saved = localStorage.getItem('tasks');
  return saved ? JSON.parse(saved) : [];
};

const save = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: load() } as State,
  reducers: {
    add: (state, action: PayloadAction<{ title: string; priority: Task['priority'] }>) => {
      const newTask: Task = {
        id: Date.now(),
        title: action.payload.title,
        priority: action.payload.priority,
        completed: false,
      };
      state.tasks.push(newTask);
      save(state.tasks);
    },
    toggle: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) task.completed = !task.completed;
      save(state.tasks);
    },
    remove: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      save(state.tasks);
    },
  },
});

export const { add, toggle, remove } = taskSlice.actions;

export const store = configureStore({ reducer: taskSlice.reducer });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
