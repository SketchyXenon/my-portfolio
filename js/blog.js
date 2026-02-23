import { safeLink, setText, el } from './security.js';

export function initBlog() {
  const posts = window.POSTS || [];
  const list  = document.getElementById('blog-list');
  if (!list) return;

  // Clear any loading placeholder safely
  while (list.firstChild) list.removeChild(list.firstChild);

  posts.forEach((p) => {
    // Build the <a> wrapper with a validated href
    const item = safeLink(p.url, 'blog-item');
    if (!item) {
      // URL was unsafe — skip this post entirely and warn in dev
      console.warn('[security] Blog post skipped — unsafe URL:', p.url);
      return;
    }

    // Left content column
    const left    = el('div');
    const date    = el('div', '', 'blog-date');
    const title   = el('div', '', 'blog-title');
    const excerpt = el('div', '', 'blog-excerpt');

    
    setText(date,    p.date);
    setText(title,   p.title);
    setText(excerpt, p.excerpt);

    left.appendChild(date);
    left.appendChild(title);
    left.appendChild(excerpt);

    // Tag badge
    const tag = el('span', '', 'blog-tag');
    setText(tag, p.tag);

    // Arrow (static string — not from data)
    const arrow = el('span', '→', 'blog-arrow');
    arrow.setAttribute('aria-hidden', 'true');

    item.appendChild(left);
    item.appendChild(tag);
    item.appendChild(arrow);
    list.appendChild(item);
  });
}
