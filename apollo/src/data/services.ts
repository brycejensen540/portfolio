// All five services offered by Apollo Professional.
// Each entry powers a generated page at /services/<slug> and its
// card in the services grid.

import { images } from './images';

/** Topics supported by the PlaceholderImage component. */
export type ImageTopic =
  | 'window'
  | 'gutter'
  | 'screen'
  | 'repair'
  | 'pressure'
  | 'sparkle'
  | 'team'
  | 'map';

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  /** Small label shown above the page heading. */
  eyebrow: string;
  /** Main page heading. */
  title: string;
  /** Unique meta description for the page. */
  metaDescription: string;
  /** Hero paragraph — the conversion opener. */
  intro: string;
  /** Supporting body paragraphs. */
  body: string[];
  /** Bullet benefits shown on the page and the home cards. */
  benefits: string[];
  /** Optional FAQ entries (only where the live site has them). */
  faqs?: { question: string; answer: string }[];
  /** One-liner used on cards and in JSON-LD. */
  shortDescription: string;
  /** Topic used to pick the placeholder artwork when no photo exists. */
  imageTopic: ImageTopic;
  /** Path to the real service photo (from /public/images). */
  image: string;
  /** Homepage "featured" ordering (only three are featured). */
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: 'window-cleaning',
    name: 'Window Cleaning',
    shortName: 'Window Cleaning',
    eyebrow: 'Our Services',
    title: 'Crystal-Clear Windows With Every Clean',
    metaDescription:
      'Spotless, streak-free window cleaning services in Chicago, IL and surrounding areas. Interior and exterior, residential and commercial. Call Apollo Professional at (773) 600-1308.',
    intro:
      'Dirty, streaky windows block natural light, dull your view, and make your home or business look neglected. Hard water spots, pollen, and grime build up quickly — and are frustrating to remove on your own. At Apollo Professional, we offer professional window cleaning services in and around Chicago, IL with precision and care. Our team ensures every corner and frame is spotless, using methods that enhance curb appeal and let the light back in.',
    body: [
      'Windows are one of the first things people notice about your home or business. When they are streaked, dusty, or covered in grime, it affects both appearance and comfort. Using specialized tools and techniques, our professional window cleaners remove stubborn dirt, road salt, and environmental buildup — inside and out.',
      'We provide window cleaning services for buildings under four floors, with a team equipped to handle the job safely and efficiently. We focus on every detail, from frames to corners, so your windows look their absolute best. Clean windows improve natural light and enhance your view, and we tailor our approach to fit your property. The result: windows that are spotless, streak-free, and brilliant after every service.',
    ],
    benefits: [
      'Streak-free finish every time',
      'Cleans frames and corners thoroughly',
      'Improves natural light indoors',
      'Safe for all window types',
      'Interior and exterior service for buildings up to four floors',
    ],
    shortDescription:
      'Spotless, streak-free windows for residential and select commercial properties.',
    imageTopic: 'window',
    image: images.services['window-cleaning'],
    featured: true,
  },
  {
    slug: 'gutter-cleaning',
    name: 'Gutter Cleaning',
    shortName: 'Gutter Cleaning',
    eyebrow: 'Our Services',
    title: 'Keep Your Gutters Flowing Smoothly',
    metaDescription:
      'Reliable gutter cleaning services in Chicago, IL and surrounding areas. Clear debris, prevent clogs and water damage. Call Apollo Professional at (773) 600-1308.',
    intro:
      'Clogged gutters can lead to water overflow, roof damage, and costly repairs. Seasonal debris and heavy rains make keeping them clear a real challenge. Our gutter cleaning services in and around Chicago, IL provide the thorough, reliable care your home needs — we remove all debris, check for blockages, and ensure proper water flow.',
    body: [
      'Your gutters work hard to protect your home from water damage, but once clogged they can cause serious problems. We go beyond a quick sweep: leaves, dirt, and debris are removed while we check that water drains properly through the system. Our local team knows how to handle seasonal buildup through Chicago’s heavy rains and freeze-thaw cycles.',
      'By keeping your gutters clear, you avoid costly repairs to your roof, foundation, and landscaping. Our process is safe, efficient, and designed to extend the life of your gutters — whether it is a routine cleaning or a post-storm emergency. Let us handle the dirty work so you can enjoy a clean, well-maintained exterior all year long.',
    ],
    benefits: [
      'Removes leaves and built-up debris',
      'Prevents roof and foundation damage',
      'Maintains smooth water drainage',
      'Local, reliable seasonal service',
    ],
    shortDescription:
      'Clear gutters, protected foundation — debris removed and drainage verified.',
    imageTopic: 'gutter',
    image: images.services['gutter-cleaning'],
    featured: true,
  },
  {
    slug: 'screen-cleaning',
    name: 'Screen Cleaning',
    shortName: 'Screen Cleaning',
    eyebrow: 'Our Services',
    title: 'Cleaner Screens for Clearer Everyday Living',
    metaDescription:
      'Professional window screen cleaning service in Chicago, IL. Remove dust, pollen, and buildup for better airflow and brighter rooms. Call (773) 600-1308.',
    intro:
      'Dirty and clogged window screens are one of the most common frustrations homeowners face, especially after long winters and high pollen seasons. Dust, debris, and grime build up quickly, blocking airflow and making freshly cleaned windows still look dull. Many people try to clean screens on their own, only to end up with bent frames, torn mesh, or residue that never fully comes out.',
    body: [
      'When screens stay dirty, the problem grows. Poor airflow can make rooms feel stuffy, allergens remain trapped in the mesh, and natural light is reduced throughout the home. Over time, buildup can also shorten the usable life of your screens, leading to avoidable replacements.',
      'Our reliable window screen cleaning service is designed for residential properties. We carefully remove each screen, wash both sides to clear embedded debris, and reinstall them once fully clean. Our team is known for showing up as scheduled and paying close attention to corners and edges others miss — restoring comfort, airflow, and clear views.',
    ],
    benefits: [
      'Full screen removal for a thorough wash',
      'Detailed mesh cleaning of corners and edges',
      'Clean, secure reinstallation',
      'Flexible scheduling for homeowners and HOAs',
      'Consistent results — better airflow, brighter rooms',
    ],
    faqs: [
      {
        question: 'What is included in your window screen cleaning service?',
        answer:
          'We remove each screen, wash both sides to remove embedded debris, and reinstall them once clean and dry.',
      },
      {
        question: 'Do you clean screens for multi-story homes?',
        answer:
          'Yes. We service residential properties up to four floors, including ranch homes and low-rise buildings.',
      },
      {
        question: 'Can screen cleaning be combined with other services?',
        answer:
          'Yes. Many customers pair screen cleaning with window cleaning, gutter cleaning, or power washing for a complete exterior refresh.',
      },
      {
        question: 'How often should window screens be cleaned?',
        answer:
          'Most homeowners benefit from annual cleaning, especially after winter and pollen seasons.',
      },
      {
        question: 'Do you serve HOAs and real estate agents?',
        answer:
          'Yes. We regularly work with HOAs and real estate professionals throughout the area to maintain clean, presentable properties.',
      },
    ],
    shortDescription:
      'Restore airflow and brightness with a detailed screen cleaning service.',
    imageTopic: 'screen',
    image: images.services['screen-cleaning'],
    featured: true,
  },
  {
    slug: 'screen-repair',
    name: 'Screen Repair',
    shortName: 'Screen Repair',
    eyebrow: 'Our Services',
    title: 'Fix Torn Screens and Restore Comfort',
    metaDescription:
      'Window screen repair service in Chicago, IL. Fix tears, loose mesh, and fitting issues to keep bugs out and air moving. Call Apollo Professional at (773) 600-1308.',
    intro:
      'Torn, bent, or loose window screens are a common issue for homeowners. Screens take a beating from weather, pets, and everyday use — and once damaged, they stop doing their job. Holes let insects inside, warped frames prevent windows from opening properly, and broken screens reduce airflow during warmer months. Many homeowners delay repairs because quick fixes rarely hold up.',
    body: [
      'When screens are left damaged, the inconvenience grows. Bugs enter the home, fresh air is restricted, and windows feel less usable. For homeowners preparing for seasonal changes, hosting guests, or working with real estate agents, damaged screens can make an otherwise well-kept home feel neglected. Over time, small tears often turn into full replacements that could have been avoided.',
      'Our window screen repair service provides a dependable solution. We assess each screen, repair or replace mesh as needed, and ensure frames fit securely back in place. When repairs are no longer practical, we also offer replacement options tailored to your windows. Known for reliability and attention to detail, we show up as scheduled and complete the work with care.',
    ],
    benefits: [
      'Mesh repair and replacement for holes and tears',
      'Frame adjustments for smooth window operation',
      'Screen replacement options when repairs are not enough',
      'Secure reinstallation — fitted and tested before we leave',
    ],
    faqs: [
      {
        question: 'What types of screen damage can you repair?',
        answer:
          'We repair small to moderate tears, loose mesh, and fitting issues. We also replace screens when damage is too extensive.',
      },
      {
        question: 'Do you offer full screen replacements?',
        answer:
          'Yes. Our window screen replacement service is available when repairs are no longer practical.',
      },
      {
        question: 'Can you install new screens on existing windows?',
        answer:
          'Yes. We provide window screen installation for new or upgraded screens.',
      },
      {
        question: 'Who do you typically serve?',
        answer:
          'We work with homeowners, HOAs, and real estate agents throughout the greater Chicago area.',
      },
      {
        question: 'How do I know if I need repair or replacement?',
        answer:
          'We inspect each screen and recommend the most practical option based on its condition and how it is used.',
      },
    ],
    shortDescription:
      'Repair torn or loose screens to keep bugs out and fresh air moving.',
    imageTopic: 'repair',
    image: images.services['screen-repair'],
  },
  {
    slug: 'power-washing',
    name: 'Power Washing',
    shortName: 'Power Washing',
    eyebrow: 'Our Services',
    title: 'Restore Your Surfaces to Like-New Condition',
    metaDescription:
      'Power washing services in Chicago, IL and surrounding areas. Remove dirt, mold, and stains from driveways, patios, and siding. Call (773) 600-1308.',
    intro:
      'Outdoor surfaces take a beating from weather, traffic, and everyday wear, leaving them stained, discolored, and unattractive. Dirt, mold, and grime not only look bad — they can damage your property over time. Our power washing services in and around Chicago, IL remove built-up contaminants and restore surfaces to their original beauty.',
    body: [
      'Over time, driveways, patios, siding, and walkways accumulate dirt, mildew, and stains that regular cleaning simply cannot remove. As a trusted pressure washing company, we specialize in residential power washing services tailored to your needs — from driveway and concrete cleaning to vinyl siding, flagstone, and patios.',
      'For heavily soiled areas, our high-pressure cleaning cuts through stubborn buildup without damaging your property, revitalizing surfaces and extending their lifespan. Whether you are preparing your home for sale, enhancing your business exterior, or maintaining your property’s value, our methods are safe, efficient, and environmentally conscious — so your exterior looks cleaner, lasts longer, and makes a stronger first impression.',
    ],
    benefits: [
      'Removes dirt, mold, and stubborn stains',
      'Driveways, patios, siding, and walkways',
      'Safe for vinyl siding, flagstone, and concrete',
      'Revitalizes surfaces and extends their lifespan',
    ],
    shortDescription:
      'Deep-clean driveways, patios, siding, and walkways with safe, effective pressure washing.',
    imageTopic: 'pressure',
    image: images.services['power-washing'],
  },
];

/** Helper for the services grid / page generation. */
export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
