import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer React et ses dépendances
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Séparer Three.js et React Three Fiber
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Séparer Framer Motion
          'framer-vendor': ['framer-motion'],
        },
      },
    },
    // Augmenter la limite de warning à 1000kB pour éviter les warnings sur les chunks vendors
    chunkSizeWarningLimit: 1000,
  },
})
