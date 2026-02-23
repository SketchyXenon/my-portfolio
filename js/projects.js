
import { safeUrl, safeLink, setText, el, safeSvg } from './security.js';


function buildGithubIcon() {
  return safeSvg({
    viewBox: '0 0 24 24', width: 13, height: 13,
    paths: [
      'M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 ' +
      '0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462' +
      '-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832' +
      '.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683' +
      '-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 ' +
      '0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 ' +
      '1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 ' +
      '2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z',
    ],
  });
}

function buildExternalIcon() {
  return safeSvg({
    viewBox: '0 0 24 24', width: 12, height: 12, stroke: true,
    paths: ['M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6'],
    extras: ['<polyline points="15,3 21,3 21,9"/>', '<line x1="10" y1="14" x2="21" y2="3"/>'],
  });
}

function buildCard(p) {
  const card = el('div', '', 'project-card');

  // Top row
  const top  = el('div', '', 'card-top');
  const icon = el('div', '', 'card-icon');
  icon.textContent = typeof p.icon === 'string' ? p.icon.slice(0, 4) : '📁';

  const links = el('div', '', 'card-links');

  const githubHref = safeUrl(p.github);
  if (githubHref) {
    const a = safeLink(githubHref, 'card-link');
    if (a) {
      a.title = 'View on GitHub';
      a.setAttribute('aria-label', `${String(p.title)} GitHub repository`);
      a.appendChild(buildGithubIcon());
      links.appendChild(a);
    }
  }

  const demoHref = safeUrl(p.demo);
  if (demoHref) {
    const a = safeLink(demoHref, 'card-link');
    if (a) {
      a.title = 'View live demo';
      a.setAttribute('aria-label', `${String(p.title)} live demo`);
      a.appendChild(buildExternalIcon());
      links.appendChild(a);
    }
  }

  top.appendChild(icon);
  top.appendChild(links);

  const body  = el('div', '', 'card-body');
  const title = el('div', '', 'card-title');
  const desc  = el('div', '', 'card-desc');
  const tech  = el('div', '', 'card-tech');

  setText(title, p.title);
  setText(desc,  p.desc);

  if (Array.isArray(p.tech)) {
    p.tech.forEach((t) => {
      const tag = el('span', '', 'tech-tag');
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



export function initProjects() {
  const projects  = window.PROJECTS || [];
  const filterBar = document.getElementById('filter-bar');
  const grid      = document.getElementById('projects-grid');
  if (!grid) return;

  let activeFilter = 'All';

  const allTags = ['All', ...new Set(
    projects.flatMap((p) => Array.isArray(p.tech) ? p.tech.map(String) : [])
  )];


  if (filterBar) {
    allTags.forEach((tag) => {
      const btn = el('button', tag, `filter-btn${tag === 'All' ? ' active' : ''}`);
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = tag;
        render();
      });
      filterBar.appendChild(btn);
    });
  }

  function render() {
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    const list = activeFilter === 'All'
      ? projects
      : projects.filter((p) => Array.isArray(p.tech) && p.tech.includes(activeFilter));
    list.forEach((p) => grid.appendChild(buildCard(p)));
  }

  render();
}
