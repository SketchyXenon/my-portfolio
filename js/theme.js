export function initTheme() {
  const html = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  const label = document.getElementById("theme-label");

  function applyTheme(dark) {
    html.setAttribute("data-theme", dark ? "dark" : "light");
    if (icon) icon.textContent = dark ? "☀️" : "🌙";
    if (label) label.textContent = dark ? "light" : "dark";
  }
  const saved = localStorage.getItem("portfolio-theme");
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved ? saved === "dark" : sysDark;
  applyTheme(isDark);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const dark = html.getAttribute("data-theme") !== "dark";
      applyTheme(dark);
      localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("portfolio-theme")) applyTheme(e.matches);
    });
}
