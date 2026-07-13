<script>
  import SocialLinks from '../lib/SocialLinks.svelte';
  import PageHeader from '../lib/PageHeader.svelte';
  import { navigate } from '../lib/playerState.svelte.js';
  import { setPageMeta } from '../lib/seo.js';
  import {
    getBlogPost,
    cmsAssetUrl,
    excerptFrom,
    formatPostDate,
  } from '../lib/cms.js';

  /** @type {{ slug: string }} */
  let { slug } = $props();

  /** @type {'loading' | 'ready' | 'error' | 'notfound'} */
  let status = $state('loading');
  /** @type {import('../lib/cms.js').CmsEntry | null} */
  let post = $state(null);
  let errorMessage = $state('');

  const fields = $derived(post?.data || {});
  const title = $derived(fields.title || post?.title || '');
  const image = $derived(cmsAssetUrl(fields.featuredImage));
  const date = $derived(formatPostDate(fields.publishedAt, post?.created_at));
  const author = $derived(fields.author || '');
  const content = $derived(fields.content || '');

  $effect(() => {
    const currentSlug = slug;
    let cancelled = false;

    status = 'loading';
    post = null;
    errorMessage = '';

    void (async () => {
      try {
        const entry = await getBlogPost(currentSlug);
        if (cancelled) return;

        if (!entry) {
          status = 'notfound';
          setPageMeta({
            title: 'Article not found',
            description: 'The requested blog article could not be found.',
            path: `/blog/${encodeURIComponent(currentSlug)}`,
          });
          return;
        }

        post = entry;
        status = 'ready';
        setPageMeta({
          title: entry.data?.title || entry.title,
          description: excerptFrom(entry.data, 'An article from All For Ummah.'),
          path: `/blog/${encodeURIComponent(entry.slug || currentSlug)}`,
          image: cmsAssetUrl(entry.data?.featuredImage) || undefined,
          type: 'article',
        });
      } catch (err) {
        if (cancelled) return;
        status = 'error';
        errorMessage = err instanceof Error ? err.message : 'Failed to load article.';
      }
    })();

    return () => {
      cancelled = true;
    };
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
    <article class="blog-article">
      <div class="blog-article-inner">
        <a class="blog-back" href="/blog" onclick={(event) => go(event, '/blog')}>
          ← Back to blog
        </a>

        {#if status === 'loading'}
          <div class="blog-loading" role="status" aria-label="Loading article">
            <div class="blog-loading-bar" aria-hidden="true"></div>
          </div>
        {:else if status === 'error'}
          <p class="blog-status blog-status--error">{errorMessage}</p>
        {:else if status === 'notfound'}
          <h1 class="blog-post-title">Article not found</h1>
          <p class="blog-status">This article may have been moved or is not published yet.</p>
        {:else if post}
          <header class="blog-post-header">
            <p class="songs-label">Blog</p>
            <h1 class="blog-post-title">{title}</h1>
            <p class="blog-post-meta">
              {#if date}
                <time datetime={fields.publishedAt || ''}>{date}</time>
              {/if}
              {#if date && author}
                <span aria-hidden="true">·</span>
              {/if}
              {#if author}
                <span>{author}</span>
              {/if}
            </p>
          </header>

          {#if image}
            <figure class="blog-post-hero">
              <img src={image} alt={title} />
            </figure>
          {/if}

          <div class="blog-prose">
            {@html content}
          </div>
        {/if}
      </div>
    </article>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-label">Follow us</p>
      <SocialLinks />
      <p class="footer-copy">All For Ummah 2026. All rights reserved.</p>
    </div>
  </footer>
</div>
