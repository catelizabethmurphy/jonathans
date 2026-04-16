import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/328T628T-starter-repo/',
  plugins: [vue()],
  build: {
    outDir: 'docs'
  }
})