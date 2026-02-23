/* ================================================================
   js/main.js — Entry Point
   Initialises every module in the correct order.
   security.js is a shared utility imported by projects/blog.
   ================================================================ */

import { initTheme }      from './theme.js';
import { initNav }        from './nav.js';
import { initReveal }     from './reveal.js';
import { initTypewriter } from './typewriter.js';
import { initStats }      from './stats.js';
import { initProjects }   from './projects.js';
import { initBlog }       from './blog.js';

// Runs before first paint — prevents flash of wrong theme
initTheme();

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initStats();
  initProjects();
  initBlog();

  initTypewriter('typed', [
    'Full-Stack Developer.',
    'API Architect.',
    'Performance Optimizer.',
    'Open Source Contributor.',
    'Problem Solver.',
  ]);
});
