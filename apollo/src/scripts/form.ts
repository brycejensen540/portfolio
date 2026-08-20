// Small enhancement for the static contact form. Because the site has
// no backend, submitting composes a pre-filled email to the company
// address in the visitor's own mail app — and always offers the phone
// as the fastest alternative.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quote-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const service = String(data.get('service') ?? '');
    const message = String(data.get('message') ?? '').trim();

    const subject = encodeURIComponent(`Cleaning quote request — ${service}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Service: ${service}`,
        '',
        message,
        '',
        '— sent from the Apollo Professional website',
      ].join('\n')
    );

    const email = form.dataset.email ?? '';
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
});
