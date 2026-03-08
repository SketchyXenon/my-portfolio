function safeUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:")
      return trimmed;
  } catch (e) {}
  console.warn("[security] Blocked unsafe URL:", trimmed);
  return null;
}

function setText(el, value) {
  el.textContent = String(value ?? "");
}

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function safeLink(url, className) {
  const href = safeUrl(url);
  if (!href) return null;
  const a = document.createElement("a");
  a.href = href;
  if (className) a.className = className;
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  if (isExternal) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}

function safeSvg({
  viewBox,
  width,
  height,
  paths = [],
  extras = [],
  stroke = false,
}) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("aria-hidden", "true");
  if (stroke) {
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
  } else {
    svg.setAttribute("fill", "currentColor");
  }
  paths.forEach(function (d) {
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
  });
  if (extras.length) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg">' + extras.join("") + "</svg>",
      "image/svg+xml",
    );
    doc.documentElement.childNodes.forEach(function (child) {
      svg.appendChild(document.importNode(child, true));
    });
  }
  return svg;
}
function initTheme() {
  const html = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const label = document.getElementById("theme-label");

  function applyTheme(dark) {
    html.setAttribute("data-theme", dark ? "dark" : "light");
    if (icon) icon.textContent = dark ? "☀️" : "🌙";
    if (label) label.textContent = dark ? "light" : "dark";
  }

  try {
    const saved = localStorage.getItem("portfolio-theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved ? saved === "dark" : sysDark);
  } catch (e) {
    applyTheme(true);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      const dark = html.getAttribute("data-theme") !== "dark";
      applyTheme(dark);
      try {
        localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
      } catch (e) {}
    });
  }
}
function initNav() {
  const nav = document.getElementById("nav");
  const navAnchors = document.querySelectorAll(".nav-links a");
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("mobile-drawer");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener(
    "scroll",
    function () {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );

  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + entry.target.id,
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach(function (s) {
    navObserver.observe(s);
  });

  if (hamburger && drawer) {
    hamburger.addEventListener("click", function () {
      const open = hamburger.classList.toggle("open");
      drawer.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", String(open));
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        hamburger.classList.remove("open");
        drawer.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }
}
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  els.forEach(function (el) {
    observer.observe(el);
  });
}
function initTypewriter(elementId, phrases, options) {
  const el = document.getElementById(elementId);
  if (!el) return;
  options = options || {};
  const typeSpeed = options.typeSpeed || 70;
  const deleteSpeed = options.deleteSpeed || 35;
  const pauseAfter = options.pauseAfter || 2200;
  const pauseBefore = options.pauseBefore || 600;

  let pIdx = 0,
    cIdx = 0,
    deleting = false;

  function tick() {
    const phrase = phrases[pIdx];
    if (deleting) {
      cIdx--;
      el.textContent = phrase.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, pauseBefore);
      } else {
        setTimeout(tick, deleteSpeed);
      }
    } else {
      cIdx++;
      el.textContent = phrase.slice(0, cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, pauseAfter);
      } else {
        setTimeout(tick, typeSpeed);
      }
    }
  }
  setTimeout(tick, pauseBefore);
}
function initStats() {
  const els = document.querySelectorAll(".stat-val[data-target]");
  if (!els.length) return;
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || "";
        const start = performance.now();
        const dur = 1500;
        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(ease * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  els.forEach(function (el) {
    observer.observe(el);
  });
}
function buildGithubIcon() {
  return safeSvg({
    viewBox: "0 0 24 24",
    width: 13,
    height: 13,
    paths: [
      "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z",
    ],
  });
}

function buildExternalIcon() {
  return safeSvg({
    viewBox: "0 0 24 24",
    width: 12,
    height: 12,
    stroke: true,
    paths: ["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"],
    extras: [
      '<polyline points="15,3 21,3 21,9"/>',
      '<line x1="10" y1="14" x2="21" y2="3"/>',
    ],
  });
}

function buildCard(p) {
  const card = el("div", "", "project-card");
  const top = el("div", "", "card-top");
  const icon = el("div", "", "card-icon");
  icon.textContent = typeof p.icon === "string" ? p.icon.slice(0, 4) : "📁";

  const links = el("div", "", "card-links");

  const githubHref = safeUrl(p.github);
  if (githubHref) {
    const a = safeLink(githubHref, "card-link");
    if (a) {
      a.title = "View on GitHub";
      a.setAttribute("aria-label", String(p.title) + " GitHub repository");
      a.appendChild(buildGithubIcon());
      links.appendChild(a);
    }
  }
  const demoHref = safeUrl(p.demo);
  if (demoHref) {
    const a = safeLink(demoHref, "card-link");
    if (a) {
      a.title = "View live demo";
      a.setAttribute("aria-label", String(p.title) + " live demo");
      a.appendChild(buildExternalIcon());
      links.appendChild(a);
    }
  }

  top.appendChild(icon);
  top.appendChild(links);

  const body = el("div", "", "card-body");
  const title = el("div", "", "card-title");
  const desc = el("div", "", "card-desc");
  const tech = el("div", "", "card-tech");

  setText(title, p.title);
  setText(desc, p.desc);

  if (Array.isArray(p.tech)) {
    p.tech.forEach(function (t) {
      const tag = el("span", "", "tech-tag");
      setText(tag, t);
      tech.appendChild(tag);
    });
  }

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(tech);
  card.appendChild(top);
  card.appendChild(body);
  return card;
}

function initProjects() {
  const projects = window.PROJECTS || [];
  const filterBar = document.getElementById("filter-bar");
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  let activeFilter = "All";

  const allTags = ["All"];
  projects.forEach(function (p) {
    if (Array.isArray(p.tech)) {
      p.tech.forEach(function (t) {
        if (!allTags.includes(String(t))) allTags.push(String(t));
      });
    }
  });

  if (filterBar) {
    allTags.forEach(function (tag) {
      const btn = el(
        "button",
        tag,
        "filter-btn" + (tag === "All" ? " active" : ""),
      );
      btn.addEventListener("click", function () {
        filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        activeFilter = tag;
        render();
      });
      filterBar.appendChild(btn);
    });
  }

  function render() {
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    const list =
      activeFilter === "All"
        ? projects
        : projects.filter(function (p) {
            return Array.isArray(p.tech) && p.tech.includes(activeFilter);
          });
    list.forEach(function (p) {
      grid.appendChild(buildCard(p));
    });
  }

  render();
}
function initBlog() {
  const posts = window.POSTS || [];
  const list = document.getElementById("blog-list");
  if (!list) return;

  while (list.firstChild) list.removeChild(list.firstChild);

  posts.forEach(function (p) {
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

function initEmail() {
  const u = "johnrayabenasa";
  const d = "gmail.com";
  const email = u + "@" + d;
  const links = document.querySelectorAll("[data-email]");
  links.forEach(function (el) {
    el.href = "mailto:" + email;
    el.textContent = email;
  });
}
initTheme();

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initReveal();
  initStats();
  initProjects();
  initBlog();
  initEmail();

  initTypewriter("typed", [
    "Full-Stack Developer.",
    "API Architect.",
    "Performance Optimizer.",
    "Open Source Contributor.",
    "Problem Solver.",
  ]);
});
