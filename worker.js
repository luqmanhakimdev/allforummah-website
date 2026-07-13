/** Proxies CMS reads and otherwise serves the SPA static assets. */

const CMS_ORIGIN = 'https://cms.allforummah.com';

/**
 * @param {Request} request
 * @param {URL} url
 */
async function proxyCms(request, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }

  const targetPath = `${url.pathname.replace(/^\/api\/cms/, '/api')}${url.search}`;
  const target = new URL(targetPath, CMS_ORIGIN);

  const upstream = await fetch(target, {
    method: request.method,
    headers: {
      Accept: request.headers.get('Accept') || 'application/json',
    },
    redirect: 'follow',
  });

  const headers = new Headers(upstream.headers);
  headers.delete('set-cookie');
  headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch: typeof fetch } }} env
   */
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/cms/')) {
      return proxyCms(request, url);
    }

    return env.ASSETS.fetch(request);
  },
};
