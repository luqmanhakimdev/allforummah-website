<script>
  import { onMount } from 'svelte';
  import Home from './pages/Home.svelte';
  import Songs from './pages/Songs.svelte';
  import Blog from './pages/Blog.svelte';
  import BlogPost from './pages/BlogPost.svelte';
  import SideNav from './lib/SideNav.svelte';
  import MiniPlayer from './lib/MiniPlayer.svelte';
  import LyricsWindow from './lib/LyricsWindow.svelte';
  import PlayerEmbed from './lib/PlayerEmbed.svelte';
  import { player, playSong } from './lib/playerState.svelte.js';
  import { getPlaylistVideo } from './lib/songs.js';
  import { setPageMeta } from './lib/seo.js';
  import { DEFAULT_DESCRIPTION } from './lib/site.js';

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

  /** @param {string} nextPath */
  function blogSlug(nextPath) {
    if (!nextPath.startsWith('/blog/')) return '';
    return decodeURIComponent(nextPath.slice('/blog/'.length));
  }

  /** @param {string} nextPath */
  function applySeo(nextPath) {
    if (nextPath === '/discoversong') {
      setPageMeta({
        title: 'Song Collection',
        description:
          'Discover All For Ummah songs and performances — recordings, festival nasyid, and top picks from YouTube.',
        path: '/discoversong',
      });
      return;
    }
    if (nextPath === '/blog') {
      setPageMeta({
        title: 'Blog',
        description:
          'Stories and nasyid insights from All For Ummah — Sebuah Perjalanan.',
        path: '/blog',
      });
      return;
    }
    if (nextPath.startsWith('/blog/')) {
      // BlogPost sets its own meta after the CMS response loads.
      return;
    }
    setPageMeta({
      description: DEFAULT_DESCRIPTION,
      path: '/',
    });
  }

  let path = $state(
    resolvePath(typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  const postSlug = $derived(blogSlug(path));

  $effect(() => {
    applySeo(path);
  });

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
  {:else if path === '/blog'}
    <Blog />
  {:else if postSlug}
    <BlogPost slug={postSlug} />
  {:else}
    <Home />
  {/if}

  <SideNav {path} />
  <MiniPlayer />
  <LyricsWindow />
  <PlayerEmbed />
</div>
