<script>
  import { onMount } from 'svelte';
  import {
    player,
    playerMount,
    togglePlay,
    collapsePlayer,
    closePlayer,
    openLyricsWindow,
  } from './playerState.svelte.js';

  /** @type {HTMLElement | undefined} */
  let barEl;

  const open = $derived(player.open && player.video);
  const video = $derived(player.video);
  const expanded = $derived(player.expanded);

  $effect(() => {
    playerMount.miniBar = barEl ?? null;
    return () => {
      if (playerMount.miniBar === barEl) playerMount.miniBar = null;
    };
  });

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('player-expanded', Boolean(open && expanded));
    document.body.classList.toggle('has-mini-player', Boolean(open));
    return () => {
      document.body.classList.remove('player-expanded');
      document.body.classList.remove('has-mini-player');
    };
  });

  onMount(() => {
    /** @param {KeyboardEvent} event */
    function onKey(event) {
      if (event.key === 'Escape' && player.expanded) collapsePlayer();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /** @param {MouseEvent} event */
  function onBarClick(event) {
    const target = /** @type {HTMLElement} */ (event.target);
    if (target.closest('[data-player-control]')) return;
    if (!video) return;
    openLyricsWindow();
  }
</script>

{#if open && video}
  <div class="ytm-player" class:is-expanded={expanded} class:is-playing={player.playing}>
    <div class="ytm-sheet-backdrop" onclick={collapsePlayer} aria-hidden={!expanded}></div>

    <div
      class="ytm-sheet"
      role="dialog"
      aria-label="Now playing"
      aria-modal="true"
      inert={!expanded}
    >
      <button
        type="button"
        class="ytm-sheet-handle"
        onclick={collapsePlayer}
        aria-label="Collapse player"
      >
        <span></span>
      </button>

      <div class="ytm-sheet-art ytm-sheet-art-empty" aria-hidden="true"></div>

      <div class="ytm-sheet-meta">
        <h2 class="ytm-sheet-title">{video.title}</h2>
        <p class="ytm-sheet-artist">All For Ummah</p>
      </div>

      <div class="ytm-sheet-controls">
        <button
          type="button"
          class="ytm-control ytm-control-main"
          data-player-control
          onclick={togglePlay}
          aria-label={player.playing ? 'Pause' : 'Play'}
        >
          {#if player.playing}
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          {/if}
        </button>
      </div>

      <button type="button" class="ytm-sheet-lyrics" onclick={openLyricsWindow}>
        View lyrics
      </button>
    </div>

    <div
      class="ytm-bar"
      class:is-hidden={expanded}
      class:is-away={player.lyricsOpen && player.lyricsMotion !== 'collapse'}
      class:is-returning={player.lyricsMotion === 'collapse'}
      bind:this={barEl}
    >
      <button
        type="button"
        class="ytm-bar-main"
        onclick={onBarClick}
        aria-label="Open lyrics for {video.title}"
      >
        <img
          class="ytm-bar-art"
          src="https://i.ytimg.com/vi/{video.id}/hqdefault.jpg"
          alt=""
        />
        <span class="ytm-bar-text">
          <span class="ytm-bar-title">{video.title}</span>
          <span class="ytm-bar-hint">Lyrics available</span>
        </span>
      </button>

      <div class="ytm-bar-actions">
        <button
          type="button"
          class="ytm-control"
          data-player-control
          onclick={togglePlay}
          aria-label={player.playing ? 'Pause' : 'Play'}
        >
          {#if player.playing}
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          {:else}
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          {/if}
        </button>
        <button
          type="button"
          class="ytm-control"
          data-player-control
          onclick={closePlayer}
          aria-label="Close player"
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
    </div>
  </div>
{/if}
