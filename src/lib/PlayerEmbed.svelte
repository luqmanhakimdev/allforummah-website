<script>
  import { player, playerMount } from './playerState.svelte.js';

  /** @type {HTMLIFrameElement | undefined} */
  let iframeEl;
  /** @type {HTMLElement | undefined} */
  let hostEl;

  const open = $derived(player.open && player.video);
  const video = $derived(player.video);
  const inModal = $derived(
    Boolean(player.lyricsOpen && playerMount.modalSlot && !player.lyricsMotion),
  );

  let lastPlaying = /** @type {boolean | null} */ (null);

  $effect(() => {
    const playing = player.playing;
    const el = iframeEl;
    if (!el || !video) return;

    if (lastPlaying === null) {
      lastPlaying = playing;
      return;
    }
    if (lastPlaying === playing) return;
    lastPlaying = playing;

    const id = setTimeout(() => {
      el.contentWindow?.postMessage(
        JSON.stringify({
          event: 'command',
          func: playing ? 'playVideo' : 'pauseVideo',
          args: [],
        }),
        '*',
      );
    }, 120);
    return () => clearTimeout(id);
  });

  $effect(() => {
    void player.nonce;
    lastPlaying = null;
  });

  /**
   * @param {HTMLElement} host
   * @param {DOMRect} rect
   */
  function place(host, rect) {
    host.style.transition = 'opacity 0.28s ease';
    host.style.top = `${Math.round(rect.top)}px`;
    host.style.left = `${Math.round(rect.left)}px`;
    host.style.width = `${Math.round(rect.width)}px`;
    host.style.height = `${Math.round(rect.height)}px`;
    host.style.opacity = '1';
    host.style.pointerEvents = 'auto';
    host.style.zIndex = '160';
    host.style.borderRadius = '0';
  }

  /** @param {HTMLElement} host */
  function park(host) {
    host.style.transition = 'none';
    host.style.top = '-10000px';
    host.style.left = '-10000px';
    host.style.width = '640px';
    host.style.height = '360px';
    host.style.opacity = '0';
    host.style.pointerEvents = 'none';
    host.style.zIndex = '1';
    host.style.borderRadius = '0';
  }

  $effect(() => {
    const host = hostEl;
    const slot = playerMount.modalSlot;
    const lyricsOpen = player.lyricsOpen;
    const motion = player.lyricsMotion;

    if (!host) return;

    /** @type {number[]} */
    const timers = [];

    // Keep embed parked while morphing so panel motion stays smooth.
    if (!lyricsOpen || !slot || motion) {
      if (motion === 'collapse' && slot) {
        host.style.transition = 'opacity 0.18s ease';
        host.style.opacity = '0';
        timers.push(window.setTimeout(() => park(host), 180));
      } else {
        park(host);
      }

      return () => {
        for (const id of timers) window.clearTimeout(id);
      };
    }

    const rect = slot.getBoundingClientRect();
    if (rect.width >= 2 && rect.height >= 2) {
      host.style.opacity = '0';
      place(host, rect);
      // Soft fade-in after modal settles.
      requestAnimationFrame(() => {
        host.style.opacity = '1';
      });
    }

    const onResize = () => {
      if (player.lyricsMotion || !playerMount.modalSlot) return;
      const next = playerMount.modalSlot.getBoundingClientRect();
      if (next.width >= 2) place(host, next);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    ro?.observe(slot);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
      ro?.disconnect();
      for (const id of timers) window.clearTimeout(id);
    };
  });
</script>

{#if open && video}
  <div
    class="player-embed"
    class:is-modal={inModal}
    bind:this={hostEl}
    aria-hidden={!inModal}
  >
    {#key player.nonce}
      <iframe
        bind:this={iframeEl}
        title={video.title}
        src="https://www.youtube.com/embed/{video.id}?autoplay=1&rel=0&enablejsapi=1&playsinline=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    {/key}
  </div>
{/if}
