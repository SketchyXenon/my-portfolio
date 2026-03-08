export function initTypewriter(elementId, phrases, options = {}) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const {
    typeSpeed = 70,
    deleteSpeed = 35,
    pauseAfter = 2200,
    pauseBefore = 600,
  } = options;

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
