import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import TodoApp from './features/todo/TodoApp';

/**
 * App gốc: bọc toàn bộ ứng dụng với Redux Provider và render TodoApp.
 */
const App: React.FC = () => (
  <Provider store={store}>
    <TodoApp />
  </Provider>
);

export default App; 