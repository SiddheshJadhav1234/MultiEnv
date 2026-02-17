import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  const env = process.env.NODE_ENV || 'development';
  const envDir = path.resolve(__dirname, '..');
  const envPath = path.resolve(envDir, `.env.${env}`);
  
  // Load env from root directory (for local dev)
  const envVars = dotenv.config({ path: envPath }).parsed || {};
  
  // Use Vercel env vars if available, otherwise use local .env
  const API_BASE_URL = process.env.API_BASE_URL || envVars.API_BASE_URL;
  const CLIENT_URL = process.env.CLIENT_URL || envVars.CLIENT_URL;
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_BASE_URL': JSON.stringify(API_BASE_URL),
      'process.env.CLIENT_URL': JSON.stringify(CLIENT_URL),
      'process.env.NODE_ENV': JSON.stringify(env)
    },
    server: {
      port: parseInt(CLIENT_URL?.split(':')[2]) || 5173
    }
  };
});
