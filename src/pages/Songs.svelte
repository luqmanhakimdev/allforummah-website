<script>
  import { onMount } from 'svelte';
  import SocialLinks from '../lib/SocialLinks.svelte';
  import { playlist, getPlaylistByYear } from '../lib/songs.js';

  const yearSections = getPlaylistByYear();

  onMount(() => {
    document.title = 'Koleksi Lagu — All For Ummah';
  });
</script>

<div class="page songs-page">
  <div class="glow" aria-hidden="true"></div>

  <header class="songs-top">
    <a href="/" class="site-header-brand">
      <span class="site-header-title">
        <span class="site-header-word">ALL FOR</span>
        <span class="site-header-word">UMMAH</span>
      </span>
      <span class="site-header-script">Sebuah Perjalanan</span>
    </a>
    <a class="songs-back" href="/">← Laman utama</a>
  </header>

  <main>
    <section class="songs-hero">
      <div class="songs-hero-inner">
        <p class="songs-label">Lagu</p>
        <h1 class="songs-title">Koleksi Lagu</h1>
        <p class="songs-intro">
          {playlist.title}. Dengarkan rakaman dan persembahan All For Ummah.
        </p>
        <a
          class="songs-playlist-btn"
          href={playlist.url}
          target="_blank"
          rel="noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            />
          </svg>
          <span>Buka di YouTube</span>
        </a>
      </div>
    </section>

    <section class="songs-catalog" id="koleksi">
      {#each yearSections as section}
        <div class="catalog-row">
          <div class="catalog-row-inner">
            <h2 class="catalog-row-title">{section.label}</h2>
            <div class="catalog-track">
              {#each section.videos as video}
                <a class="catalog-card" href="/lagu/{video.id}">
                  <img
                    class="catalog-card-thumb"
                    src="https://i.ytimg.com/vi/{video.id}/hqdefault.jpg"
                    alt=""
                    loading="lazy"
                  />
                  <span class="catalog-card-title">{video.title}</span>
                  <span class="catalog-card-meta">All For Ummah</span>
                </a>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </section>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-label">Ikuti kami</p>
      <SocialLinks />
      <p class="footer-copy">All For Ummah 2026. All rights reserved.</p>
    </div>
  </footer>
</div>
