<script>
  import { onMount } from 'svelte';
  import SocialLinks from '../lib/SocialLinks.svelte';
  import { playlistVideos } from '../lib/songs.js';
  import { clock, ensureCountdown } from '../lib/countdown.svelte.js';

  const channelVideos = ['VmKQdOHsu7g', 'BBkJ3djILpg', 'RwUhGf8s0ZU'];

  const festivalVideos = [
    'm_yu8RltOdc',
    'UZB5sXAC1Qc',
    'piRGAEXaJlI',
    'krSrZEUCzM4',
    'XtX8ieeoVKE',
    '8QZ_rurF6Uw',
    'pw231rRnWDk',
  ];

  const R2 = 'https://pub-30ed7488d88a4eeebfc5f9f0c3b793c2.r2.dev';

  const aboutImages = [
    { src: `${R2}/about-us.jpg`, alt: 'All For Ummah' },
    { src: `${R2}/afu2.jpg`, alt: 'All For Ummah' },
    { src: `${R2}/afu3.jpg`, alt: 'All For Ummah' },
    { src: `${R2}/afu4.jpg`, alt: 'All For Ummah' },
    { src: `${R2}/afu5.jpg`, alt: 'All For Ummah' },
    { src: `${R2}/afu6.jpg`, alt: 'All For Ummah' },
  ];

  const discoverThumbs = playlistVideos.map((video) => ({
    id: video.id,
    src: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    alt: video.title,
  }));

  let progress = $state(0);
  let aboutIndex = $state(0);
  let discoverIndex = $state(0);
  let discoverAnimating = $state(true);

  /** @type {HTMLElement | undefined} */
  let heroCountdownEl;
  /** @type {HTMLElement | undefined} */
  let headerCountdownSlot;

  let countdownStyle = $state('');
  let flying = $state(false);
  let headerContentOpacity = $state(0);

  /** @param {number} a @param {number} b @param {number} t */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /** @param {number} t */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /** @param {number} edge0 @param {number} edge1 @param {number} x */
  function smoothstep(edge0, edge1, x) {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  /**
   * @param {HTMLElement} el
   */
  function docBox(el) {
    const r = el.getBoundingClientRect();
    return {
      top: r.top + window.scrollY,
      left: r.left + window.scrollX,
      width: r.width,
      height: r.height,
    };
  }

  /** @type {HTMLVideoElement | undefined} */
  let heroVideoEl;

  function tryPlayHeroVideo() {
    if (!heroVideoEl) return;
    heroVideoEl.muted = true;
    heroVideoEl.defaultMuted = true;
    heroVideoEl.setAttribute('muted', '');
    const play = heroVideoEl.play();
    if (play && typeof play.catch === 'function') {
      play.catch(() => {
        // iPad Low Power Mode / autoplay policy — stays on poster/first frame
      });
    }
  }

  onMount(() => {
    document.title = 'All For Ummah';
    ensureCountdown();
    const galleryId = setInterval(() => {
      aboutIndex = (aboutIndex + 1) % aboutImages.length;
    }, 4500);

    /** @type {ReturnType<typeof setInterval> | undefined} */
    let discoverId;
    if (discoverThumbs.length > 1) {
      discoverId = setInterval(() => {
        discoverAnimating = true;
        discoverIndex += 1;
      }, 4200);
    }

    tryPlayHeroVideo();
    heroVideoEl?.addEventListener('loadeddata', tryPlayHeroVideo);
    document.addEventListener('touchstart', tryPlayHeroVideo, { once: true, passive: true });

    /** @type {ReturnType<typeof docBox> | null} */
    let countdownStart = null;
    let ticking = false;

    function measureStarts() {
      if (!heroCountdownEl) return;
      countdownStart = docBox(heroCountdownEl);
    }

    function updateMorph() {
      const range = Math.min(window.innerHeight * 0.72, 560);
      const raw = Math.min(1, Math.max(0, window.scrollY / range));
      const p = easeOutCubic(raw);
      progress = raw;

      if (raw <= 0.002) {
        flying = false;
        countdownStyle = '';
        headerContentOpacity = 0;
        measureStarts();
        ticking = false;
        return;
      }

      if (!countdownStart) measureStarts();
      if (!countdownStart || !headerCountdownSlot) {
        ticking = false;
        return;
      }

      flying = true;

      const countdownEnd = headerCountdownSlot.getBoundingClientRect();
      const shrinkP = Math.pow(raw, 0.62);

      const startCountTop = countdownStart.top - window.scrollY;
      const startCountLeft = countdownStart.left - window.scrollX;
      const countScale = lerp(
        1,
        Math.min(countdownEnd.height / countdownStart.height, 0.35),
        shrinkP,
      );
      const countCX = lerp(
        startCountLeft + countdownStart.width / 2,
        countdownEnd.left + countdownEnd.width / 2,
        p,
      );
      const countCY = lerp(
        startCountTop + countdownStart.height / 2,
        countdownEnd.top + countdownEnd.height / 2,
        p,
      );

      const flyOpacity = 1 - smoothstep(0.08, 0.55, raw);
      headerContentOpacity = smoothstep(0.25, 0.7, raw);

      countdownStyle = [
        `top:${countCY}px`,
        `left:${countCX}px`,
        `transform:translate(-50%, -50%) scale(${countScale})`,
        `transform-origin:center center`,
        `opacity:${flyOpacity}`,
      ].join(';');

      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateMorph);
    }

    function onResize() {
      countdownStart = null;
      measureStarts();
      updateMorph();
    }

    measureStarts();
    updateMorph();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      clearInterval(galleryId);
      if (discoverId) clearInterval(discoverId);
      heroVideoEl?.removeEventListener('loadeddata', tryPlayHeroVideo);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<div class="page">
  <div class="video-bg" aria-hidden="true">
    <video
      class="video-local"
      bind:this={heroVideoEl}
      src="https://pub-30ed7488d88a4eeebfc5f9f0c3b793c2.r2.dev/afubgsmall.mp4"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline
      preload="auto"
      disablepictureinpicture
    ></video>
    <div class="video-dim"></div>
  </div>

  <div class="glow" aria-hidden="true"></div>

  <header
    class="site-header"
    class:is-visible={progress > 0.08}
    class:is-docked={progress >= 0.98}
    style="--header-progress: {progress}; --header-content-opacity: {headerContentOpacity}"
    aria-hidden={progress < 0.5}
  >
    <div class="site-header-bar"></div>
    <a href="/" class="site-header-brand site-header-slot">
      <span class="site-header-title">
        <span class="site-header-word">ALL FOR</span>
        <span class="site-header-word">UMMAH</span>
      </span>
      <span class="site-header-script">Sebuah Perjalanan</span>
    </a>
    <div
      class="site-header-countdown site-header-slot"
      bind:this={headerCountdownSlot}
      aria-label="Countdown to 2028"
    >
      <div class="site-header-unit">
        <span class="site-header-value">{clock.days}</span>
        <span class="site-header-label">D</span>
      </div>
      <div class="site-header-unit">
        <span class="site-header-value">{clock.hours}</span>
        <span class="site-header-label">H</span>
      </div>
      <div class="site-header-unit">
        <span class="site-header-value">{clock.minutes}</span>
        <span class="site-header-label">M</span>
      </div>
      <div class="site-header-unit">
        <span class="site-header-value">{clock.seconds}</span>
        <span class="site-header-label">S</span>
      </div>
    </div>
  </header>

  <div
    class="fly-countdown"
    class:is-flying={flying}
    style={countdownStyle}
    aria-hidden="true"
  >
    <div class="countdown">
      <div class="countdown-unit">
        <span class="countdown-value">{clock.days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value">{clock.hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value">{clock.minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value">{clock.seconds}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    </div>
  </div>

  <main>
    <section class="hero">
      <div class="hero-content">
        <div class="hero-brand">
          <h1 class="headline">
            <span class="headline-stack">
              <span class="headline-main">
                <span class="headline-line">ALL FOR</span>
                <span class="headline-line">UMMAH</span>
              </span>
              <span class="headline-script">Sebuah Perjalanan</span>
            </span>
          </h1>

          <div
            class="countdown"
            class:is-placeholder={flying}
            bind:this={heroCountdownEl}
            aria-label="Countdown to 2028"
          >
            <div class="countdown-unit">
              <span class="countdown-value">{clock.days}</span>
              <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">{clock.hours}</span>
              <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">{clock.minutes}</span>
              <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">{clock.seconds}</span>
              <span class="countdown-label">Seconds</span>
            </div>
          </div>
        </div>

        <div class="hero-social" style="opacity: {Math.max(0, 1 - progress * 1.4)}">
          <SocialLinks iconsOnly />
        </div>
      </div>
    </section>

    <section class="about" id="about">
      <div class="about-inner">
        <div class="about-header">
          <div>
            <p class="about-label">About us</p>
            <h2 class="about-title">All For Ummah</h2>
          </div>
        </div>

        <div class="about-body">
          <p class="about-text">
            All For Ummah is a group of musicians and singers active in Malaysia.
            They perform Malay nasyid songs and have represented SMA Persekutuan
            Kajang in secondary school nasyid competitions. The group was once
            feared by other school nasyid ensembles for its achievements, and won
            the national secondary school nasyid title at FNKSS KPM (Festival
            Nasyid dan Khat Sekolah-Sekolah Kementerian Pendidikan Malaysia) three
            years in a row — 2004, 2005, and 2006.
          </p>

          <div class="about-media">
            <div class="about-gallery">
              <div class="about-gallery-main">
                {#each aboutImages as image, i}
                  <img
                    class="about-gallery-image"
                    class:is-active={aboutIndex === i}
                    src={image.src}
                    alt={image.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                {/each}
              </div>

              <div class="about-gallery-thumbs" role="tablist" aria-label="All For Ummah gallery">
                {#each aboutImages as image, i}
                  <button
                    type="button"
                    class="about-gallery-thumb"
                    class:is-active={aboutIndex === i}
                    aria-label="View image {i + 1}"
                    aria-selected={aboutIndex === i}
                    onclick={() => (aboutIndex = i)}
                  >
                    <img src={image.src} alt="" loading="lazy" />
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="discover" id="discover">
      <div class="discover-inner">
        <div class="discover-media" aria-hidden="true">
          <div
            class="discover-media-track"
            class:is-animating={discoverAnimating}
            style="transform: translate3d(-{discoverIndex * 100}%, 0, 0)"
            ontransitionend={() => {
              if (discoverIndex >= discoverThumbs.length) {
                discoverAnimating = false;
                discoverIndex = 0;
              }
            }}
          >
            {#each [...discoverThumbs, discoverThumbs[0]] as thumb, i}
              <div class="discover-media-slide">
                <img
                  src={thumb.src}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
              </div>
            {/each}
          </div>
        </div>
        <div class="discover-copy">
          <p class="discover-label">Songs</p>
          <h2 class="discover-title">All For Ummah Song Collection</h2>
          <p class="discover-text">
            Listen to All For Ummah recordings — from familiar songs to newer ones.
          </p>
          <a class="discover-cta" href="/discoversong">Song collection</a>
        </div>
      </div>
    </section>

    <section class="evolution" id="evolution">
      <div class="evolution-inner">
        <div class="evolution-header">
          <div>
            <p class="evolution-label">Evolution</p>
            <h2 class="evolution-title">The All For Ummah Journey</h2>
          </div>
          <p class="evolution-aside">
            Watch the group’s evolution — from the beginning to today.
          </p>
        </div>

        <div class="evolution-video">
          <iframe
            src="https://www.youtube.com/embed/kAgJuEQJCtI"
            title="All For Ummah Evolution"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </section>

    <section class="videos" id="videos">
      <div class="videos-inner">
        <div class="videos-header">
          <div>
            <p class="videos-label">YouTube</p>
            <h2 class="videos-title">Video</h2>
          </div>
          <a
            class="videos-link"
            href="https://www.youtube.com/@AllForUmmah/videos"
            target="_blank"
            rel="noreferrer"
          >
            View all
          </a>
        </div>

        <div class="videos-track">
          {#each channelVideos as videoId}
            <div class="video-item">
              <iframe
                src="https://www.youtube.com/embed/{videoId}"
                title="All For Ummah video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="videos videos-festival" id="festival">
      <div class="videos-inner">
        <div class="videos-header">
          <div>
            <p class="videos-label">Playlist</p>
            <h2 class="videos-title">Festival Nasyid</h2>
          </div>
          <a
            class="videos-link"
            href="https://www.youtube.com/playlist?list=PLcB3_2mlOVT0"
            target="_blank"
            rel="noreferrer"
          >
            View playlist
          </a>
        </div>

        <div class="videos-track">
          {#each festivalVideos as videoId}
            <div class="video-item">
              <iframe
                src="https://www.youtube.com/embed/{videoId}"
                title="All For Ummah Festival Nasyid"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                loading="lazy"
                referrerpolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="music" id="music">
      <div class="music-inner">
        <div class="music-header">
          <div>
            <p class="music-label">SoundCloud</p>
            <h2 class="music-title">Satu by All For Ummah</h2>
          </div>
          <a class="music-link" href="/discoversong">
            Song collection
          </a>
        </div>

        <div class="music-player">
          <iframe
            title="Satu - All For Ummah on SoundCloud"
            width="100%"
            height="166"
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            loading="lazy"
            src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/umair-idros/satu-all-for-ummah&color=%239b5de5&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
          ></iframe>
        </div>
      </div>
    </section>

    <section class="facebook" id="facebook">
      <div class="facebook-inner">
        <div class="facebook-copy">
          <p class="facebook-label">Facebook</p>
          <h2 class="facebook-title">Updates</h2>
          <p class="facebook-text">
            Follow All For Ummah news, recordings, and behind-the-scenes moments
            on our official page.
          </p>
          <a
            class="facebook-cta"
            href="https://www.facebook.com/AFUmusic"
            target="_blank"
            rel="noreferrer"
          >
            AFU Facebook
          </a>
        </div>
      </div>
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
