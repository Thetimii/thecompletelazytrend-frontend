import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Plugin to copy blog HTML files to dist
const copyBlogFiles = () => {
  return {
    name: 'copy-blog-files',
    writeBundle() {
      const blogFiles = readdirSync('.').filter(file => file.startsWith('blog-') && file.endsWith('.html'));
      blogFiles.forEach(file => {
        copyFileSync(file, join('dist', file));
        console.log(`Copied ${file} to dist/`);
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Use VITE_BACKEND_URL from .env file, or default to http://localhost:5001 for development
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:5001';

  console.log(`Using backend URL: ${backendUrl}`);

  return {
    plugins: [react(), copyBlogFiles()],
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
    // Configure build options
    build: {
      // Generate the _redirects file for SPA routing
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  };
});
