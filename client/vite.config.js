import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env': {
      VITE_API_URL: process.env.VITE_API_URL,
      VITE_CLOUDINARY_NAME: process.env.VITE_CLOUDINARY_NAME,
      VITE_CLOUDINARY_API_KEY: process.env.VITE_CLOUDINARY_API_KEY,
      VITE_CLOUDINARY_API_SECRET_KEY: process.env.VITE_CLOUDINARY_API_SECRET_KEY,
      VITE_CLOUDINARY_FOLDER: process.env.VITE_CLOUDINARY_FOLDER,
      VITE_CLOUDINARY_UPLOAD_PRESET: process.env.VITE_CLOUDINARY_UPLOAD_PRESET
    },
  },
})
