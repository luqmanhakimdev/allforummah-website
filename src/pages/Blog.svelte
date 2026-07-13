<script>
  import { onMount } from 'svelte';
  import SocialLinks from '../lib/SocialLinks.svelte';
  import PageHeader from '../lib/PageHeader.svelte';
  import { navigate } from '../lib/playerState.svelte.js';
  import {
    listBlogPosts,
    cmsAssetUrl,
    excerptFrom,
    formatPostDate,
  } from '../lib/cms.js';

  /** @type {'loading' | 'ready' | 'error'} */
  let status = $state('loading');
  /** @type {import('../lib/cms.js').CmsEntry[]} */
  let posts = $state([]);
  let errorMessage = $state('');

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
          Read about nasyid, competitions, and the All For Ummah journey.
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
          <ul class="blog-cards">
            {#each posts as post}
              {@const fields = post.data || {}}
              {@const href = `/blog/${encodeURIComponent(post.slug || post.id)}`}
              {@const image = cmsAssetUrl(fields.featuredImage)}
              {@const date = formatPostDate(fields.publishedAt, post.created_at)}
              <li>
                <a class="blog-card" {href} onclick={(event) => go(event, href)}>
                  {#if image}
                    <span class="blog-card-media">
                      <img
                        class="blog-card-image"
                        src={image}
                        alt=""
                        loading="lazy"
                      />
                    </span>
                  {/if}
                  <span class="blog-card-body">
                    {#if date}
                      <time class="blog-card-date" datetime={fields.publishedAt || ''}>
                        {date}
                      </time>
                    {/if}
                    <span class="blog-card-title">{fields.title || post.title}</span>
                    <span class="blog-card-excerpt">{excerptFrom(fields)}</span>
                    <span class="blog-card-cta">Read article</span>
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
