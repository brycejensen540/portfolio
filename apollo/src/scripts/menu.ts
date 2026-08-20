// Mobile navigation: hamburger toggle + collapsible submenus.
// The desktop nav is pure CSS (hover/focus); this only runs on the
// mobile panel where disclosure buttons are used.

function toggleMenu(open: boolean): void {
  const panel = document.getElementById('mobile-menu');
  const button = document.getElementById('menu-toggle');
  if (!panel || !button) return;

  panel.classList.toggle('hidden', !open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const panel = document.getElementById('mobile-menu');

  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isOpen);
  });

  // Collapsible "Services" / "Service Areas" groups inside the panel.
  panel?.querySelectorAll<HTMLButtonElement>('.mobile-submenu-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const target = document.getElementById(btn.getAttribute('aria-controls') ?? '');
      btn.setAttribute('aria-expanded', String(!expanded));
      target?.classList.toggle('hidden', expanded);
    });
  });

  // Close the panel when a top-level link is chosen.
  panel?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });
});
