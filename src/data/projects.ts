// Project data for the portfolio, sourced from real GitHub repos
// (github.com/brycejensen540). Edit entries here and both the Home
// teaser and the Projects page update automatically.

export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Deployed URL if one exists; set to "#" while there's no live version. */
  liveUrl: string;
  /** Real repository URL ("Code" link). */
  codeUrl: string;
  /** Tints the placeholder graphic teal or orange. */
  tone: 'teal' | 'orange';
  /** Featured projects are shown on the Home page teaser. */
  featured: boolean;
}

export const projects: Project[] = [
  {
    title: 'Apollo Professional',
    description:
      'A premium, conversion-focused website for a Chicago window and exterior cleaning company — rebuilt from the ground up with the real brand, photography, and local SEO baked in.',
    tags: ['Astro', 'Tailwind CSS', 'TypeScript'],
    liveUrl: 'https://apollo-professional.pages.dev',
    codeUrl: 'https://github.com/brycejensen540/apollo-professional',
    tone: 'orange',
    featured: true,
  },
  {
    title: 'DNStest',
    description:
      'A fast command-line tool that measures DNS resolver response times — clean tables, JSON output, and exit codes made for scripting.',
    tags: ['Python', 'CLI', 'DNS'],
    liveUrl: 'https://dnstest-dyh.pages.dev',
    codeUrl: 'https://github.com/brycejensen540/DNStest',
    tone: 'teal',
    featured: true,
  },
  {
    title: 'Pulse Geometry',
    description:
      'A psychedelic, trance-like geometric visualizer — glowing shapes that pulse and morph in real time, with a drag-to-spin camera and a 5-minute inactivity freeze.',
    tags: ['TypeScript', 'Vite', 'Canvas'],
    liveUrl: 'https://pulse-geometry.pages.dev',
    codeUrl: 'https://github.com/brycejensen540/shapes',
    tone: 'orange',
    featured: true,
  },
];
