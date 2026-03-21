export type CmsSectionKey =
  | 'siteChrome'
  | 'about'
  | 'moreInformation'
  | 'campHighlights'
  | 'programSchedule'
  | 'afterschoolPrograms';

export type NavItem = {
  href: string;
  label: string;
};

export type SiteChromeContent = {
  brandTitle: string;
  metadataTitle: string;
  metadataDescription: string;
  logoSrc: string;
  logoAlt: string;
  heroImageSrc: string;
  heroImageAlt: string;
  accentImageSrc: string;
  accentImageAlt: string;
  navItems: NavItem[];
  mobileMenuOpenLabel: string;
  mobileMenuCloseLabel: string;
  scrollToTopLabel: string;
};

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

export type RegistrationSubmissionMessages = {
  invalidFormTitle: string;
  invalidFormMessage: string;
  successTitle: string;
  successMessage: string;
  errorTitle: string;
  serverErrorMessage: string;
};

export type RegistrationValidationMessages = {
  invalidPayload: string;
  genericReview: string;
  parentNameRequired: string;
  parentNameTooLong: string;
  studentNameRequired: string;
  studentNameTooLong: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  activitiesRequired: string;
  preferredDaysRequired: string;
  preferredDaysTooLong: string;
  startDateRequired: string;
  notesTooLong: string;
};

export type AfterschoolProgramsContent = {
  heroTitle: string;
  heroSubtitle: string;
  activityOptions: string[];
  activityScheduleLabel: string;
  activityTimeLabel: string;
  registrationTitle: string;
  registrationDescription: string;
  parentNameLabel: string;
  parentNamePlaceholder: string;
  studentNameLabel: string;
  studentNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHelperText: string;
  activitiesLabel: string;
  preferredDaysLabel: string;
  preferredDayOptions: string[];
  selectedCountSuffix: string;
  startDateLabel: string;
  startDatePlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  submitButtonLabel: string;
  submittingButtonLabel: string;
  requiredFieldsNotice: string;
  submissionMessages: RegistrationSubmissionMessages;
  validationMessages: RegistrationValidationMessages;
  pricingTitle: string;
  pricingItems: PricingItem[];
  discountNotice: string;
};

export type CmsContentBySectionKey = {
  siteChrome: SiteChromeContent;
  about: AboutSectionContent;
  moreInformation: MoreInformationContent;
  campHighlights: CampHighlightsContent;
  programSchedule: ProgramScheduleContent;
  afterschoolPrograms: AfterschoolProgramsContent;
};

export type CmsSectionContent<K extends CmsSectionKey> = CmsContentBySectionKey[K];
