<script>
  import { onMount, tick } from 'svelte';
  import {
    getPlaylistVideo,
    LYRICS_PLACEHOLDER,
    formatLyrics,
  } from './songs.js';
  import {
    player,
    playerMount,
    closeLyricsWindow,
    closePlayer,
    finishLyricsMotion,
  } from './playerState.svelte.js';

  const MOTION_MS = 520;
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /** @type {HTMLElement | undefined} */
  let modalSlot;
  /** @type {HTMLElement | undefined} */
  let panelEl;
  /** @type {HTMLElement | undefined} */
  let backdropEl;
  /** @type {number | undefined} */
  let motionTimer;

  const open = $derived(player.lyricsOpen && player.video);
  const video = $derived(player.video);
  const entry = $derived(video ? getPlaylistVideo(video.id) : null);
  const lyrics = $derived(
    entry?.lyrics ? formatLyrics(entry.lyrics) : LYRICS_PLACEHOLDER,
  );

  /**
   * Uniform scale + center translate — avoids stretched/warped morph.
   * @param {DOMRect} from
   * @param {DOMRect} to
   */
  function flipTransform(from, to) {
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const sx = from.width / Math.max(to.width, 1);
    const sy = from.height / Math.max(to.height, 1);
    const scale = Math.min(Math.max(Math.min(sx, sy), 0.12), 0.45);
    return { dx, dy, scale };
  }

  function fallbackFromRect() {
    return new DOMRect(window.innerWidth - 280, window.innerHeight - 80, 240, 56);
  }

  /** @param {HTMLElement} panel */
  function clearMotionStyles(panel) {
    panel.style.transition = '';
    panel.style.transform = '';
    panel.style.borderRadius = '';
    panel.style.opacity = '';
    panel.style.boxShadow = '';
    panel.classList.remove('is-morphing');
  }

  function clearTimer() {
    if (motionTimer !== undefined) {
      window.clearTimeout(motionTimer);
      motionTimer = undefined;
    }
  }

  async function runExpand() {
    clearTimer();
    await tick();
    await new Promise((r) => requestAnimationFrame(r));

    const panel = panelEl;
    const bar = playerMount.miniBar;
    const backdrop = backdropEl;
    if (!panel) {
      finishLyricsMotion();
      return;
    }

    const to = panel.getBoundingClientRect();
    const from = bar?.getBoundingClientRect() ?? fallbackFromRect();
    const { dx, dy, scale } = flipTransform(from, to);

    panel.classList.add('is-morphing');
    panel.style.transition = 'none';
    panel.style.transformOrigin = 'center center';
    panel.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
    panel.style.borderRadius = '0.75rem';
    panel.style.opacity = '0.92';
    panel.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.4)';
    if (backdrop) {
      backdrop.style.transition = 'none';
      backdrop.style.opacity = '0';
    }

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    panel.style.transition = [
      `transform ${MOTION_MS}ms ${EASE}`,
      `border-radius ${MOTION_MS}ms ${EASE}`,
      `opacity ${MOTION_MS * 0.55}ms ease`,
      `box-shadow ${MOTION_MS}ms ${EASE}`,
    ].join(', ');
    panel.style.transform = 'translate3d(0, 0, 0) scale(1)';
    panel.style.borderRadius = '1rem';
    panel.style.opacity = '1';
    panel.style.boxShadow = '0 28px 80px rgba(0, 0, 0, 0.65)';

    if (backdrop) {
      backdrop.style.transition = `opacity ${MOTION_MS}ms ease`;
      backdrop.style.opacity = '1';
    }

    motionTimer = window.setTimeout(() => {
      clearMotionStyles(panel);
      if (backdrop) {
        backdrop.style.transition = '';
        backdrop.style.opacity = '';
      }
      finishLyricsMotion();
    }, MOTION_MS);
  }

  async function runCollapse() {
    clearTimer();
    await tick();

    const panel = panelEl;
    const bar = playerMount.miniBar;
    const backdrop = backdropEl;
    if (!panel) {
      finishLyricsMotion();
      return;
    }

    const to = panel.getBoundingClientRect();
    const from = bar?.getBoundingClientRect() ?? fallbackFromRect();
    const { dx, dy, scale } = flipTransform(from, to);

    panel.classList.add('is-morphing');
    panel.style.transition = 'none';
    panel.style.transformOrigin = 'center center';
    panel.style.transform = 'translate3d(0, 0, 0) scale(1)';
    panel.style.borderRadius = '1rem';
    panel.style.opacity = '1';

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    panel.style.transition = [
      `transform ${MOTION_MS}ms ${EASE}`,
      `border-radius ${MOTION_MS}ms ${EASE}`,
      `opacity ${MOTION_MS * 0.7}ms ease ${MOTION_MS * 0.15}ms`,
      `box-shadow ${MOTION_MS}ms ${EASE}`,
    ].join(', ');
    panel.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
    panel.style.borderRadius = '0.75rem';
    panel.style.opacity = '0';
    panel.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.4)';

    if (backdrop) {
      backdrop.style.transition = `opacity ${MOTION_MS * 0.55}ms ease`;
      backdrop.style.opacity = '0';
    }

    motionTimer = window.setTimeout(() => {
      clearMotionStyles(panel);
      if (backdrop) {
        backdrop.style.transition = '';
        backdrop.style.opacity = '';
      }
      finishLyricsMotion();
    }, MOTION_MS);
  }

  $effect(() => {
    if (!open) {
      playerMount.modalSlot = null;
      return;
    }

    let cancelled = false;
    tick().then(() => {
      if (!cancelled) playerMount.modalSlot = modalSlot ?? null;
    });

    return () => {
      cancelled = true;
      if (playerMount.modalSlot === modalSlot) {
        playerMount.modalSlot = null;
      }
    };
  });

  $effect(() => {
    const motion = player.lyricsMotion;
    if (!open || !motion) return;

    if (motion === 'expand') runExpand();
    if (motion === 'collapse') runCollapse();

    return () => clearTimer();
  });

  onMount(() => {
    /** @param {KeyboardEvent} event */
    function onKey(event) {
      if (event.key === 'Escape' && player.lyricsOpen) closeLyricsWindow();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('lyrics-window-open', Boolean(open));
    return () => document.body.classList.remove('lyrics-window-open');
  });
</script>

{#if open && video}
  <div
    class="lyrics-modal"
    class:is-expanding={player.lyricsMotion === 'expand'}
    class:is-collapsing={player.lyricsMotion === 'collapse'}
    role="presentation"
  >
    <button
      type="button"
      class="lyrics-modal-backdrop"
      bind:this={backdropEl}
      aria-label="Minimize player"
      onclick={closeLyricsWindow}
    ></button>

    <div
      class="lyrics-modal-panel"
      bind:this={panelEl}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lyrics-modal-heading"
    >
      <header class="lyrics-modal-header">
        <div class="lyrics-modal-heading-wrap">
          <p class="lyrics-modal-label">Now playing</p>
          <h2 id="lyrics-modal-heading" class="lyrics-modal-title">{video.title}</h2>
          <p class="lyrics-modal-artist">All For Ummah</p>
        </div>
        <div class="lyrics-modal-actions">
          <button
            type="button"
            class="lyrics-modal-btn"
            onclick={closeLyricsWindow}
            aria-label="Minimize to mini player"
            title="Minimize"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="M5 12h14" stroke-linecap="round" />
            </svg>
          </button>
          <button
            type="button"
            class="lyrics-modal-btn"
            onclick={closePlayer}
            aria-label="Close player"
            title="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div class="lyrics-modal-media" bind:this={modalSlot}></div>

      <div class="lyrics-modal-body">
        <div class="lyrics-modal-scroll">
          <p class="lyrics-modal-lyrics-label">Lyrics</p>
          <pre class="lyrics-modal-text">{lyrics}</pre>
        </div>
      </div>
    </div>
  </div>
{/if}
