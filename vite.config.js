import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_FOOTBALL_DATA_API_KEY || env.FOOTBALL_DATA_API_KEY || '';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        // Proxy requests from /api/football to the Football-Data.org API
        // This avoids browser CORS errors and securely attaches the API key
        '/api/football': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/football/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // Priority: Header sent from frontend UI config > .env API Key
              const headerToken = req.headers['x-custom-auth-token'];
              const token = headerToken || apiKey;

              if (token) {
                proxyReq.setHeader('X-Auth-Token', token);
              }
            });
          }
        }
      }
    }
  };
});
