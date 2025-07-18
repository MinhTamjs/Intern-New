// src/App.js (Ví dụ cơ bản)
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, addTodo, updateExistingTodo, deleteExistingTodo } from './features/tasks/todosSlice';

function App() {
    const dispatch = useDispatch();
    // Lấy dữ liệu từ Redux store
    const { items: todos, isLoading, error } = useSelector((state) => state.todos);

    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');

    // --- Lấy dữ liệu khi component được mount ---
    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    // --- Xử lý thêm Task ---
    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodoTitle.trim() && newTodoDescription.trim()) {
            dispatch(addTodo({ title: newTodoTitle, description: newTodoDescription, completed: false }));
            setNewTodoTitle('');
            setNewTodoDescription('');
        } else {
            alert('Title and Description cannot be empty!');
        }
    };

    // --- Xử lý cập nhật trạng thái Task (toggle completed) ---
    const handleToggleComplete = (todo) => {
        dispatch(updateExistingTodo({
            todoId: todo._id,
            updatedData: { ...todo, completed: !todo.completed }
        }));
    };

    // --- Xử lý xóa Task ---
    const handleDeleteTodo = (todoId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            dispatch(deleteExistingTodo(todoId));
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Task Management with Redux</h1>

            {/* Form thêm Task */}
            <form onSubmit={handleAddTodo} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                <h2>Add New Task</h2>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    style={{ marginRight: '10px', padding: '8px', width: '200px' }}
                    required
                />
                <input
                    type="text"
                    placeholder="Task Description"
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    style={{ marginRight: '10px', padding: '8px', width: '250px' }}
                    required
                />
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>Add Task</button>
            </form>

            {/* Hiển thị trạng thái */}
            {isLoading && <p style={{ color: '#007bff' }}>Loading tasks...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {/* Hiển thị danh sách Tasks */}
            <h2>My Tasks</h2>
            {todos.length === 0 && !isLoading && !error && <p>No tasks found.</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {todos.map((todo) => (
                    <li key={todo._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        borderBottom: '1px dashed #eee',
                        backgroundColor: todo.completed ? '#e0ffe0' : 'white',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                    }}>
                        <div>
                            <strong>{todo.title}</strong>
                            <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>{todo.description}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleToggleComplete(todo)}
                                style={{
                                    marginRight: '10px',
                                    padding: '5px 10px',
                                    backgroundColor: todo.completed ? '#28a745' : '#ffc107',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                            </button>
                            <button
                                onClick={() => handleDeleteTodo(todo._id)}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;