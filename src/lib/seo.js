import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
  getSiteOrigin,
} from './site.js';

/**
 * @param {string} name
 * @param {string} content
 * @param {'name' | 'property'} [attr]
 */
function upsertMeta(name, content, attr = 'name') {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** @param {string} href */
function upsertCanonical(href) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Update document title and social/meta tags for the current route.
 * Call on initial mount and whenever the client-side path changes.
 *
 * @param {{
 *   title?: string,
 *   description?: string,
 *   path?: string,
 *   image?: string,
 *   type?: string,
 * }} opts
 */
export function setPageMeta(opts = {}) {
  const title = opts.title ? `${opts.title} · ${SITE_NAME}` : SITE_NAME;
  const description = opts.description ?? DEFAULT_DESCRIPTION;
  const path = opts.path ?? '/';
  const url = absoluteUrl(path);
  const imagePath = opts.image ?? '/concert.jpg';
  const image = imagePath.startsWith('http')
    ? imagePath
    : absoluteUrl(imagePath);
  const type = opts.type ?? 'website';
  const origin = getSiteOrigin();

  document.title = opts.title ? title : `${SITE_NAME} — Sebuah Perjalanan`;

  upsertMeta('description', description);
  upsertCanonical(url);

  upsertMeta('og:type', type, 'property');
  upsertMeta('og:site_name', SITE_NAME, 'property');
  upsertMeta('og:title', document.title, 'property');
  upsertMeta('og:description', description, 'property');
  upsertMeta('og:url', url, 'property');
  if (image) upsertMeta('og:image', image, 'property');
  if (origin) upsertMeta('og:image:alt', `${SITE_NAME} — Sebuah Perjalanan`, 'property');

  upsertMeta('twitter:card', 'summary_large_image');
  upsertMeta('twitter:title', document.title);
  upsertMeta('twitter:description', description);
  if (image) upsertMeta('twitter:image', image);
}
