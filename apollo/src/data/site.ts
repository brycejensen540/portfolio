// Central company information. Change it here and it updates
// everywhere: header, footer, contact page, and SEO metadata.

export const site = {
  name: 'Apollo Professional',
  tagline: 'Detail-focused. Client-driven. Actually clean.',
  description:
    'We don’t just clean windows so they look clean — we clean them so they are clean. Detail-focused window cleaning, gutters, screens, and pressure washing in Chicago, IL and the surrounding suburbs.',

  // Primary contact — this is the number every page points to.
  phone: '(773) 600-1308',
  phoneHref: 'tel:+17736001308',
  email: 'apolloprofessional1@gmail.com',
  emailHref: 'mailto:apolloprofessional1@gmail.com',

  address: 'Chicago, IL',
  radius: 'within a 30-mile radius of Chicago',

  // Owner / operator (only Eric — Keven is no longer with the company).
  owner: 'Eric',

  hours: {
    weekdays: 'Mon–Fri: 8:00 am – 10:00 pm',
    weekends: 'Sat–Sun: 10:00 am – 10:00 pm',
  },

  rating: {
    score: '5.0',
    count: '33+',
    label: 'Over 33 Happy Customers',
  },

  url: 'https://www.apolloprofessional.net',
} as const;
