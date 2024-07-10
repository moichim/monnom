import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],
  build: {
    outDir: "../monnom/game",
    emptyOutDir: true,
    // minify: true,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]"
      }
    }
  }
})
