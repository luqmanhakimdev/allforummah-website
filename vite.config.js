import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// Serve public/admin instead of the Svelte SPA for /admin paths.
function adminStatic() {
  return {
    name: 'admin-static',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/admin' || url === '/admin/') {
          req.url = '/admin/index.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '')
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/admin' || url === '/admin/') {
          req.url = '/admin/index.html' + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '')
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), adminStatic()],
})
