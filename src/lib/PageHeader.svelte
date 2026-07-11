<script>
  import HeaderCountdown from './HeaderCountdown.svelte';
  import { navigate } from './playerState.svelte.js';

  /** @param {MouseEvent} event */
  function goHome(event) {
    event.preventDefault();
    navigate('/');
  }
</script>

<header class="songs-top">
  <a href="/" class="site-header-brand" onclick={goHome}>
    <span class="site-header-title">
      <span class="site-header-word">ALL FOR</span>
      <span class="site-header-word">UMMAH</span>
    </span>
    <span class="site-header-script">Sebuah Perjalanan</span>
  </a>
  <HeaderCountdown />
</header>
