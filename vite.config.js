import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:7777', // or your backend server
    },
  },
})


/**
 * export default defineConfig({
  // other config
  server: {
    proxy: {
      '/auth': 'http://localhost:7777', // or your backend server
    },
  },
});
location /auth/ {
    proxy_pass http://localhost:7777;  # or your backend host
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
 */

/**
 * server {
  server_name codeconnect.shop;

  location /auth/ {
    proxy_pass http://localhost:7777;  # backend Express server
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location / {
    root /var/www/codeconnect-frontend;  # your React build
    index index.html;
    try_files $uri /index.html;
  }
}

 */