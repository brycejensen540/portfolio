// Mobile navigation toggle (hamburger menu).
//
// The nav starts with Tailwind's `hidden` utility on small screens and is
// shown/hidden by toggling that class. On `lg` screens Tailwind's `lg:flex`
// always wins, so this only affects mobile.

const toggleButton = document.querySelector<HTMLButtonElement>('#menu-toggle');
const nav = document.querySelector<HTMLElement>('#site-nav');

if (toggleButton && nav) {
  const setOpen = (open: boolean) => {
    nav.classList.toggle('hidden', !open);
    toggleButton.setAttribute('aria-expanded', String(open));
    toggleButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggleButton.addEventListener('click', () => {
    setOpen(nav.classList.contains('hidden'));
  });

  // Close the menu as soon as a link is chosen (mobile behaviour).
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}