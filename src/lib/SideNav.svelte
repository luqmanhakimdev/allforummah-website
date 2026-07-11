<script>
  import { onMount } from 'svelte';
  import {
    sideNav,
    toggleSideNav,
    setSideNavOpen,
    initSideNav,
  } from './sideNavState.svelte.js';

  /** @type {{ path?: string }} */
  let { path = '/' } = $props();

  const open = $derived(sideNav.open);
  const isSongs = $derived(path === '/discoversong' || path.startsWith('/discoversong/'));

  onMount(() => {
    initSideNav();
  });
</script>

<div class="side-nav" class:is-open={open}>
  <button
    type="button"
    class="side-nav-header-btn"
    onclick={toggleSideNav}
    aria-expanded={open}
    aria-controls="side-nav-panel"
    aria-label={open ? 'Close menu' : 'Open menu'}
    title={open ? 'Close' : 'Menu'}
  >
    <span class="side-nav-header-btn-bars" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>

  <nav id="side-nav-panel" class="side-nav-panel" aria-label="Page navigation" inert={!open}>
    <ul class="side-nav-list">
      <li>
        <a
          class="side-nav-link"
          class:is-active={isSongs}
          href="/discoversong"
          onclick={() => setSideNavOpen(false)}
        >
          Songs
        </a>
      </li>
    </ul>
  </nav>
</div>
