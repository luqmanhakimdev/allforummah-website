/**
 * Cloudflare Worker: CMS API + pass-through to static assets.
 * Public: GET /api/posts, GET /api/posts/:slug
 * Protected (Bearer CMS_ADMIN_TOKEN): POST/PUT/DELETE + upload
 */

/** @typedef {{
 *   ASSETS: Fetcher,
 *   DB: D1Database,
 *   MEDIA: R2Bucket,
 *   CMS_ADMIN_TOKEN?: string,
 *   R2_PUBLIC_BASE_URL?: string,
 * }} Env */

export default {
  /**
   * @param {Request} request
   * @param {Env} env
   */
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, url);
      } catch (err) {
        console.error(err);
        return json({ error: 'Internal server error' }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};

/**
 * @param {Request} request
 * @param {Env} env
 * @param {URL} url
 */
async function handleApi(request, env, url) {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (path === '/api/health' && method === 'GET') {
    return json({ ok: true });
  }

  if (path === '/api/posts' && method === 'GET') {
    return listPosts(request, env, url);
  }

  if (path === '/api/posts' && method === 'POST') {
    if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
    return createPost(request, env);
  }

  if (path === '/api/upload' && method === 'POST') {
    if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
    return uploadMedia(request, env);
  }

  const mediaMatch = path.match(/^\/api\/media\/(.+)$/);
  if (mediaMatch && method === 'GET') {
    return serveMedia(env, decodeURIComponent(mediaMatch[1]));
  }

  const postMatch = path.match(/^\/api\/posts\/([^/]+)$/);
  if (postMatch) {
    const idOrSlug = decodeURIComponent(postMatch[1]);

    if (method === 'GET') {
      return getPost(request, env, idOrSlug);
    }
    if (method === 'PUT') {
      if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return updatePost(request, env, idOrSlug);
    }
    if (method === 'DELETE') {
      if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);
      return deletePost(env, idOrSlug);
    }
  }

  return json({ error: 'Not found' }, 404);
}

/**
 * @param {Request} request
 * @param {Env} env
 */
function isAuthorized(request, env) {
  const token = env.CMS_ADMIN_TOKEN;
  if (!token) return false;
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return Boolean(match && match[1] === token);
}

/**
 * @param {Request} request
 * @param {Env} env
 * @param {URL} url
 */
async function listPosts(request, env, url) {
  const wantAll = url.searchParams.get('all') === '1';
  const isAuthed = isAuthorized(request, env);
  const showDrafts = wantAll && isAuthed;

  const result = showDrafts
    ? await env.DB.prepare(
        `SELECT id, title, slug, date, excerpt, body, cover_url, published, created_at, updated_at
         FROM posts ORDER BY date DESC, created_at DESC`,
      ).all()
    : await env.DB.prepare(
        `SELECT id, title, slug, date, excerpt, body, cover_url, published, created_at, updated_at
         FROM posts WHERE published = 1 ORDER BY date DESC, created_at DESC`,
      ).all();

  return json(
    { posts: (result.results || []).map(normalizePost) },
    200,
    { 'Cache-Control': showDrafts ? 'no-store' : 'public, max-age=60' },
  );
}

/**
 * @param {Request} request
 * @param {Env} env
 * @param {string} idOrSlug
 */
async function getPost(request, env, idOrSlug) {
  const row = await env.DB.prepare(
    `SELECT id, title, slug, date, excerpt, body, cover_url, published, created_at, updated_at
     FROM posts WHERE id = ? OR slug = ? LIMIT 1`,
  )
    .bind(idOrSlug, idOrSlug)
    .first();

  if (!row) return json({ error: 'Not found' }, 404);

  const isAuthed = isAuthorized(request, env);
  if (!row.published && !isAuthed) return json({ error: 'Not found' }, 404);

  return json({ post: normalizePost(row) }, 200, {
    'Cache-Control': row.published ? 'public, max-age=60' : 'no-store',
  });
}

/**
 * @param {Request} request
 * @param {Env} env
 */
async function createPost(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: 'Invalid JSON' }, 400);

  const title = String(body.title || '').trim();
  const slug = slugify(body.slug || title);
  const date = String(body.date || new Date().toISOString().slice(0, 10));
  const excerpt = String(body.excerpt || '').trim();
  const content = String(body.body || '').trim();
  const cover_url = String(body.cover_url || '').trim();
  const published = body.published ? 1 : 0;

  if (!title || !slug) return json({ error: 'title and slug are required' }, 400);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  try {
    await env.DB.prepare(
      `INSERT INTO posts (id, title, slug, date, excerpt, body, cover_url, published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(id, title, slug, date, excerpt, content, cover_url, published, now, now)
      .run();
  } catch (err) {
    if (String(err?.message || err).includes('UNIQUE')) {
      return json({ error: 'slug already exists' }, 409);
    }
    throw err;
  }

  const row = await env.DB.prepare(`SELECT * FROM posts WHERE id = ?`).bind(id).first();
  return json({ post: normalizePost(row) }, 201);
}

/**
 * @param {Request} request
 * @param {Env} env
 * @param {string} idOrSlug
 */
async function updatePost(request, env, idOrSlug) {
  const existing = await env.DB.prepare(`SELECT * FROM posts WHERE id = ? OR slug = ? LIMIT 1`)
    .bind(idOrSlug, idOrSlug)
    .first();
  if (!existing) return json({ error: 'Not found' }, 404);

  const body = await readJson(request);
  if (!body) return json({ error: 'Invalid JSON' }, 400);

  const title = body.title !== undefined ? String(body.title).trim() : existing.title;
  const slug = body.slug !== undefined ? slugify(body.slug) : existing.slug;
  const date = body.date !== undefined ? String(body.date) : existing.date;
  const excerpt = body.excerpt !== undefined ? String(body.excerpt).trim() : existing.excerpt;
  const content = body.body !== undefined ? String(body.body).trim() : existing.body;
  const cover_url =
    body.cover_url !== undefined ? String(body.cover_url).trim() : existing.cover_url;
  const published =
    body.published !== undefined ? (body.published ? 1 : 0) : existing.published;
  const now = new Date().toISOString();

  if (!title || !slug) return json({ error: 'title and slug are required' }, 400);

  try {
    await env.DB.prepare(
      `UPDATE posts SET title = ?, slug = ?, date = ?, excerpt = ?, body = ?, cover_url = ?, published = ?, updated_at = ?
       WHERE id = ?`,
    )
      .bind(title, slug, date, excerpt, content, cover_url, published, now, existing.id)
      .run();
  } catch (err) {
    if (String(err?.message || err).includes('UNIQUE')) {
      return json({ error: 'slug already exists' }, 409);
    }
    throw err;
  }

  const row = await env.DB.prepare(`SELECT * FROM posts WHERE id = ?`).bind(existing.id).first();
  return json({ post: normalizePost(row) });
}

/**
 * @param {Env} env
 * @param {string} idOrSlug
 */
async function deletePost(env, idOrSlug) {
  const existing = await env.DB.prepare(`SELECT id FROM posts WHERE id = ? OR slug = ? LIMIT 1`)
    .bind(idOrSlug, idOrSlug)
    .first();
  if (!existing) return json({ error: 'Not found' }, 404);

  await env.DB.prepare(`DELETE FROM posts WHERE id = ?`).bind(existing.id).run();
  return json({ ok: true });
}

/**
 * @param {Request} request
 * @param {Env} env
 */
async function uploadMedia(request, env) {
  if (!env.MEDIA) return json({ error: 'R2 binding MEDIA not configured' }, 500);

  const form = await request.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return json({ error: 'file is required' }, 400);
  }

  const ext = extensionFor(file.type, file.name);
  const key = `cms/${crypto.randomUUID()}${ext}`;
  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  const base = (env.R2_PUBLIC_BASE_URL || '').replace(/\/+$/, '');
  const url = base ? `${base}/${key}` : new URL(`/api/media/${key}`, request.url).toString();

  return json({ key, url });
}

/**
 * @param {Env} env
 * @param {string} key
 */
async function serveMedia(env, key) {
  if (!env.MEDIA) return json({ error: 'R2 binding MEDIA not configured' }, 500);
  const object = await env.MEDIA.get(key);
  if (!object) return json({ error: 'Not found' }, 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(object.body, { headers });
}

/** @param {Request} request */
async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/** @param {string} input */
function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * @param {string} type
 * @param {string} name
 */
function extensionFor(type, name) {
  if (name && /\.[a-z0-9]+$/i.test(name)) {
    return name.slice(name.lastIndexOf('.')).toLowerCase();
  }
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return map[type] || '.bin';
}

/** @param {Record<string, unknown>} row */
function normalizePost(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    date: row.date,
    excerpt: row.excerpt,
    body: row.body,
    cover_url: row.cover_url,
    published: Boolean(row.published),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * @param {unknown} data
 * @param {number} [status]
 * @param {Record<string, string>} [extraHeaders]
 */
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(),
      ...extraHeaders,
    },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  };
}
