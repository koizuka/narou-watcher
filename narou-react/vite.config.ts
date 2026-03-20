import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/')) {
            return 'mui';
          }
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/swr') || id.includes('node_modules/scroll-into-view-if-needed')) {
            return 'utils';
          }
        }
      }
    }
  },
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    'import.meta.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    proxy: {
      '/narou': 'http://localhost:7676',
      '/r18': 'http://localhost:7676'
    }
  }
});