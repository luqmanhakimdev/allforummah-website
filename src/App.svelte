<script>
  import { onMount } from 'svelte';
  import Home from './pages/Home.svelte';
  import Songs from './pages/Songs.svelte';
  import SideNav from './lib/SideNav.svelte';
  import MiniPlayer from './lib/MiniPlayer.svelte';
  import LyricsWindow from './lib/LyricsWindow.svelte';
  import PlayerEmbed from './lib/PlayerEmbed.svelte';
  import { player, playSong } from './lib/playerState.svelte.js';
  import { getPlaylistVideo } from './lib/songs.js';

  /** @param {string} pathname */
  function normalize(pathname) {
    const cleaned = pathname.replace(/\/+$/, '');
    return cleaned === '' ? '/' : cleaned;
  }

  /** Handle legacy /discoversong/:id links by opening the modal on the collection page. */
  function resolvePath(pathname) {
    const next = normalize(pathname);
    if (!next.startsWith('/discoversong/')) return next;

    const id = decodeURIComponent(next.slice('/discoversong/'.length));
    const video = getPlaylistVideo(id);
    history.replaceState({}, '', '/discoversong');
    if (video) playSong(video, { openLyrics: true });
    return '/discoversong';
  }

  let path = $state(
    resolvePath(typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  onMount(() => {
    const sync = () => {
      path = resolvePath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  });
</script>

<div class="app-shell" class:has-mini-player={player.open}>
  {#if path === '/discoversong'}
    <Songs />
  {:else}
    <Home />
  {/if}

  <SideNav {path} />
  <MiniPlayer />
  <LyricsWindow />
  <PlayerEmbed />
</div>
