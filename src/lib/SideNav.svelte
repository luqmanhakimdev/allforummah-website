<script>
  import { onMount } from 'svelte';
  import {
    sideNav,
    toggleSideNav,
    setSideNavOpen,
    initSideNav,
  } from './sideNavState.svelte.js';
  import { navigate } from './playerState.svelte.js';

  /** @type {{ path?: string }} */
  let { path = '/' } = $props();

  const open = $derived(sideNav.open);
  const isHome = $derived(path === '/');
  const isSongs = $derived(path === '/discoversong' || path.startsWith('/discoversong/'));

  /** @param {MouseEvent} event @param {string} href */
  function go(event, href) {
    event.preventDefault();
    setSideNavOpen(false);
    navigate(href);
  }

  onMount(() => {
    initSideNav();

    /** @param {KeyboardEvent} event */
    function onKey(event) {
      if (event.key === 'Escape' && sideNav.open) {
        setSideNavOpen(false);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('side-nav-lock', open);
    return () => document.body.classList.remove('side-nav-lock');
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
  >
    <span class="side-nav-header-btn-bars" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>

  <button
    type="button"
    class="side-nav-backdrop"
    aria-label="Close menu"
    tabindex={open ? 0 : -1}
    onclick={() => setSideNavOpen(false)}
  ></button>

  <nav id="side-nav-panel" class="side-nav-panel" aria-label="Site navigation" inert={!open}>
    <div class="side-nav-panel-inner">
      <p class="side-nav-heading">Menu</p>
      <ul class="side-nav-list">
        <li>
          <a
            class="side-nav-link"
            class:is-active={isHome}
            href="/"
            onclick={(event) => go(event, '/')}
          >
            <span>Home</span>
            <svg class="side-nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </li>
        <li>
          <a
            class="side-nav-link"
            class:is-active={isSongs}
            href="/discoversong"
            onclick={(event) => go(event, '/discoversong')}
          >
            <span>Songs</span>
            <svg class="side-nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</div>
