import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type { RegistrationValidationMessages } from '@/lib/cms/types';

export const ACTIVITY_OPTIONS = [
  'CHESS',
  'ABACUS',
  'ART',
  'BRAIN GAMES',
  'HOMEWORK HELP',
  'MATH',
  'READING & ELA',
  'SCIENCE',
  'TEST PREP',
] as const;

export type ActivityOption = string;

export const PREFERRED_DAY_OPTIONS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
] as const;

export type PreferredDayOption = string;

export const GRADE_OPTIONS = [
  'Pre-K / Nursery',
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7-8 (Middle School)',
  'Grade 9-12 (High School)',
] as const;

export const SUBJECT_OPTIONS = [
  'Math',
  'Reading & ELA',
  'Science',
  'Abacus & Mental Math',
  'Chess & Critical Thinking',
  'Brain Games & Logic',
  'Arts & Crafts',
  'Homework Help',
  'State Test Prep',
  'Coding & Technology',
] as const;

export const TUITION_PLAN_OPTIONS = [
  { id: '1day', label: '1 Day / Week ($90/day Early Bird)', rate: 90 },
  { id: '2or3days', label: '2 or 3 Days / Week ($80/day Early Bird)', rate: 80 },
  { id: '4or5days', label: '4 or 5 Days / Week ($350/week Early Bird)', rate: 350 },
  { id: 'monthly', label: 'Monthly School Days ($1,300/month Early Bird)', rate: 1300 },
  { id: 'tutoring', label: 'Private Tutoring ($60/session)', rate: 60 },
] as const;

export type RegistrationPayload = {
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  grade?: string;
  subjects?: string[];
  activities: ActivityOption[];
  preferredDays: string;
  tuitionPlan?: string;
  startDate: string;
  endDate?: string;
  notes: string;
  pianoLesson?: boolean;
  pianoFrequency?: 'single' | 'once_weekly' | 'twice_weekly';
  chessAddon?: boolean;
  chessFrequency?: 'single' | 'once_weekly' | 'twice_weekly';
  totalAmount?: number;
};

export type RegistrationField = keyof RegistrationPayload;

export type RegistrationFieldErrors = Partial<
  Record<RegistrationField, string>
>;

export type RegistrationValidationConfig = {
  activityOptions?: readonly string[];
  preferredDayOptions?: readonly string[];
  validationMessages?: RegistrationValidationMessages;
};

type ValidationResult =
  | {
      success: true;
      data: RegistrationPayload;
    }
  | {
      success: false;
      error: string;
      fieldErrors: RegistrationFieldErrors;
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{7,20}$/;

export const DEFAULT_PREFERRED_DAYS = PREFERRED_DAY_OPTIONS.join(', ');
export const MAX_NAME_LENGTH = 120;
export const MAX_PREFERRED_DAYS_LENGTH = 120;
export const MAX_NOTES_LENGTH = 1000;
export const MAX_START_DATE_LENGTH = 20;
const DEFAULT_VALIDATION_MESSAGES =
  DEFAULT_CMS_CONTENT.afterschoolPrograms.validationMessages;

export function calculateTotalAmount(payload: Partial<RegistrationPayload>): number {
  let total = 0;

  // Selected preferred days count
  const daySelections = getPreferredDaySelections(
    payload.preferredDays,
    PREFERRED_DAY_OPTIONS
  );
  const dayCount = daySelections.length;

  // Base tuition based on plan or day count
  if (payload.tuitionPlan === 'monthly') {
    total += 1300;
  } else if (payload.tuitionPlan === '4or5days') {
    total += 350;
  } else if (payload.tuitionPlan === '2or3days') {
    total += (dayCount > 0 ? dayCount : 2) * 80;
  } else if (payload.tuitionPlan === '1day') {
    total += (dayCount > 0 ? dayCount : 1) * 90;
  } else if (payload.tuitionPlan === 'tutoring') {
    total += (dayCount > 0 ? dayCount : 1) * 60;
  } else {
    // Auto-compute from dayCount if no specific plan selected
    if (dayCount === 1) {
      total += 90;
    } else if (dayCount === 2 || dayCount === 3) {
      total += dayCount * 80;
    } else if (dayCount === 4 || dayCount === 5) {
      total += 350;
    } else if (dayCount >= 6) {
      total += 350 + 90;
    }
  }

  // Piano Addon
  if (payload.pianoLesson) {
    if (payload.pianoFrequency === 'once_weekly') {
      total += 280;
    } else if (payload.pianoFrequency === 'twice_weekly') {
      total += 550;
    } else {
      total += 75; // Per lesson default
    }
  }

  // Chess Addon
  if (payload.chessAddon) {
    if (payload.chessFrequency === 'once_weekly') {
      total += 220;
    } else if (payload.chessFrequency === 'twice_weekly') {
      total += 400;
    } else {
      total += 60; // Per lesson default
    }
  }

  return total;
}

function getTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeAllowedOptions(options: readonly string[]) {
  return Array.from(
    new Set(
      options
        .map((option) => getTrimmedString(option))
        .filter(Boolean)
    )
  );
}

function buildAllowedOptionLookup(options: readonly string[]) {
  const lookup = new Map<string, string>();

  for (const option of normalizeAllowedOptions(options)) {
    lookup.set(option.toLowerCase(), option);
  }

  return lookup;
}

function normalizeOptionSelections(
  value: unknown,
  options: readonly string[]
) {
  const lookup = buildAllowedOptionLookup(options);

  const rawValues = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : getTrimmedString(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

  return Array.from(
    new Set(
      rawValues
        .map((item) => lookup.get(item.toLowerCase()) || null)
        .filter((item): item is string => Boolean(item))
    )
  );
}

export function getPreferredDaySelections(
  value: unknown,
  preferredDayOptions: readonly string[] = PREFERRED_DAY_OPTIONS
) {
  return normalizeOptionSelections(value, preferredDayOptions);
}

export function formatPreferredDays(days: readonly string[]) {
  return days.join(', ');
}

function getValidationMessages(config: RegistrationValidationConfig) {
  return config.validationMessages ?? DEFAULT_VALIDATION_MESSAGES;
}

export function normalizeRegistrationPayload(
  input: Partial<RegistrationPayload> | Record<string, unknown>,
  config: RegistrationValidationConfig = {}
): RegistrationPayload {
  const payload = input as Record<string, unknown>;
  const activityOptions = config.activityOptions ?? ACTIVITY_OPTIONS;
  const preferredDayOptions = config.preferredDayOptions ?? PREFERRED_DAY_OPTIONS;

  const normalizedDays = formatPreferredDays(
    getPreferredDaySelections(payload.preferredDays, preferredDayOptions)
  );

  const subjects = Array.isArray(payload.subjects)
    ? payload.subjects.map((s) => String(s).trim()).filter(Boolean)
    : [];

  const rawPayload: RegistrationPayload = {
    parentName: getTrimmedString(payload.parentName),
    studentName: getTrimmedString(payload.studentName),
    email: getTrimmedString(payload.email).toLowerCase(),
    phone: getTrimmedString(payload.phone),
    grade: getTrimmedString(payload.grade),
    subjects,
    preferredDays: normalizedDays,
    tuitionPlan: getTrimmedString(payload.tuitionPlan),
    startDate: getTrimmedString(payload.startDate),
    endDate: getTrimmedString(payload.endDate),
    notes: getTrimmedString(payload.notes),
    activities: normalizeOptionSelections(payload.activities, activityOptions),
    pianoLesson: Boolean(payload.pianoLesson),
    pianoFrequency: (payload.pianoFrequency as any) || undefined,
    chessAddon: Boolean(payload.chessAddon),
    chessFrequency: (payload.chessFrequency as any) || undefined,
  };

  rawPayload.totalAmount = calculateTotalAmount(rawPayload);
  return rawPayload;
}

export function getRegistrationFieldErrors(
  input: Partial<RegistrationPayload> | Record<string, unknown>,
  config: RegistrationValidationConfig = {}
) {
  const data = normalizeRegistrationPayload(input, config);
  const messages = getValidationMessages(config);
  const errors: RegistrationFieldErrors = {};

  if (!data.parentName) {
    errors.parentName = messages.parentNameRequired;
  } else if (data.parentName.length > MAX_NAME_LENGTH) {
    errors.parentName = messages.parentNameTooLong;
  }

  if (!data.studentName) {
    errors.studentName = messages.studentNameRequired;
  } else if (data.studentName.length > MAX_NAME_LENGTH) {
    errors.studentName = messages.studentNameTooLong;
  }

  if (!data.email) {
    errors.email = messages.emailRequired;
  } else if (!EMAIL_PATTERN.test(data.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!data.phone) {
    errors.phone = messages.phoneRequired;
  } else if (!PHONE_PATTERN.test(data.phone)) {
    errors.phone = messages.phoneInvalid;
  }

  if (!data.preferredDays) {
    errors.preferredDays = messages.preferredDaysRequired;
  }

  if (
    data.preferredDays &&
    data.preferredDays.length > MAX_PREFERRED_DAYS_LENGTH
  ) {
    errors.preferredDays = messages.preferredDaysTooLong;
  }

  if (!data.startDate) {
    errors.startDate = messages.startDateRequired;
  }

  if (data.notes.length > MAX_NOTES_LENGTH) {
    errors.notes = messages.notesTooLong;
  }

  return errors;
}

export function getRegistrationErrorMessage(
  errors: RegistrationFieldErrors,
  messages: RegistrationValidationMessages = DEFAULT_VALIDATION_MESSAGES
) {
  const firstMessage = Object.values(errors).find(Boolean);
  return firstMessage || messages.genericReview;
}

export function hasRegistrationFieldErrors(errors: RegistrationFieldErrors) {
  return Object.keys(errors).length > 0;
}

export function validateRegistrationPayload(
  input: unknown,
  config: RegistrationValidationConfig = {}
): ValidationResult {
  const messages = getValidationMessages(config);

  if (!input || typeof input !== 'object') {
    return {
      success: false,
      error: messages.invalidPayload,
      fieldErrors: {},
    };
  }

  const data = normalizeRegistrationPayload(
    input as Record<string, unknown>,
    config
  );
  const fieldErrors = getRegistrationFieldErrors(data, config);

  if (hasRegistrationFieldErrors(fieldErrors)) {
    return {
      success: false,
      error: getRegistrationErrorMessage(fieldErrors, messages),
      fieldErrors,
    };
  }

  return {
    success: true,
    data,
  };
}

