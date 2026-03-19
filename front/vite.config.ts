import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: false // silencia os avisos de dependências
      }
    }
  },
  server: {
    https: {
      key: fs.existsSync('./certs/localhost-key.pem')
        ? fs.readFileSync('./certs/localhost-key.pem')
        : undefined,
      cert: fs.existsSync('./certs/localhost.pem')
        ? fs.readFileSync('./certs/localhost.pem')
        : undefined,
    },
    host: true, // Permite conexões externas
    port: 5173,
    watch: {
      usePolling: true,
      interval: 2000,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.vscode/**',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/tmp/**',
        '**/*.log'
      ]
    },
    fs: {
      strict: false
    }
  },
  preview: {
    https: {
      key: fs.existsSync('./certs/localhost-key.pem')
        ? fs.readFileSync('./certs/localhost-key.pem')
        : undefined,
      cert: fs.existsSync('./certs/localhost.pem')
        ? fs.readFileSync('./certs/localhost.pem')
        : undefined,
    },
    host: true,
    port: 4173,
  }
})