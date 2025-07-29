export const API_BASE_URL = 'https://6881dc8866a7eb81224c5612.mockapi.io/'; // 🔁 Thay thế bằng URL thật

// (optional) export thêm sẵn axios instance nếu cần:
import axios from 'axios';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
