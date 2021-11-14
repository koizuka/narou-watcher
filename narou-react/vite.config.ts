import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import reactRefresh from '@vitejs/plugin-react-refresh'
import { DateTime } from 'luxon';

export default defineConfig({
  build: {
    outDir: "build"
  },
  plugins: [tsconfigPaths(), reactRefresh()],
  define: {
    'process.env': process.env,
    'import.meta.env.BUILD_DATE': JSON.stringify(DateTime.now().toISO()),
  },
  server: {
    open: true
  }
});