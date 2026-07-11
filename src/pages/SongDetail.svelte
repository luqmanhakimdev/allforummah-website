<script>
  import SocialLinks from '../lib/SocialLinks.svelte';
  import {
    getPlaylistVideo,
    LYRICS_PLACEHOLDER,
    playlist,
  } from '../lib/songs.js';

  /** @type {{ videoId: string }} */
  let { videoId } = $props();

  const video = $derived(getPlaylistVideo(videoId));
  const lyrics = $derived(video?.lyrics?.trim() || LYRICS_PLACEHOLDER);

  $effect(() => {
    document.title = video
      ? `${video.title} — All For Ummah`
      : 'Lagu tidak dijumpai — All For Ummah';
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
    <a class="songs-back" href="/lagu">← Koleksi lagu</a>
  </header>

  <main>
    {#if video}
      <section class="song-detail">
        <div class="song-detail-inner">
          <div class="song-detail-header">
            <p class="songs-label">Lagu</p>
            <h1 class="songs-title">{video.title}</h1>
            <a
              class="song-item-link"
              href="https://www.youtube.com/watch?v={video.id}&list={playlist.id}"
              target="_blank"
              rel="noreferrer"
            >
              Buka di YouTube
            </a>
          </div>

          <div class="song-detail-video">
            <iframe
              src="https://www.youtube.com/embed/{video.id}?rel=0"
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>

          <div class="song-detail-lyrics">
            <p class="songs-label">Lirik</p>
            <h2 class="song-detail-lyrics-title">Lirik lagu</h2>
            <pre class="song-detail-lyrics-body">{lyrics}</pre>
          </div>
        </div>
      </section>
    {:else}
      <section class="song-detail">
        <div class="song-detail-inner">
          <p class="songs-label">Lagu</p>
          <h1 class="songs-title">Tidak dijumpai</h1>
          <p class="songs-intro">Lagu ini tiada dalam koleksi.</p>
          <a class="discover-cta" href="/lagu">Kembali ke koleksi</a>
        </div>
      </section>
    {/if}
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-label">Ikuti kami</p>
      <SocialLinks />
      <p class="footer-copy">All For Ummah 2026. All rights reserved.</p>
    </div>
  </footer>
</div>
