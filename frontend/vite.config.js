import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  const env = process.env.NODE_ENV || 'development';
  const envDir = path.resolve(__dirname, '..');
  const envPath = path.resolve(envDir, `.env.${env}`);
  
  // Load env from root directory
  const envVars = dotenv.config({ path: envPath }).parsed || {};
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_BASE_URL': JSON.stringify(envVars.API_BASE_URL),
      'process.env.CLIENT_URL': JSON.stringify(envVars.CLIENT_URL),
      'process.env.NODE_ENV': JSON.stringify(env)
    },
    server: {
      port: parseInt(envVars.CLIENT_URL?.split(':')[2]) || 5173
    }
  };
});
