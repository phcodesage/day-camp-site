export type CmsSectionKey =
  | 'about'
  | 'moreInformation'
  | 'campHighlights'
  | 'programSchedule'
  | 'afterschoolPrograms';

export type AboutSectionContent = {
  heading: string;
  italicLine: string;
  paragraph1: string;
  paragraph2: string;
  buttonLabel: string;
  buttonHref: string;
};

export type MoreInformationContent = {
  headingLine1: string;
  headingLine2: string;
  email: string;
  phone: string;
  address: string;
  websiteLabel: string;
  websiteHref: string;
  imageSrc: string;
  imageAlt: string;
  videoUrl: string;
};

export type CampHighlightsContent = {
  introHeading: string;
  activities: string[];
  highlights: Array<{ boldText: string; text: string }>;
  imageSrc: string;
  imageAlt: string;
  videoUrl: string;
};

export type ProgramScheduleContent = {
  badgeLabels: string[];
  enrollPrefix: string;
  enrollBold: string;
  scheduleTitle: string;
  scheduleSubtitle: string;
  scheduleBody: string;
  imageSrc: string;
  imageAlt: string;
  videoUrl: string;
};

export type PricingItem = {
  durationLabel: string;
  price: string;
};

export type AfterschoolProgramsContent = {
  heroTitle: string;
  heroSubtitle: string;
  registrationTitle: string;
  registrationDescription: string;
  pricingTitle: string;
  pricingItems: PricingItem[];
  discountNotice: string;
};

export type CmsContentBySectionKey = {
  about: AboutSectionContent;
  moreInformation: MoreInformationContent;
  campHighlights: CampHighlightsContent;
  programSchedule: ProgramScheduleContent;
  afterschoolPrograms: AfterschoolProgramsContent;
};

export type CmsSectionContent<K extends CmsSectionKey> = CmsContentBySectionKey[K];

