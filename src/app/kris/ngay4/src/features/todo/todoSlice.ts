import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types/Todo';

// Kiểu dữ liệu cho state của todo slice
interface TodoState {
  todos: Todo[]; // Danh sách công việc
}

const initialState: TodoState = {
  todos: []
};

// Payload khi thêm công việc mới
interface AddTodoPayload {
  text: string;      // Nội dung công việc
  startDate: string; // Ngày bắt đầu
  endDate: string;   // Ngày kết thúc
}

// Payload khi cập nhật ngày bắt đầu/kết thúc
interface UpdateTodoDatePayload {
  id: string;         // ID công việc
  startDate: string;  // Ngày bắt đầu mới
  endDate: string;    // Ngày kết thúc mới
}

// Slice quản lý các hành động và state liên quan đến todo
const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // Thêm công việc mới
    addTodo(state, action: PayloadAction<AddTodoPayload>) {
      state.todos.push({
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate
      });
    },
    // Đánh dấu hoàn thành/chưa hoàn thành
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    // Xóa công việc
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    // Cập nhật ngày bắt đầu/kết thúc
    updateTodoDate(state, action: PayloadAction<UpdateTodoDatePayload>) {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        todo.startDate = action.payload.startDate;
        todo.endDate = action.payload.endDate;
      }
    }
  }
});

// Export các action để component sử dụng
export const { addTodo, toggleTodo, removeTodo, updateTodoDate } = todoSlice.actions;
// Export reducer để store sử dụng
export default todoSlice.reducer; 