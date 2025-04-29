import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Use VITE_BACKEND_URL from .env file, or default to http://localhost:5001 for development
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:5001';

  console.log(`Using backend URL: ${backendUrl}`);

  return {
    plugins: [react()],
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      }
    },
    // Add base URL for production deployment
    base: '/',
  };
});
