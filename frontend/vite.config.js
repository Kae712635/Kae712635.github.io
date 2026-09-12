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
          // React core dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Three.js, React Three Fiber & 3D ecosystem
          'three-vendor': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
            'postprocessing',
            'maath',
            '@react-spring/web'
          ],
          // Framer Motion
          'framer-vendor': ['framer-motion'],
        },
      },
    },
    // Augmenter la limite de warning à 1000kB pour éviter les warnings sur les chunks vendors
    chunkSizeWarningLimit: 1000,
  },
})
