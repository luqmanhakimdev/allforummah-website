/** Site-wide SEO and branding constants. */

export const SITE_NAME = 'All For Ummah';

export const SITE_TAGLINE = 'Sebuah Perjalanan';

export const DEFAULT_DESCRIPTION =
  'All For Ummah is a Malaysian nasyid group. Listen to songs, watch performances, and follow the journey — Sebuah Perjalanan.';

export const SOCIAL_PROFILES = [
  'https://www.facebook.com/AFUmusic',
  'https://www.instagram.com/allforummahofficial/',
  'https://www.tiktok.com/@allforummah',
  'https://www.youtube.com/@AllForUmmah',
];

/** Production canonical origin. Override with `VITE_SITE_URL` if needed. */
export const DEFAULT_SITE_URL = 'https://allforummah.com';

/**
 * Canonical origin for absolute SEO URLs.
 * Prefers `VITE_SITE_URL`, then the production domain, then the browser origin.
 */
export function getSiteOrigin() {
  const fromEnv = import.meta.env.VITE_SITE_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.replace(/\/+$/, '');
  }
  return DEFAULT_SITE_URL;
}

/** @param {string} pathname */
export function absoluteUrl(pathname = '/') {
  const origin = getSiteOrigin();
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return origin ? `${origin}${path}` : path;
}
