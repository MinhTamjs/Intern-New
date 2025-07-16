// =============================================================================
// REDUX TOOLKIT VỚI TYPESCRIPT - HƯỚNG DẪN TOÀN DIỆN
// =============================================================================

// 1. CÀI ĐẶT CÁC PACKAGE CẦN THIẾT
/*
npm install @reduxjs/toolkit react-redux
npm install --save-dev @types/react-redux
*/

// 2. ĐỊNH NGHĨA CÁC INTERFACE VÀ TYPE
// =============================================================================

// Interface cho Task
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

// Interface cho User
interface User {
  id: string;
  name: string;
  email: string;
}

// Interface cho TaskState
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'completed' | 'pending';
}

// Interface cho UserState
interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Root State Type - tổng hợp tất cả state
interface RootState {
  tasks: TaskState;
  user: UserState;
}

// =============================================================================
// 3. TẠO SLICE VỚI createSlice
// =============================================================================

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state cho tasks
const initialTaskState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: 'all'
};

// Tạo Task Slice
const taskSlice = createSlice({
  name: 'tasks', // Tên slice
  initialState: initialTaskState,
  reducers: {
    // Action để thêm task mới
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      // Immer cho phép chúng ta "mutate" state một cách an toàn
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.tasks.push(newTask);
    },

    // Action để xóa task
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },

    // Action để toggle trạng thái completed
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
      }
    },

    // Action để cập nhật task
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    // Action để thay đổi filter
    setFilter: (state, action: PayloadAction<'all' | 'completed' | 'pending'>) => {
      state.filter = action.payload;
    },

    // Action để clear tất cả tasks
    clearTasks: (state) => {
      state.tasks = [];
    },

    // Action để set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Action để set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// =============================================================================
// 4. ASYNC ACTIONS VỚI createAsyncThunk
// =============================================================================

// Async action để fetch tasks từ API
export const fetchTasks = createAsyncThunk<
  Task[], // Return type
  void, // Argument type
  { rejectValue: string } // ThunkAPI config
>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks: Task[] = await response.json();
      return tasks;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Async action để tạo task mới
export const createTask = createAsyncThunk<
  Task, // Return type
  Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, // Argument type
  { rejectValue: string }
>(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const newTask: Task = await response.json();
      return newTask;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Async action để xóa task
export const deleteTask = createAsyncThunk<
  string, // Return type (task id)
  string, // Argument type (task id)
  { rejectValue: string }
>(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      return taskId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// =============================================================================
// 5. XỬ LÝ ASYNC ACTIONS TRONG SLICE
// =============================================================================

// Cập nhật taskSlice để xử lý async actions
const taskSliceWithAsync = createSlice({
  name: 'tasks',
  initialState: initialTaskState,
  reducers: {
    // ... các reducers đồng bộ như trên
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.tasks.push(newTask);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
      }
    },
    setFilter: (state, action: PayloadAction<'all' | 'completed' | 'pending'>) => {
      state.filter = action.payload;
    },
    clearTasks: (state) => {
      state.tasks = [];
    }
  },
  extraReducers: (builder) => {
    // Xử lý fetchTasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      });

    // Xử lý createTask
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create task';
      });

    // Xử lý deleteTask
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete task';
      });
  }
});

// =============================================================================
// 6. TẠO USER SLICE
// =============================================================================

const initialUserState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Async action để login
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const user: User = await response.json();
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  }
});

// =============================================================================
// 7. TẠO STORE VỚI configureStore
// =============================================================================

import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    tasks: taskSliceWithAsync.reducer,
    user: userSlice.reducer
  },
  // Middleware mặc định đã bao gồm redux-thunk và immer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  // Chỉ bật devTools trong development
  devTools: process.env.NODE_ENV !== 'production'
});

// =============================================================================
// 8. ĐỊNH NGHĨA TYPES CHO TYPESCRIPT
// =============================================================================

// Type cho RootState
export type RootState = ReturnType<typeof store.getState>;

// Type cho AppDispatch
export type AppDispatch = typeof store.dispatch;

// =============================================================================
// 9. TYPED HOOKS
// =============================================================================

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Typed useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// =============================================================================
// 10. EXPORT ACTIONS
// =============================================================================

export const {
  addTask,
  removeTask,
  toggleTask,
  setFilter,
  clearTasks
} = taskSliceWithAsync.actions;

export const {
  logout,
  clearError
} = userSlice.actions;

// =============================================================================
// 11. SELECTORS VỚI TYPESCRIPT
// =============================================================================

// Selector để lấy filtered tasks
export const selectFilteredTasks = (state: RootState): Task[] => {
  const { tasks, filter } = state.tasks;
  switch (filter) {
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'pending':
      return tasks.filter(task => !task.completed);
    default:
      return tasks;
  }
};

// Selector để lấy task count
export const selectTaskCount = (state: RootState) => ({
  total: state.tasks.tasks.length,
  completed: state.tasks.tasks.filter(task => task.completed).length,
  pending: state.tasks.tasks.filter(task => !task.completed).length
});

// Selector để lấy user info
export const selectCurrentUser = (state: RootState): User | null => 
  state.user.currentUser;

export const selectIsAuthenticated = (state: RootState): boolean => 
  state.user.isAuthenticated;

// =============================================================================
// 12. SỬ DỤNG TRONG COMPONENT
// =============================================================================

import React, { useEffect, useState } from 'react';

// Component Example
const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectFilteredTasks);
  const { loading, error, filter } = useAppSelector(state => state.tasks);
  const taskCount = useAppSelector(selectTaskCount);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Fetch tasks khi component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Handle thêm task mới
  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      try {
        await dispatch(createTask({
          title: newTaskTitle,
          description: '',
          completed: false,
          priority: 'medium'
        })).unwrap(); // unwrap() để handle error
        setNewTaskTitle('');
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    }
  };

  // Handle xóa task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // Handle toggle task
  const handleToggleTask = (taskId: string) => {
    dispatch(toggleTask(taskId));
  };

  // Handle filter change
  const handleFilterChange = (newFilter: 'all' | 'completed' | 'pending') => {
    dispatch(setFilter(newFilter));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Task List</h2>
      
      {/* Task counts */}
      <div>
        <span>Total: {taskCount.total}</span>
        <span>Completed: {taskCount.completed}</span>
        <span>Pending: {taskCount.pending}</span>
      </div>

      {/* Add new task */}
      <div>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* Filter buttons */}
      <div>
        <button 
          onClick={() => handleFilterChange('all')}
          style={{ fontWeight: filter === 'all' ? 'bold' : 'normal' }}
        >
          All
        </button>
        <button 
          onClick={() => handleFilterChange('completed')}
          style={{ fontWeight: filter === 'completed' ? 'bold' : 'normal' }}
        >
          Completed
        </button>
        <button 
          onClick={() => handleFilterChange('pending')}
          style={{ fontWeight: filter === 'pending' ? 'bold' : 'normal' }}
        >
          Pending
        </button>
      </div>

      {/* Task list */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span 
              style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => handleToggleTask(task.id)}
            >
              {task.title} - {task.priority}
            </span>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

// =============================================================================
// 13. PROVIDER SETUP
// =============================================================================

// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import TaskList from './TaskList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <TaskList />
      </div>
    </Provider>
  );
};

export default App;