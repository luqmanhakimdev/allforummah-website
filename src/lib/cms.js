/** CMS client for All For Ummah blog content. */

export const CMS_ORIGIN = 'https://cms.allforummah.com';

/** Browser-side API base (proxied in dev and production to avoid CORS). */
const API_BASE = '/api/cms';

/**
 * @typedef {{
 *   title?: string,
 *   slug?: string,
 *   content?: string,
 *   author?: string,
 *   publishedAt?: string,
 *   excerpt?: string,
 *   featuredImage?: string,
 *   gallery?: unknown[],
 * }} BlogPostFields
 */

/**
 * @typedef {{
 *   id: string,
 *   title: string,
 *   slug: string,
 *   status: string,
 *   collectionId: string,
 *   data: BlogPostFields,
 *   created_at?: number,
 *   updated_at?: number,
 * }} CmsEntry
 */

/**
 * Resolve a CMS file path or absolute URL to an absolute image URL.
 * @param {string | null | undefined} path
 */
export function cmsAssetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${CMS_ORIGIN}${normalized}`;
}

/**
 * @param {BlogPostFields | undefined} fields
 * @param {string} [fallback]
 */
export function excerptFrom(fields, fallback = '') {
  const explicit = fields?.excerpt?.trim();
  if (explicit) return explicit;

  const text = (fields?.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return fallback;
  return text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text;
}

/**
 * @param {string | undefined} publishedAt
 * @param {number | undefined} createdAt
 */
export function formatPostDate(publishedAt, createdAt) {
  const raw = publishedAt || (createdAt ? new Date(createdAt).toISOString() : '');
  if (!raw) return '';

  const date = new Date(raw.includes('T') && raw.length <= 16 ? `${raw}:00` : raw);
  if (Number.isNaN(date.getTime())) return publishedAt || '';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * @param {string} pathWithQuery e.g. `/content?collectionId=blog_post`
 * @returns {Promise<unknown>}
 */
async function cmsFetch(pathWithQuery) {
  const res = await fetch(`${API_BASE}${pathWithQuery}`);
  if (!res.ok) {
    throw new Error(`CMS request failed (${res.status})`);
  }
  return res.json();
}

/**
 * @returns {Promise<CmsEntry[]>}
 */
export async function listBlogPosts() {
  const json = /** @type {{ data?: CmsEntry[] }} */ (
    await cmsFetch('/content?collectionId=blog_post')
  );
  const rows = Array.isArray(json.data) ? json.data : [];
  return rows.filter((entry) => entry.status === 'published');
}

/**
 * @param {string} id
 * @returns {Promise<CmsEntry | null>}
 */
export async function getBlogPostById(id) {
  const json = /** @type {{ data?: CmsEntry }} */ (
    await cmsFetch(`/content/${encodeURIComponent(id)}`)
  );
  const entry = json.data;
  if (!entry || entry.status !== 'published') return null;
  return entry;
}

/**
 * Resolve a published post by slug, falling back to id when needed.
 * @param {string} slugOrId
 * @returns {Promise<CmsEntry | null>}
 */
export async function getBlogPost(slugOrId) {
  const key = decodeURIComponent(slugOrId).trim();
  if (!key) return null;

  const posts = await listBlogPosts();
  const bySlug = posts.find((post) => post.slug === key || post.data?.slug === key);
  if (bySlug) {
    if (bySlug.data?.content) return bySlug;
    return getBlogPostById(bySlug.id);
  }

  const byId = posts.find((post) => post.id === key);
  if (byId) {
    if (byId.data?.content) return byId;
    return getBlogPostById(byId.id);
  }

  return getBlogPostById(key);
}
