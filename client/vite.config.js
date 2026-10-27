import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 前后端分离：前端 dev/preview 监听 8007，/api 统一代理到后端 3007
const proxy = {
    '/api': {
        target: 'http://localhost:3007',
        changeOrigin: true,
    },
};
export default defineConfig({
    plugins: [react()],
    server: {
        port: 8007,
        proxy,
    },
    preview: {
        port: 8007,
        proxy,
    },
});
