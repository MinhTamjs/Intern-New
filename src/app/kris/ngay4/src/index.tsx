import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Điểm vào ứng dụng: render App vào phần tử #root trong index.html
const root = createRoot(document.getElementById('root')!);
root.render(<App />); 