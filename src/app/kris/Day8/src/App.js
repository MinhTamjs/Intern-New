// src/App.js (Ví dụ cơ bản)
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodos, createTodo, editTodo, removeTodo } from './todos/todosSlice';

export default function App() {
  return <h1 style={{color: 'red'}}>Hello React!</h1>;
}
