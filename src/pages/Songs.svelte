<script>
  import { onMount } from 'svelte';
  import SocialLinks from '../lib/SocialLinks.svelte';
  import PageHeader from '../lib/PageHeader.svelte';
  import { playlist, getPlaylistByYear, getTopPicks } from '../lib/songs.js';
  import { playSong } from '../lib/playerState.svelte.js';

  const yearSections = getPlaylistByYear();
  const topPicks = getTopPicks();

  /** @param {MouseEvent} event @param {{ id: string, title: string }} video */
  function onSongClick(event, video) {
    event.preventDefault();
    playSong(video, { openLyrics: true });
  }

  onMount(() => {
    document.title = 'Song Collection — All For Ummah';
  });
</script>

<div class="page songs-page">
  <div class="glow" aria-hidden="true"></div>

  <PageHeader />

  <main>
    <section class="songs-hero">
      <div class="songs-hero-inner">
        <p class="songs-label">Collection</p>
        <h1 class="songs-title">Discover Songs</h1>
        <p class="songs-intro">
          {playlist.title}. Listen to All For Ummah recordings and performances.
        </p>
        <p class="songs-disclaimer">
          We’re still building this collection — more songs will be added soon.
        </p>
      </div>
    </section>

    <section class="songs-catalog songs-top-picks" id="top-picks">
      <div class="catalog-row">
        <div class="catalog-row-inner">
          <h2 class="catalog-row-title catalog-row-title--icon">
            Top Picks
            <svg
              class="catalog-row-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7.24001 11V20H5.63001C4.73001 20 4.01001 19.28 4.01001 18.39V12.62C4.01001 11.73 4.74001 11 5.63001 11H7.24001ZM18.5 9.5H13.72V6C13.72 4.9 12.82 4 11.73 4H11.64C11.24 4 10.88 4.24 10.72 4.61L7.99001 11V20H17.19C17.92 20 18.54 19.48 18.67 18.76L19.99 11.26C20.15 10.34 19.45 9.5 18.51 9.5H18.5Z"
                fill="#9c5de5"
              />
            </svg>
          </h2>
          <p class="catalog-row-sub">Most watched from YouTube</p>
          <div class="top-picks-track">
            {#each topPicks as video, i}
              <a
                class="top-pick-card"
                href="/discoversong"
                onclick={(event) => onSongClick(event, video)}
              >
                <img
                  class="top-pick-image"
                  src="https://i.ytimg.com/vi/{video.id}/hqdefault.jpg"
                  alt=""
                  loading="lazy"
                />
                <span class="top-pick-shade" aria-hidden="true"></span>
                <span class="top-pick-copy">
                  <span class="top-pick-label">Top pick · #{i + 1}</span>
                  <span class="top-pick-name">{video.title}</span>
                  <span class="top-pick-views">{video.viewsLabel} views</span>
                </span>
                <span class="top-pick-play" aria-hidden="true">
                  <svg
                    viewBox="0 0 459 459"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M229.5,0C102.751,0,0,102.751,0,229.5S102.751,459,229.5,459S459,356.249,459,229.5S356.249,0,229.5,0z M310.292,239.651 l-111.764,76.084c-3.761,2.56-8.63,2.831-12.652,0.704c-4.022-2.128-6.538-6.305-6.538-10.855V153.416 c0-4.55,2.516-8.727,6.538-10.855c4.022-2.127,8.891-1.857,12.652,0.704l111.764,76.084c3.359,2.287,5.37,6.087,5.37,10.151 C315.662,233.564,313.652,237.364,310.292,239.651z"
                    />
                  </svg>
                </span>
              </a>
            {/each}
          </div>
        </div>
      </div>
    </section>

    <section class="songs-catalog" id="koleksi">
      {#each yearSections as section}
        <div class="catalog-row">
          <div class="catalog-row-inner">
            <h2 class="catalog-row-title">{section.label}</h2>
            <div class="catalog-track">
              {#each section.videos as video}
                <a
                  class="catalog-card"
                  href="/discoversong"
                  onclick={(event) => onSongClick(event, video)}
                >
                  <span class="catalog-card-media">
                    <img
                      class="catalog-card-thumb"
                      src="https://i.ytimg.com/vi/{video.id}/hqdefault.jpg"
                      alt=""
                      loading="lazy"
                    />
                    <span class="catalog-card-play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5.14v14l11-7-11-7z" />
                      </svg>
                    </span>
                  </span>
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
      <p class="footer-label">Follow us</p>
      <SocialLinks />
      <p class="footer-copy">All For Ummah 2026. All rights reserved.</p>
    </div>
  </footer>
</div>
