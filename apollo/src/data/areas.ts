// Service areas. The overview page lists every community we serve;
// the five with a `slug` get their own dedicated page under /areas/<slug>.
// Content for the dedicated pages mirrors the company's current website,
// with all contact details normalized to the primary number (773) 600-1308.

export type Area = {
  name: string;
  /** When present, this area gets a generated page at /areas/<slug>. */
  slug?: string;
};

/** The full list of communities served (from the company's website). */
export const allAreas: Area[] = [
  { name: 'Chicago, IL', slug: 'chicago' },
  { name: 'Evanston, IL', slug: 'evanston' },
  { name: 'Oak Park, IL', slug: 'oak-park' },
  { name: 'La Grange, IL', slug: 'la-grange' },
  { name: 'Hinsdale, IL', slug: 'hinsdale' },
  { name: 'Palos Hills, IL' },
  { name: 'Hickory Hills, IL' },
  { name: 'Glen Ellyn, IL' },
  { name: 'Wilmette, IL' },
  { name: 'Skokie, IL' },
  { name: 'Kenilworth, IL' },
  { name: 'Highland Park, IL' },
  { name: 'Glenview, IL' },
  { name: 'Glencoe, IL' },
  { name: 'Des Plaines, IL' },
  { name: 'Deerfield, IL' },
];

export type AreaPage = {
  slug: string;
  name: string;
  /** Unique meta description for the page. */
  metaDescription: string;
  /** Small label above the heading. */
  eyebrow: string;
  /** Main page heading. */
  title: string;
  /** Hero paragraph — the conversion opener. */
  intro: string;
  /** Supporting body paragraphs. */
  body: string[];
  /** Optional local tips / highlights section. */
  tips?: { title: string; description: string }[];
  /** Optional list of services emphasized for this area. */
  services?: { title: string; description: string }[];
};

export const areaPages: AreaPage[] = [
  {
    slug: 'chicago',
    name: 'Chicago, IL',
    metaDescription:
      'Window washing, exterior cleaning, and pressure washing for Chicago, IL homes and businesses. Lakefront and urban conditions handled by Apollo Professional. Call (773) 600-1308.',
    eyebrow: 'Service Area',
    title: 'Restore Clarity With Window Washing in Chicago',
    intro:
      'Chicago’s lakefront location and urban environment create unique challenges for property owners. Salt spray from Lake Michigan mixes with city dust, diesel exhaust, and seasonal pollen to leave windows streaked and hazy within weeks of cleaning. Winter freeze-thaw cycles deposit mineral residue on glass, while spring storms coat skylights and upper-story windows with grime that is difficult to reach. Apollo Professional addresses these specific conditions with interior and exterior window cleaning tailored to the demands of Chicago properties.',
    body: [
      'We serve residential homes and commercial buildings throughout Chicago, delivering services that go beyond basic window washing. Our team handles rooftop and skylight cleaning for multi-story buildings where access is limited, power washing for exterior surfaces covered in winter salt buildup, and glass and mirror cleaning for storefronts and office spaces. Each service is designed to restore visibility and curb appeal while protecting your investment from the abrasive effects of urban and lakefront conditions.',
      'We understand the architectural diversity of Chicago properties, from vintage brick two-flats in Lincoln Park to modern high-rises downtown. Older buildings often feature double-hung windows with intricate frames that trap dirt and require careful attention, while newer construction may include floor-to-ceiling glass that shows every fingerprint and water spot. Our approach adapts to each property type, using techniques and equipment suited to the materials and access constraints you face.',
      'Gutter cleaning is another critical service for Chicago properties, particularly before the heavy rains of spring and the leaf fall of autumn. Clogged gutters overflow during storms, sending water down exterior walls and across windows, creating streaks and potential structural issues. We coordinate gutter cleaning with window washing to address the root cause of recurring window grime, helping you maintain clearer glass between services.',
      'Apollo Professional operates on a straightforward process: contact us to describe your property and cleaning needs, receive a transparent estimate, and schedule service at a time that minimizes disruption. We arrive with the equipment and expertise to complete work safely and efficiently, whether that means ladder access for a three-story brownstone or specialized tools for a commercial rooftop skylight installation. You should expect clear communication, respect for your property, and results that restore the transparency glass is meant to provide.',
    ],
  },
  {
    slug: 'evanston',
    name: 'Evanston, IL',
    metaDescription:
      'Detail-focused window cleaning, gutter cleaning, and exterior cleaning in Evanston, IL — our home base. Call Apollo Professional at (773) 600-1308 for a free quote.',
    eyebrow: 'Service Area',
    title: 'Detail-Focused Cleaning in Our Own Backyard',
    intro:
      'Evanston is home base for Apollo Professional, and the North Shore is where we know the weather, the homes, and the buildup best. Lake-effect conditions, salt spray, and mature tree canopies mean windows, gutters, and screens here work harder than most — and collect grime faster. We bring the same detail-focused window cleaning, gutter cleaning, screen cleaning and repair, power washing, and shower door cleaning we deliver across the greater Chicago area right to our own community.',
    body: [
      'From classic lakefront homes to downtown condos, we serve single-family homes, condominiums, HOAs, and select commercial properties throughout Evanston. Our team understands the needs of local homeowners and property managers, and we work to exceed expectations on every job — whether you are preparing a home for sale, refreshing a neighborhood, or maintaining a building.',
      'Because we are based in Evanston, scheduling is flexible and arrival times are dependable. We confirm the day before service, show up as scheduled, and walk through the completed job with you before we leave. Customers appreciate our thorough work, especially in window corners, and our commitment to always showing up.',
    ],
    services: [
      {
        title: 'Window Cleaning',
        description:
          'Streak-free interior and exterior window cleaning that lets in natural light and restores your view of the lake and the city.',
      },
      {
        title: 'Gutter Cleaning',
        description:
          'Debris removal and drainage checks that protect your roof, foundation, and landscaping through every season.',
      },
      {
        title: 'Screen Cleaning & Repair',
        description:
          'Clean, repair, and reattach screens to improve airflow, visibility, and function while keeping windows neat.',
      },
      {
        title: 'Power Washing',
        description:
          'Remove buildup from driveways, patios, and siding to revive outdoor spaces and extend the life of exterior surfaces.',
      },
      {
        title: 'Shower Door Cleaning',
        description:
          'Remove hard water stains and soap residue to bring clarity and shine back to bathroom glass.',
      },
    ],
  },
  {
    slug: 'oak-park',
    name: 'Oak Park, IL',
    metaDescription:
      'Professional cleaning services in Oak Park, IL — window cleaning, gutter cleaning, power washing, and more. First-time customer discounts available. Call (773) 600-1308.',
    eyebrow: 'Service Area',
    title: 'Local Cleaning Done Right in Oak Park',
    intro:
      'Every home in Oak Park, IL deserves to shine. Streaky windows, clogged gutters, and dusty screens can quickly dull even the most beautiful property. The challenge is not only keeping up with dirt and debris — it is finding dependable cleaning services that bring care, consistency, and detail to every visit. At Apollo Professional, we deliver that care with every job. Whether you live near Scoville Park or along Lake Street, we bring clarity and freshness back to your home.',
    body: [
      'Our focus is simple: detailed work, reliable service, and lasting results. We take pride in serving the Oak Park community with precision and attention to detail. Our process is straightforward — we arrive on time, prepare the area, clean each surface with the right tools, and inspect every detail before we leave. When we are done, your home feels lighter, brighter, and ready for the season ahead.',
    ],
    services: [
      {
        title: 'Window Cleaning',
        description:
          'We clean every pane and edge using streak-free techniques, letting in natural light and restoring your clear view of Oak Park’s tree-lined streets.',
      },
      {
        title: 'Gutter Cleaning',
        description:
          'We remove leaves, dirt, and debris so your gutters stay clear and your foundation stays protected through every season.',
      },
      {
        title: 'Screen Cleaning & Repair',
        description:
          'We clean, repair, and reattach screens to improve airflow, visibility, and function while keeping your windows looking neat and fresh.',
      },
      {
        title: 'Power Washing',
        description:
          'We remove buildup from driveways, patios, and siding, reviving your outdoor spaces and extending the life of exterior surfaces.',
      },
      {
        title: 'Shower Door Cleaning',
        description:
          'We remove hard water stains and soap residue, bringing clarity and shine back to your bathroom’s glass features.',
      },
    ],
    tips: [
      {
        title: 'Clean screens before spring',
        description: 'Prevents buildup from spreading indoors when windows open.',
      },
      {
        title: 'Schedule gutter cleaning after fall',
        description: 'Keeps rainwater moving away from your roof and foundation.',
      },
      {
        title: 'Wash windows on cloudy days',
        description: 'Sunlight can dry cleaner too quickly and leave streaks.',
      },
      {
        title: 'Power wash patios before hosting events',
        description: 'Refreshes outdoor spaces for a clean, welcoming look.',
      },
    ],
  },
  {
    slug: 'la-grange',
    name: 'La Grange, IL',
    metaDescription:
      'Trusted cleaning services in La Grange, IL — window cleaning, gutter cleaning, screen care, and power washing. Seasonal discounts for first-time customers. Call (773) 600-1308.',
    eyebrow: 'Service Area',
    title: 'Local Cleaning You Can Count On in La Grange',
    intro:
      'Your home in La Grange, IL deserves to look its best all year long. Dust, grime, and water stains can take away the charm of your windows and outdoor spaces, and finding reliable cleaning services that deliver real results can feel challenging. At Apollo Professional, we bring care and detail to every job. From historic homes near La Grange Road to family houses close to Waiola Park, we treat every property like our own.',
    body: [
      'Our team focuses on clear communication, dependable service, and results that last — you will notice the shine the moment we finish. We believe a clean home changes the way you feel about your space. Our process is simple and thorough: we prepare your home, use the right tools for each surface, and inspect our work carefully. When we leave, your windows, gutters, and patios look refreshed and renewed.',
    ],
    services: [
      {
        title: 'Window Cleaning',
        description:
          'We leave glass spotless, removing streaks and dust to let sunlight stream through every room in your home.',
      },
      {
        title: 'Gutter Cleaning',
        description:
          'We clear debris and blockages to keep rainwater flowing safely away from your home’s roof and foundation.',
      },
      {
        title: 'Screen Cleaning & Repair',
        description:
          'We clean and fix screens, improving airflow and appearance while keeping your windows neat and functional.',
      },
      {
        title: 'Power Washing',
        description:
          'We wash away buildup from patios, driveways, and siding, restoring your property’s fresh look after a long Midwest winter.',
      },
      {
        title: 'Shower Door Cleaning',
        description:
          'We polish away soap scum and mineral deposits, leaving your bathroom glass clear and sparkling.',
      },
    ],
    tips: [
      {
        title: 'Wipe down windows after light rain',
        description: 'Prevents mineral spots from forming on glass.',
      },
      {
        title: 'Schedule gutter cleanings before winter',
        description: 'Keeps ice from building up and damaging your roofline.',
      },
      {
        title: 'Brush patio surfaces regularly',
        description: 'Stops mildew from forming in shaded areas.',
      },
      {
        title: 'Clean shower doors weekly',
        description: 'Reduces soap buildup and makes deep cleaning faster later.',
      },
    ],
  },
  {
    slug: 'hinsdale',
    name: 'Hinsdale, IL',
    metaDescription:
      'Interior and exterior window washing for Hinsdale, IL homes and businesses. Hard water stain removal and seasonal maintenance. Call Apollo Professional at (773) 600-1308.',
    eyebrow: 'Service Area',
    title: 'Crystal-Clear Windows for Hinsdale Homes',
    intro:
      'If you live in Hinsdale, IL, you know how quickly windows lose their sparkle. Illinois hard water leaves stubborn mineral streaks on glass, especially on south- and west-facing windows where afternoon sun bakes the buildup into place. Spring pollen from local trees coats sills and frames, and summer humidity traps dust against the glass. We specialize in interior and exterior window cleaning that restores clarity and curb appeal, using methods designed for the challenges Hinsdale homeowners face year-round.',
    body: [
      'Our service goes beyond a quick wipe-down. We remove mineral deposits, pollen residue, and oxidation from frames and tracks, leaving every pane streak-free. Whether you need a one-time deep clean before hosting guests or a seasonal maintenance schedule to keep your home looking its best, we deliver results you can see from the curb and enjoy from inside.',
      'We understand that your time is valuable and your home deserves careful attention. We clean both sides of every window, including frames, sills, and tracks — many Hinsdale homes have large picture windows and multi-pane designs that collect dust in every corner. We reach high second-story windows safely and efficiently, and we use specialized solutions to dissolve hard-water mineral deposits without scratching the glass or damaging trim.',
      'Hinsdale experiences all four seasons, and each brings unique challenges for your windows. Spring pollen coats glass and screens in a yellow-green film; summer storms leave water spots; fall brings leaf debris that clogs gutters and stains sills; winter road salt and freeze-thaw cycles create streaks that harden if not cleaned promptly. We recommend scheduling window cleaning at least twice a year — once in late spring after pollen season and again in early fall before winter weather sets in. Regular cleaning not only keeps your home beautiful but also extends the life of your windows by preventing etching and frame corrosion.',
      'While window washing is our specialty, we understand that a clean home exterior requires more. That is why we also offer gutter cleaning to prevent overflow damage, screen cleaning and repair, power washing to refresh driveways and patios, and cleaning for shower doors, mirrors, and skylights. Bundling services saves you time and ensures consistent quality across every part of your property.',
    ],
  },
];

/** Helper for page generation. */
export function getAreaPage(slug: string): AreaPage | undefined {
  return areaPages.find((a) => a.slug === slug);
}
