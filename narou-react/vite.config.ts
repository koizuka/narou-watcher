import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: "build"
  },
  plugins: [tsconfigPaths(), react()],
  define: {
    'import.meta.env.BUILD_DATE': JSON.stringify(new Date().toISOString()),
  },
  server: {
    open: true
  }
});