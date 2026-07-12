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
  /** @type {HTMLElement | undefined} */
  let titleWrapEl;
  /** @type {HTMLElement | undefined} */
  let titleEl;

  let titleOverflows = $state(false);
  let titleScrolling = $state(false);
  let marqueeOffset = $state(0);
  let marqueeDuration = $state(8);
  let marqueeIterations = $state(2);

  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let marqueeRestartTimer;

  const open = $derived(player.open && player.video);
  const video = $derived(player.video);
  const expanded = $derived(player.expanded);

  function prefersReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function hasFineHover() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  }

  function measureTitle() {
    if (!titleWrapEl || !titleEl) {
      titleOverflows = false;
      titleScrolling = false;
      marqueeOffset = 0;
      return;
    }

    const overflow = titleEl.scrollWidth - titleWrapEl.clientWidth;
    if (overflow > 1) {
      titleOverflows = true;
      marqueeOffset = overflow;
      marqueeDuration = Math.max(7, Math.min(16, 5 + overflow / 28));
    } else {
      titleOverflows = false;
      titleScrolling = false;
      marqueeOffset = 0;
    }
  }

  /** @param {number} [iterations] */
  function startTitleMarquee(iterations = 2) {
    if (!titleOverflows || prefersReducedMotion()) return;

    marqueeIterations = iterations;
    titleScrolling = false;
    clearTimeout(marqueeRestartTimer);
    // Retrigger CSS animation by toggling the class off → on
    marqueeRestartTimer = setTimeout(() => {
      if (!titleOverflows || prefersReducedMotion()) return;
      titleScrolling = true;
    }, 20);
  }

  /** @param {AnimationEvent} event */
  function onTitleAnimationEnd(event) {
    if (event.animationName !== 'ytm-title-marquee') return;
    titleScrolling = false;
  }

  function onTitleMouseEnter() {
    if (!hasFineHover()) return;
    if (!titleOverflows || titleScrolling) return;
    startTitleMarquee(1);
  }

  function onTitleFocus() {
    if (!titleOverflows || titleScrolling) return;
    startTitleMarquee(1);
  }

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

  $effect(() => {
    // New track: measure, then run a short intro marquee if truncated
    void video?.title;
    const frame = requestAnimationFrame(() => {
      measureTitle();
      if (titleOverflows) startTitleMarquee(2);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(marqueeRestartTimer);
    };
  });

  $effect(() => {
    if (!titleWrapEl || !titleEl) return;

    const observer = new ResizeObserver(() => measureTitle());
    observer.observe(titleWrapEl);
    observer.observe(titleEl);
    measureTitle();

    return () => observer.disconnect();
  });

  onMount(() => {
    /** @param {KeyboardEvent} event */
    function onKey(event) {
      if (event.key === 'Escape' && player.expanded) collapsePlayer();
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', measureTitle);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', measureTitle);
      clearTimeout(marqueeRestartTimer);
    };
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
        onmouseenter={onTitleMouseEnter}
        onfocus={onTitleFocus}
        aria-label="Open lyrics for {video.title}"
      >
        <img
          class="ytm-bar-art"
          src="https://i.ytimg.com/vi/{video.id}/hqdefault.jpg"
          alt=""
        />
        <span class="ytm-bar-text">
          <span
            class="ytm-bar-title-wrap"
            class:is-overflowing={titleOverflows}
            class:is-scrolling={titleScrolling}
            bind:this={titleWrapEl}
          >
            <span
              class="ytm-bar-title"
              class:is-scrolling={titleScrolling}
              style:--marquee-offset="-{marqueeOffset}px"
              style:--marquee-duration="{marqueeDuration}s"
              style:--marquee-iterations={marqueeIterations}
              bind:this={titleEl}
              onanimationend={onTitleAnimationEnd}
            >{video.title}</span>
          </span>
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
