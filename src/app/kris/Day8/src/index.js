// src/index.js (ví dụ với React)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Nếu có file CSS
import App from './App';
import { store } from './app/store'; // Import store của bạn
import { Provider } from 'react-redux'; // Import Provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}> {/* Bọc ứng dụng với Provider */}
            <App />
        </Provider>
    </React.StrictMode>
);