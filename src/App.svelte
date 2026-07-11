<script>
  import { onMount } from 'svelte';
  import SocialLinks from './lib/SocialLinks.svelte';

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

  const TARGET_DATE = new Date('2028-01-01T00:00:00');

  let days = $state('00');
  let hours = $state('00');
  let minutes = $state('00');
  let seconds = $state('00');
  let progress = $state(0);
  let aboutIndex = $state(0);

  /** @type {HTMLElement | undefined} */
  let heroCountdownEl;
  /** @type {HTMLElement | undefined} */
  let headerCountdownSlot;

  let countdownStyle = $state('');
  let flying = $state(false);
  let headerContentOpacity = $state(0);

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function smoothstep(edge0, edge1, x) {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function updateCountdown() {
    const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);

    days = pad(Math.floor(totalSeconds / 86400));
    hours = pad(Math.floor((totalSeconds % 86400) / 3600));
    minutes = pad(Math.floor((totalSeconds % 3600) / 60));
    seconds = pad(totalSeconds % 60);
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

  onMount(() => {
    updateCountdown();
    const id = setInterval(updateCountdown, 1000);
    const galleryId = setInterval(() => {
      aboutIndex = (aboutIndex + 1) % aboutImages.length;
    }, 4500);

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
      clearInterval(id);
      clearInterval(galleryId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<div class="page">
  <div class="video-bg" aria-hidden="true">
    <video
      class="video-local"
      src="https://pub-30ed7488d88a4eeebfc5f9f0c3b793c2.r2.dev/afu-bg.mp4"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
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
        <span class="site-header-value">{days}</span>
        <span class="site-header-label">D</span>
      </div>
      <div class="site-header-unit">
        <span class="site-header-value">{hours}</span>
        <span class="site-header-label">H</span>
      </div>
      <div class="site-header-unit">
        <span class="site-header-value">{minutes}</span>
        <span class="site-header-label">M</span>
      </div>
      <div class="site-header-unit">
        <span class="site-header-value">{seconds}</span>
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
        <span class="countdown-value">{days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value">{hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value">{minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-value">{seconds}</span>
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
              <span class="countdown-value">{days}</span>
              <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">{hours}</span>
              <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">{minutes}</span>
              <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-unit">
              <span class="countdown-value">{seconds}</span>
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
        <div class="about-copy">
          <p class="about-label">Tentang kami</p>
          <h2 class="about-title">All For Ummah</h2>
          <p class="about-text">
            Kumpulan All For Ummah merupakan sebuah kumpulan pemuzik dan penyanyi
            yang aktif di Malaysia. Kumpulan ini menyampaikan lagu-lagu berirama
            nasyid Melayu. Kumpulan ini juga mewakili SMA Persekutuan Kajang dalam
            pertandingan-pertandingan nasyid sekolah menengah. Kumpulan nasyid ini
            juga pernah digeruni oleh kumpulan-kumpulan nasyid sekolah menengah yang
            lain atas kejayaannya. Kumpulan nasyid ini juga telah merangkul gelaran
            johan bagi Acara Nasyid Sekolah Menengah dalam Pertandingan FNKSS KPM
            (Festival Nasyid dan Khat Sekolah-Sekolah Kementerian Pendidikan
            Malaysia) Peringkat Kebangsaan tiga kali berturut-turut iaitu pada tahun
            2004, 2005, 2006.
          </p>
        </div>

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

            <div class="about-gallery-thumbs" role="tablist" aria-label="Galeri All For Ummah">
              {#each aboutImages as image, i}
                <button
                  type="button"
                  class="about-gallery-thumb"
                  class:is-active={aboutIndex === i}
                  aria-label="Lihat gambar {i + 1}"
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
    </section>

    <section class="music" id="music">
      <div class="music-inner">
        <div class="music-header">
          <div>
            <p class="music-label">SoundCloud</p>
            <h2 class="music-title">Satu by All For Ummah</h2>
          </div>
          <a
            class="music-link"
            href="https://soundcloud.com/umair-idros/satu-all-for-ummah"
            target="_blank"
            rel="noreferrer"
          >
            Buka di SoundCloud
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
            Lihat semua
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
            Lihat playlist
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

    <section class="facebook" id="facebook">
      <div class="facebook-inner">
        <div class="facebook-copy">
          <p class="facebook-label">Facebook</p>
          <h2 class="facebook-title">Kemas kini</h2>
          <p class="facebook-text">
            Ikuti berita, rakaman, dan detik di sebalik tabir All For Ummah terus
            dari halaman rasmi kami.
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
      <p class="footer-label">Ikuti kami</p>
      <SocialLinks />
      <p class="footer-copy">All For Ummah 2026. All rights reserved.</p>
    </div>
  </footer>
</div>
