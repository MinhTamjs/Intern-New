import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoFilter } from '../types/todo';

// Interface cho state của todo
interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
}

// State ban đầu
const initialState: TodoState = {
  todos: [],
  filter: 'all'
};

// Tạo todo slice với Redux Toolkit
const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // Thêm todo mới
    addTodo: (state, action: PayloadAction<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTodo: Todo = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.todos.push(newTodo);
    },

    // Chuyển đổi trạng thái hoàn thành
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = new Date().toISOString();
      }
    },

    // Xóa todo
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },

    // Cập nhật todo
    updateTodo: (state, action: PayloadAction<{ id: string; title: string; description?: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
        if (action.payload.description !== undefined) {
          todo.description = action.payload.description;
        }
        todo.updatedAt = new Date().toISOString();
      }
    },

    // Đặt filter
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },

    // Load todos từ localStorage
    loadTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    }
  }
});

// Export actions
export const { 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  updateTodo, 
  setFilter, 
  loadTodos 
} = todoSlice.actions;

// Export reducer
export default todoSlice.reducer;

// Selectors
export const selectAllTodos = (state: { todo: TodoState }) => state.todo.todos;
export const selectFilter = (state: { todo: TodoState }) => state.todo.filter;

// Selector để lọc todos theo filter
export const selectFilteredTodos = (state: { todo: TodoState }) => {
  const { todos, filter } = state.todo;
  
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}; 