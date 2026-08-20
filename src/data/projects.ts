// Placeholder project data for the v1 portfolio.
// Replace entries here and both the Home teaser and the Projects page
// will update automatically (nothing else needs to change).

export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Placeholder URLs for now — point these at real deployments and repos. */
  liveUrl: string;
  codeUrl: string;
  /** Tints the placeholder graphic teal or orange. */
  tone: 'teal' | 'orange';
  /** Featured projects are shown on the Home page teaser. */
  featured: boolean;
}

export const projects: Project[] = [
  {
    title: 'Lumen',
    description:
      'A local-first note-taking app for people who think in scattered fragments. Markdown in, tidy graphs out.',
    tags: ['TypeScript', 'Svelte', 'SQLite'],
    liveUrl: '#',
    codeUrl: '#',
    tone: 'teal',
    featured: true,
  },
  {
    title: 'Harbor',
    description:
      'A single dashboard for every service you run: health, logs, and one-click deploys. Built to answer “is it up?” in one glance.',
    tags: ['React', 'Node.js', 'Docker'],
    liveUrl: '#',
    codeUrl: '#',
    tone: 'orange',
    featured: true,
  },
  {
    title: 'Gridfolio',
    description:
      'A tiny, framework-free portfolio kit that ships a full site in minutes. This very layout is a distant cousin of it.',
    tags: ['Astro', 'Tailwind CSS', 'MDX'],
    liveUrl: '#',
    codeUrl: '#',
    tone: 'teal',
    featured: true,
  },
  {
    title: 'Pulse',
    description:
      'A terminal habit tracker. Set a habit, stay honest, and let the streak carry you.',
    tags: ['Rust', 'SQLite'],
    liveUrl: '#',
    codeUrl: '#',
    tone: 'orange',
    featured: false,
  },
  {
    title: 'Range',
    description:
      'Async standups and weekly retros without the meeting overhead. Written with remote teams in mind.',
    tags: ['TypeScript', 'Next.js', 'Postgres'],
    liveUrl: '#',
    codeUrl: '#',
    tone: 'teal',
    featured: false,
  },
  {
    title: 'Drift',
    description:
      'A quiet menubar weather app that gives you the forecast in two seconds flat.',
    tags: ['Swift', 'SwiftUI'],
    liveUrl: '#',
    codeUrl: '#',
    tone: 'orange',
    featured: false,
  },
];