// Subtle fade-in for elements marked with [data-reveal].
//
// Only runs when JS is enabled: an inline script in BaseLayout.astro adds the
// `js` class to <html>, and global.css only hides elements under `html.js`.
// Elements near the top of the page reveal immediately, which gives the
// short, restrained fade-in on page load.

const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => observer.observe(element));