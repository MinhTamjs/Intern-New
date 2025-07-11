import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Check, X, Filter } from 'lucide-react';

// Định nghĩa các kiểu dữ liệu TypeScript
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'completed' | 'pending';
}

// Các action types cho Redux-like pattern
type TodoAction = 
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'UPDATE_TODO'; payload: { id: string; title: string; description: string } }
  | { type: 'SET_FILTER'; payload: 'all' | 'completed' | 'pending' };

// Reducer function theo pattern Redux Toolkit
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      const newTodo: Todo = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return {
        ...state,
        todos: [...state.todos, newTodo]
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
            : todo
        )
      };
    
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { 
                ...todo, 
                title: action.payload.title, 
                description: action.payload.description,
                updatedAt: new Date()
              }
            : todo
        )
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    
    default:
      return state;
  }
};

// Component cho form thêm/chỉnh sửa công việc
interface TodoFormProps {
  onSubmit: (todo: { title: string; description: string }) => void;
  onCancel: () => void;
  initialValues?: { title: string; description: string };
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, onCancel, initialValues, isEditing = false }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {isEditing ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề công việc *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề công việc..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả công việc..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {isEditing ? <Edit3 size={16} /> : <Plus size={16} />}
            {isEditing ? 'Cập nhật' : 'Thêm'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <X size={16} />
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

// Component cho từng item công việc
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (data: { title: string; description: string }) => {
    onEdit(todo.id, data.title, data.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TodoForm
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
        initialValues={{ title: todo.title, description: todo.description }}
        isEditing={true}
      />
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {todo.completed && <Check size={12} />}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-medium text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`text-sm mt-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Tạo: {todo.createdAt.toLocaleString('vi-VN')}
              {todo.updatedAt > todo.createdAt && (
                <span className="ml-2">
                  | Cập nhật: {todo.updatedAt.toLocaleString('vi-VN')}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            disabled={todo.completed}
          >
            <Edit3 size={16} />
          </button>
          
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component chính
const TodoManager: React.FC = () => {
  // Khởi tạo state với useReducer (tương tự Redux)
  const [state, dispatch] = React.useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  });

  const [showForm, setShowForm] = useState(false);

  // Lọc todos theo trạng thái hiện tại
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'completed':
        return todo.completed;
      case 'pending':
        return !todo.completed;
      default:
        return true;
    }
  });

  // Các hàm xử lý sự kiện
  const handleAddTodo = (todoData: { title: string; description: string }) => {
    dispatch({ type: 'ADD_TODO', payload: todoData });
    setShowForm(false);
  };

  const handleToggleTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const handleDeleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const handleUpdateTodo = (id: string, title: string, description: string) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, title, description } });
  };

  const handleSetFilter = (filter: 'all' | 'completed' | 'pending') => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  // Thống kê
  const totalTodos = state.todos.length;
  const completedTodos = state.todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quản lý Công việc
          </h1>
          <p className="text-gray-600">
            Tổ chức và theo dõi công việc hiệu quả
          </p>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Tổng cộng</h3>
            <p className="text-2xl font-bold text-blue-600">{totalTodos}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Hoàn thành</h3>
            <p className="text-2xl font-bold text-green-600">{completedTodos}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Chưa hoàn thành</h3>
            <p className="text-2xl font-bold text-orange-600">{pendingTodos}</p>
          </div>
        </div>

        {/* Thanh công cụ */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'pending', label: 'Chưa hoàn thành' },
                  { key: 'completed', label: 'Đã hoàn thành' }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => handleSetFilter(filter.key as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      state.filter === filter.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus size={16} />
              Thêm công việc
            </button>
          </div>
        </div>

        {/* Form thêm công việc */}
        {showForm && (
          <TodoForm
            onSubmit={handleAddTodo}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Danh sách công việc */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Filter size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">
                {state.filter === 'all' 
                  ? 'Chưa có công việc nào. Hãy thêm công việc đầu tiên!' 
                  : `Không có công việc ${state.filter === 'completed' ? 'đã hoàn thành' : 'chưa hoàn thành'}.`
                }
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onEdit={handleUpdateTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoManager;
// Lưu vào localStorage
useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(state.todos));
}, [state.todos]);

// Đọc từ localStorage
useEffect(() => {
  const saved = localStorage.getItem('todos');
  if (saved) {
    // Khôi phục dữ liệu
  }
}, []);