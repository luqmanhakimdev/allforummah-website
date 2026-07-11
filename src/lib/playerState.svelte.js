/** @typedef {{ id: string, title: string }} PlayerVideo */

/** @typedef {'expand' | 'collapse' | null} LyricsMotion */

/** @type {{ video: PlayerVideo | null, open: boolean, playing: boolean, expanded: boolean, lyricsOpen: boolean, lyricsMotion: LyricsMotion, nonce: number }} */
export const player = $state({
  video: null,
  open: false,
  playing: false,
  expanded: false,
  lyricsOpen: false,
  lyricsMotion: null,
  nonce: 0,
});

/** @type {{ modalSlot: HTMLElement | null, miniBar: HTMLElement | null }} */
export const playerMount = $state({
  modalSlot: null,
  miniBar: null,
});

/** @param {PlayerVideo} video @param {{ expand?: boolean, openLyrics?: boolean }} [opts] */
export function playSong(video, opts = {}) {
  const expand = opts.expand ?? false;
  const openLyrics = opts.openLyrics ?? false;
  const switching = player.video?.id !== video.id;
  player.video = { id: video.id, title: video.title };
  player.open = true;
  player.playing = true;
  player.expanded = expand;
  if (openLyrics) {
    player.lyricsOpen = true;
    player.lyricsMotion = 'expand';
  } else if (switching) {
    player.lyricsOpen = false;
    player.lyricsMotion = null;
  }
  if (switching) player.nonce += 1;
}

export function togglePlay() {
  if (!player.open || !player.video) return;
  player.playing = !player.playing;
}

export function expandPlayer() {
  if (!player.open) return;
  player.expanded = true;
}

export function collapsePlayer() {
  player.expanded = false;
}

export function openLyricsWindow() {
  if (!player.open || !player.video || player.lyricsOpen) return;
  player.lyricsOpen = true;
  player.lyricsMotion = 'expand';
}

export function closeLyricsWindow() {
  if (!player.lyricsOpen) return;
  if (player.lyricsMotion === 'collapse') return;
  player.lyricsMotion = 'collapse';
}

/** Call after expand/collapse animation finishes. */
export function finishLyricsMotion() {
  if (player.lyricsMotion === 'collapse') {
    player.lyricsOpen = false;
  }
  player.lyricsMotion = null;
}

export function closePlayer() {
  player.open = false;
  player.playing = false;
  player.expanded = false;
  player.lyricsOpen = false;
  player.lyricsMotion = null;
  player.video = null;
  playerMount.modalSlot = null;
}

/** @param {string} href */
export function navigate(href) {
  if (typeof window === 'undefined') return;
  const url = new URL(href, window.location.origin);
  if (url.origin !== window.location.origin) {
    window.location.href = href;
    return;
  }
  history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
