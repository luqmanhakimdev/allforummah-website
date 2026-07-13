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

  /** @type {'loading' | 'ready' | 'error'} */
  let status = $state('loading');
  /** @type {import('../lib/cms.js').CmsEntry[]} */
  let posts = $state([]);
  let errorMessage = $state('');

  const featured = $derived(posts[0] || null);
  const morePosts = $derived(posts.slice(1));

  onMount(async () => {
    try {
      posts = await listBlogPosts();
      status = 'ready';
    } catch (err) {
      status = 'error';
      errorMessage = err instanceof Error ? err.message : 'Failed to load blog.';
    }
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
