import { safeLink, setText, el } from "./security.js";

export function initBlog() {
  const posts = window.POSTS || [];
  const list = document.getElementById("blog-list");
  if (!list) return;

  while (list.firstChild) list.removeChild(list.firstChild);

  posts.forEach((p) => {
    const item = safeLink(p.url, "blog-item");
    if (!item) {
      console.warn("[security] Blog post skipped — unsafe URL:", p.url);
      return;
    }

    const left = el("div");
    const date = el("div", "", "blog-date");
    const title = el("div", "", "blog-title");
    const excerpt = el("div", "", "blog-excerpt");

    setText(date, p.date);
    setText(title, p.title);
    setText(excerpt, p.excerpt);

    left.appendChild(date);
    left.appendChild(title);
    left.appendChild(excerpt);

    const tag = el("span", "", "blog-tag");
    setText(tag, p.tag);

    const arrow = el("span", "→", "blog-arrow");
    arrow.setAttribute("aria-hidden", "true");

    item.appendChild(left);
    item.appendChild(tag);
    item.appendChild(arrow);
    list.appendChild(item);
  });
}
