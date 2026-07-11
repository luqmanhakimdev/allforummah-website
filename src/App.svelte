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

  const TARGET_DATE = new Date('2028-01-01T00:00:00');

  let days = $state('00');
  let hours = $state('00');
  let minutes = $state('00');
  let seconds = $state('00');

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function updateCountdown() {
    const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
    const totalSeconds = Math.floor(diff / 1000);

    days = pad(Math.floor(totalSeconds / 86400));
    hours = pad(Math.floor((totalSeconds % 86400) / 3600));
    minutes = pad(Math.floor((totalSeconds % 3600) / 60));
    seconds = pad(totalSeconds % 60);
  }

  onMount(() => {
    updateCountdown();
    const id = setInterval(updateCountdown, 1000);
    return () => clearInterval(id);
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

  <header class="header">
    <a href="/" class="logo" aria-label="All For Ummah"></a>
  </header>

  <main>
    <section class="hero">
      <div class="hero-content">
        <h1 class="headline">
          <span class="headline-stack">
            <span class="headline-main">ALL FOR<br />UMMAH</span>
            <span class="headline-script">Sebuah Perjalanan</span>
          </span>
        </h1>

        <div class="countdown" aria-label="Countdown to 2028">
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

        <div class="hero-social">
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
          <img
            src="https://pub-30ed7488d88a4eeebfc5f9f0c3b793c2.r2.dev/about-us.jpg"
            alt="All For Ummah"
          />
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
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-label">Ikuti kami</p>
      <SocialLinks />
      <p class="footer-copy">All For Ummah 2026. All rights reserved.</p>
    </div>
  </footer>
</div>
