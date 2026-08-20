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
    title: 'TicTacToe',
    description:
      'A simple command-line Tic Tac Toe game, playable start to finish in the terminal.',
    tags: ['Java'],
    liveUrl: '#',
    codeUrl: 'https://github.com/brycejensen540/TicTacToe',
    tone: 'teal',
    featured: true,
  },
  {
    title: 'MyWebServer',
    description:
      'A generic web server that handles HTML and plain-text file requests, written in Java.',
    tags: ['Java', 'Networking'],
    liveUrl: '#',
    codeUrl: 'https://github.com/brycejensen540/MyWebServer',
    tone: 'orange',
    featured: true,
  },
  {
    title: 'DNStest',
    description:
      'A simple DNS script for testing response times from the command line.',
    tags: ['Shell', 'DNS'],
    liveUrl: '#',
    codeUrl: 'https://github.com/brycejensen540/DNStest',
    tone: 'teal',
    featured: true,
  },
  {
    title: 'deleteOldTweets',
    description:
      'A script to get rid of old Twitter history.',
    tags: ['JavaScript', 'Scripting'],
    liveUrl: '#',
    codeUrl: 'https://github.com/brycejensen540/deleteOldTweets',
    tone: 'orange',
    featured: false,
  },
  {
    title: 'ReadCSVfile',
    description:
      'A simple Java program to read and parse CSV files.',
    tags: ['Java', 'CSV'],
    liveUrl: '#',
    codeUrl: 'https://github.com/brycejensen540/ReadCSVfile',
    tone: 'teal',
    featured: false,
  },
  {
    title: 'BlockchainExample',
    description:
      'A simple example of how a blockchain can be implemented in Java.',
    tags: ['Java', 'Blockchain'],
    liveUrl: '#',
    codeUrl: 'https://github.com/brycejensen540/BlockchainExample',
    tone: 'orange',
    featured: false,
  },
];