<script>
  import { onMount } from 'svelte';
  import Home from './pages/Home.svelte';
  import Songs from './pages/Songs.svelte';
  import SongDetail from './pages/SongDetail.svelte';

  /** @param {string} pathname */
  function normalize(pathname) {
    const cleaned = pathname.replace(/\/+$/, '');
    return cleaned === '' ? '/' : cleaned;
  }

  let path = $state(
    normalize(typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  const songId = $derived(
    path.startsWith('/lagu/') ? decodeURIComponent(path.slice('/lagu/'.length)) : null,
  );

  onMount(() => {
    const sync = () => {
      path = normalize(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  });
</script>

{#if path === '/lagu'}
  <Songs />
{:else if songId}
  <SongDetail videoId={songId} />
{:else}
  <Home />
{/if}
