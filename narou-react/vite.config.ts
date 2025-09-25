import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/system', '@emotion/react', '@emotion/styled'],
          utils: ['date-fns', 'swr', 'scroll-into-view-if-needed']
        }
      }
    }
  },
  plugins: [tsconfigPaths(), react()],
  define: {
    'import.meta.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
  },
  server: {
    open: true
  }
});