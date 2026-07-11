<script>
  import { onMount } from 'svelte';
  import Home from './pages/Home.svelte';
  import Songs from './pages/Songs.svelte';
  import SongDetail from './pages/SongDetail.svelte';
  import SideNav from './lib/SideNav.svelte';

  /** @param {string} pathname */
  function normalize(pathname) {
    const cleaned = pathname.replace(/\/+$/, '');
    return cleaned === '' ? '/' : cleaned;
  }

  let path = $state(
    normalize(typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  const songId = $derived(
    path.startsWith('/discoversong/')
      ? decodeURIComponent(path.slice('/discoversong/'.length))
      : null,
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

{#if path === '/discoversong'}
  <Songs />
{:else if songId}
  <SongDetail videoId={songId} />
{:else}
  <Home />
{/if}

<SideNav {path} />
