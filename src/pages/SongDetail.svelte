<script>
  import SocialLinks from '../lib/SocialLinks.svelte';
  import PageHeader from '../lib/PageHeader.svelte';
  import {
    getPlaylistVideo,
    LYRICS_PLACEHOLDER,
  } from '../lib/songs.js';

  /** @type {{ videoId: string }} */
  let { videoId } = $props();

  const video = $derived(getPlaylistVideo(videoId));
  const lyrics = $derived(video?.lyrics?.trim() || LYRICS_PLACEHOLDER);

  $effect(() => {
    document.title = video
      ? `${video.title} — All For Ummah`
      : 'Song not found — All For Ummah';
  });
</script>

<div class="page songs-page">
  <div class="glow" aria-hidden="true"></div>

  <PageHeader />

  <main>
    {#if video}
      <section class="song-detail">
        <div class="song-detail-inner">
          <div class="song-detail-header">
            <p class="songs-label">Song</p>
            <h1 class="songs-title">{video.title}</h1>
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
            <p class="songs-label">Lyrics</p>
            <h2 class="song-detail-lyrics-title">Song lyrics</h2>
            <pre class="song-detail-lyrics-body">{lyrics}</pre>
          </div>
        </div>
      </section>
    {:else}
      <section class="song-detail">
        <div class="song-detail-inner">
          <p class="songs-label">Song</p>
          <h1 class="songs-title">Not found</h1>
          <p class="songs-intro">This song is not in the collection.</p>
          <a class="discover-cta" href="/discoversong">Back to collection</a>
        </div>
      </section>
    {/if}
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-label">Follow us</p>
      <SocialLinks />
      <p class="footer-copy">All For Ummah 2026. All rights reserved.</p>
    </div>
  </footer>
</div>
