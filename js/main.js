import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { initTypewriter } from "./typewriter.js";
import { initStats } from "./stats.js";
import { initProjects } from "./projects.js";
import { initBlog } from "./blog.js";

initTheme();

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initStats();
  initProjects();
  initBlog();

  initTypewriter("typed", [
    "Full-Stack Developer.",
    "API Architect.",
    "Performance Optimizer.",
    "Open Source Contributor.",
    "Problem Solver.",
  ]);
});
