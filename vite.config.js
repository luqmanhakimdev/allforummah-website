import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))

/** Replace %SITE_URL% in built HTML and static SEO files. */
function siteUrlPlugin(siteUrl) {
  const origin = siteUrl.replace(/\/+$/, '')

  /** @param {string} filePath */
  function rewriteFile(filePath) {
    if (!existsSync(filePath)) return
    const raw = readFileSync(filePath, 'utf8')
    writeFileSync(filePath, raw.replaceAll('%SITE_URL%', origin))
  }

  return {
    name: 'site-url',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', origin)
    },
    closeBundle() {
      const dist = resolve(rootDir, 'dist')
      rewriteFile(resolve(dist, 'robots.txt'))
      rewriteFile(resolve(dist, 'sitemap.xml'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || 'https://allforummah.com'

  return {
    plugins: [svelte(), siteUrlPlugin(siteUrl)],
    server: {
      proxy: {
        '/api/cms': {
          target: 'https://cms.allforummah.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/cms/, '/api'),
        },
      },
    },
  }
})
