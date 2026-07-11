<script>
  import { onMount } from 'svelte';
  import { clock, ensureCountdown } from './countdown.svelte.js';

  onMount(() => {
    ensureCountdown();
  });
</script>

<div class="site-header-countdown" aria-label="Countdown to 2028">
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
