import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { fileURLToPath } from 'url'
import process from 'process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
   base: process.env.NODE_ENV === "production" ? "/f8-fullstack-btvnday41" : "/",
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})