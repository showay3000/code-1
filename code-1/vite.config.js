import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/code-1/",
  plugins: [react()],
  server: {
    historyApiFallback: true
  }
})
