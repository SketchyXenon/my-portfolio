
/**
 * Validate a URL is safe to use in an href.
 * Allows: https://, http://, and root-relative paths (/...).
 * Rejects: javascript:, data:, vbscript:, and anything else.
 *
 * @param  {string} url
 * @returns {string|null}  The original url if safe, null otherwise.
 */
export function safeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  // Allow root-relative paths like /blog/my-post
  if (trimmed.startsWith('/')) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed;
    }
  } catch {
    // URL constructor threw — not a valid absolute URL
  }
  console.warn(`[security] Blocked unsafe URL: "${trimmed}"`);
  return null;
}

/**
 * Create a text node safely — no HTML interpretation at all.
 *
 * @param  {string} value
 * @returns {Text}
 */
export function safeText(value) {
  return document.createTextNode(String(value ?? ''));
}

/**
 * Set the textContent of an element, discarding any HTML.
 *
 * @param {HTMLElement} el
 * @param {string}      value
 */
export function setText(el, value) {
  el.textContent = String(value ?? '');
}

/**
 * Create an <a> element with a validated href.
 * External links automatically get target="_blank" and
 * rel="noopener noreferrer".
 *
 * @param {string}   url
 * @param {string}   [className]
 * @param {string}   [title]
 * @returns {HTMLAnchorElement|null}  null if url is unsafe.
 */
export function safeLink(url, className = '', title = '') {
  const href = safeUrl(url);
  if (!href) return null;

  const a = document.createElement('a');
  a.href = href;
  if (className) a.className = className;
  if (title)     a.title     = title;

  // External links open in new tab with security attrs
  const isExternal = href.startsWith('http://') || href.startsWith('https://');
  if (isExternal) {
    a.target = '_blank';
    a.rel    = 'noopener noreferrer';
  }

  return a;
}

/**
 * Create a DOM element, set text content, and optionally add a class.
 *
 * @param {string} tag
 * @param {string} [text]
 * @param {string} [className]
 * @returns {HTMLElement}
 */
export function el(tag, text = '', className = '') {
  const node = document.createElement(tag);
  if (text)      node.textContent = text;
  if (className) node.className   = className;
  return node;
}

/**
 * Build an inline SVG element safely via createElementNS.
 * Avoids injecting SVG markup as a string.
 *
 * @param {object} opts
 * @param {string}   opts.viewBox
 * @param {number}   opts.width
 * @param {number}   opts.height
 * @param {string[]} opts.paths    — array of 'd' attribute strings for <path>
 * @param {string[]} [opts.extras] — raw SVG child element strings (polyline, line, circle)
 *                                   parsed through DOMParser in a sandboxed SVG document.
 * @param {boolean}  [opts.stroke] — use stroke instead of fill
 * @returns {SVGSVGElement}
 */
export function safeSvg({ viewBox, width, height, paths = [], extras = [], stroke = false }) {
  const NS  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width',   String(width));
  svg.setAttribute('height',  String(height));
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');

  if (stroke) {
    svg.setAttribute('fill',         'none');
    svg.setAttribute('stroke',       'currentColor');
    svg.setAttribute('stroke-width', '2');
  } else {
    svg.setAttribute('fill', 'currentColor');
  }

  paths.forEach((d) => {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  });


  if (extras.length) {
    const parser  = new DOMParser();
    const wrapper = `<svg xmlns="http://www.w3.org/2000/svg">${extras.join('')}</svg>`;
    const doc     = parser.parseFromString(wrapper, 'image/svg+xml');
    doc.documentElement.childNodes.forEach((child) => {
      svg.appendChild(document.importNode(child, true));
    });
  }

  return svg;
}
