import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // Use Vercel env vars directly
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
  const NODE_ENV = process.env.NODE_ENV || 'development';
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_BASE_URL': JSON.stringify(API_BASE_URL),
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }
  };
});
