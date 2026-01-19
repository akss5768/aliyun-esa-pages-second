import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy': {
        target: '',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const targetUrl = req.headers['x-target-url']
            if (targetUrl) {
              const urlObj = new URL(targetUrl)
              proxyReq.path = urlObj.pathname + urlObj.search
              proxyReq.setHeader('Host', urlObj.host)
            }
          })
        }
      }
    }
  }
})
