import type { CmsContentBySectionKey } from '@/lib/cms/types';

export const DEFAULT_CMS_CONTENT: CmsContentBySectionKey = {
  about: {
    heading: 'KIDS AFTER SCHOOL PROGRAMS',
    italicLine: 'School is out, but learning continues.',
    paragraph1:
      'Turn after-school hours into an incredible journey. We have designed programs that balance brain-boosting activities with non-stop fun, ensuring your child stays engaged, active, and happy.',
    paragraph2:
      'This is more than just after-school care. It is an opportunity for your child to discover passions, build confidence, and truly ignite their brilliance.',
    buttonLabel: 'Learn More',
    buttonHref: '#more-information',
  },
  moreInformation: {
    headingLine1: 'MORE',
    headingLine2: 'INFORMATION',
    email: 'Afterschool@exceedlearningcenterny.com',
    phone: '+1 (516) 226-3114',
    address: '1360 Willis Ave, Albertson, NY',
    websiteLabel: 'www.exceedlearningcenterny.com',
    websiteHref: 'https://www.exceedlearningcenterny.com',
    imageSrc: '/images/kids/kids-more-information.png',
    imageAlt: 'Children doing arts and crafts at a table',
    videoUrl: '',
  },
  campHighlights: {
    introHeading:
      'In our afterschool program, every day is a new adventure! Your child will enjoy:',
    activities: [
      'CHESS',
      'ABACUS',
      'ART',
      'BRAIN GAMES',
      'HOMEWORK HELP',
    ],
    highlights: [
      {
        boldText: 'Explore New Skills:',
        text: 'Dive into creative projects like arts and crafts, or challenge their minds with brain games and strategic thinking exercises.',
      },
      {
        boldText: 'Make New Friends:',
        text: 'Build friendships and develop teamwork skills in a safe, supportive, and engaging environment.',
      },
      {
        boldText: 'Boost Confidence:',
        text: 'Our hands-on activities and positive encouragement help every child discover their unique talents and feel proud of their accomplishments.',
      },
    ],
    imageSrc: '/images/kids/highlights-kids.png',
    imageAlt: 'Kids working together on activities at camp',
    videoUrl: '',
  },
  programSchedule: {
    badgeLabels: ['CHESS', 'ABACUS', 'ART', 'BRAIN GAMES', 'HOMEWORK HELP'],
    enrollPrefix: 'Enroll your kids now!',
    enrollBold: 'Programs run throughout the year!',
    scheduleTitle: 'Monday to Friday',
    scheduleSubtitle: 'Our programs are available every weekday!',
    scheduleBody:
      "Choose the days that work best for your family's schedule.",
    imageSrc: '/images/kids/child-abacus.png',
    imageAlt: 'Happy child with abacus',
    videoUrl: '',
  },
  afterschoolPrograms: {
    heroTitle: 'Kids Afterschool Programs',
    heroSubtitle: 'Monday to Friday',
    registrationTitle: 'Registration Form',
    registrationDescription:
      'Fill up the form below to register and we will contact you to settle your payment.',
    pricingTitle: 'Pricing',
    pricingItems: [
      { durationLabel: '1 day/week', price: '$75' },
      { durationLabel: '2 days/week', price: '$150' },
      { durationLabel: '3 days/week', price: '$225' },
      { durationLabel: '4 days/week', price: '$300' },
      { durationLabel: '5 days/week', price: '$375' },
    ],
    discountNotice:
      'Get 40% OFF for 2 or more days of afterschool programs!',
  },
};

