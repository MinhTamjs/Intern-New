import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import TodoApp from './features/todo/TodoApp';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App min-h-screen bg-gray-50">
        <TodoApp />
      </div>
    </Provider>
  );
}

export default App;
