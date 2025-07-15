// Nếu gặp lỗi linter do thiếu plugin, hãy chạy: npm install -D @vitejs/plugin-react
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
}); 