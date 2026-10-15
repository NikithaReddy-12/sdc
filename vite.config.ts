import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/')
          if (norm.includes('/node_modules/three/')) {
            return 'three-core'
          }
          if (norm.includes('/node_modules/@react-three/')) {
            return 'react-three'
          }
          if (norm.includes('/node_modules/gsap/')) {
            return 'vendor-gsap'
          }
          if (norm.includes('/node_modules/framer-motion/')) {
            return 'vendor-framer'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
})
