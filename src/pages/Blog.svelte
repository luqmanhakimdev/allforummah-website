<script>
  import { onMount } from 'svelte';
  import SocialLinks from '../lib/SocialLinks.svelte';
  import PageHeader from '../lib/PageHeader.svelte';
  import { navigate } from '../lib/playerState.svelte.js';
  import {
    listBlogPosts,
    cmsAssetUrl,
    formatPostDate,
  } from '../lib/cms.js';

  const PAGE_SIZE = 5;

  /** @type {'loading' | 'ready' | 'error'} */
  let status = $state('loading');
  /** @type {import('../lib/cms.js').CmsEntry[]} */
  let posts = $state([]);
  let errorMessage = $state('');
  let page = $state(1);

  const totalPages = $derived(Math.max(1, Math.ceil(posts.length / PAGE_SIZE)));
  const pagePosts = $derived(posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
  const featured = $derived(pagePosts[0] || null);
  const morePosts = $derived(pagePosts.slice(1));
  const pageNumbers = $derived(
    Array.from({ length: totalPages }, (_, index) => index + 1),
  );

  /** @param {string | null | undefined} value */
  function parsePage(value) {
    const parsed = Number.parseInt(value || '1', 10);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return parsed;
  }

  /** @param {number} nextPage */
  function clampPage(nextPage) {
    return Math.min(Math.max(1, nextPage), totalPages);
  }

  function readPageFromUrl() {
    if (typeof window === 'undefined') return 1;
    return parsePage(new URL(window.location.href).searchParams.get('page'));
  }

  /** @param {number} nextPage @param {{ replace?: boolean }} [opts] */
  function setPage(nextPage, opts = {}) {
    const target = clampPage(nextPage);
    page = target;

    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    if (target <= 1) url.searchParams.delete('page');
    else url.searchParams.set('page', String(target));

    const next = `${url.pathname}${url.search}${url.hash}`;
    if (opts.replace) history.replaceState({}, '', next);
    else history.pushState({}, '', next);
  }

  /** @param {number} nextPage */
  function goToPage(nextPage) {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    const list = document.querySelector('.blog-list');
    list?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMount(() => {
    page = readPageFromUrl();

    const onPop = () => {
      page = clampPage(readPageFromUrl());
    };
    window.addEventListener('popstate', onPop);

    void (async () => {
      try {
        posts = await listBlogPosts();
        status = 'ready';
        // Clamp after totalPages is known.
        setPage(page, { replace: true });
      } catch (err) {
        status = 'error';
        errorMessage = err instanceof Error ? err.message : 'Failed to load blog.';
      }
    })();

    return () => window.removeEventListener('popstate', onPop);
  });

  /** @param {MouseEvent} event @param {string} href */
  function go(event, href) {
    event.preventDefault();
    navigate(href);
  }

  /** @param {import('../lib/cms.js').CmsEntry} post */
  function postHref(post) {
    return `/blog/${encodeURIComponent(post.slug || post.id)}`;
  }
</script>

<div class="page blog-page">
  <div class="glow" aria-hidden="true"></div>

  <PageHeader />

  <main>
    <section class="blog-hero">
      <div class="blog-hero-inner">
        <p class="songs-label">Blog</p>
        <h1 class="songs-title">Stories and Nasyid Insights</h1>
        <p class="blog-intro">
          Read about music, nasyid, competitions and All For Ummah journey.
        </p>
      </div>
    </section>

    <section class="blog-list" aria-live="polite">
      <div class="blog-list-inner">
        {#if status === 'loading'}
          <div class="blog-loading" role="status" aria-label="Loading articles">
            <div class="blog-loading-bar" aria-hidden="true"></div>
          </div>
        {:else if status === 'error'}
          <p class="blog-status blog-status--error">{errorMessage}</p>
        {:else if posts.length === 0}
          <p class="blog-status">No published articles yet.</p>
        {:else}
          <ul class="blog-newsroom">
            {#if featured}
              {@const fields = featured.data || {}}
              {@const href = postHref(featured)}
              {@const image = cmsAssetUrl(fields.featuredImage)}
              {@const date = formatPostDate(fields.publishedAt, featured.created_at)}
              <li class="blog-newsroom-featured">
                <a class="blog-tile blog-tile--featured" {href} onclick={(event) => go(event, href)}>
                  {#if image}
                    <span class="blog-tile-media">
                      <img src={image} alt="" loading="eager" />
                    </span>
                  {/if}
                  <span class="blog-tile-body">
                    <span class="blog-tile-label">Article</span>
                    <span class="blog-tile-title">{fields.title || featured.title}</span>
                    {#if date}
                      <time class="blog-tile-date" datetime={fields.publishedAt || ''}>{date}</time>
                    {/if}
                  </span>
                </a>
              </li>
            {/if}

            {#each morePosts as post}
              {@const fields = post.data || {}}
              {@const href = postHref(post)}
              {@const image = cmsAssetUrl(fields.featuredImage)}
              {@const date = formatPostDate(fields.publishedAt, post.created_at)}
              <li>
                <a class="blog-tile" {href} onclick={(event) => go(event, href)}>
                  {#if image}
                    <span class="blog-tile-media">
                      <img src={image} alt="" loading="lazy" />
                    </span>
                  {/if}
                  <span class="blog-tile-body">
                    <span class="blog-tile-label">Article</span>
                    <span class="blog-tile-title">{fields.title || post.title}</span>
                    {#if date}
                      <time class="blog-tile-date" datetime={fields.publishedAt || ''}>{date}</time>
                    {/if}
                  </span>
                </a>
              </li>
            {/each}
          </ul>

          {#if totalPages > 1}
            <nav class="blog-pagination" aria-label="Blog pagination">
              <button
                type="button"
                class="blog-page-btn"
                disabled={page <= 1}
                onclick={() => goToPage(page - 1)}
              >
                Previous
              </button>

              <div class="blog-page-numbers">
                {#each pageNumbers as n}
                  <button
                    type="button"
                    class="blog-page-num"
                    class:is-active={n === page}
                    aria-current={n === page ? 'page' : undefined}
                    onclick={() => goToPage(n)}
                  >
                    {n}
                  </button>
                {/each}
              </div>

              <button
                type="button"
                class="blog-page-btn"
                disabled={page >= totalPages}
                onclick={() => goToPage(page + 1)}
              >
                Next
              </button>
            </nav>
          {/if}
        {/if}
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
