export const ACTIVITY_OPTIONS = [
  'CHESS',
  'ABACUS',
  'ART',
  'BRAIN GAMES',
  'HOMEWORK HELP',
] as const;

export type ActivityOption = (typeof ACTIVITY_OPTIONS)[number];

export const PREFERRED_DAY_OPTIONS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
] as const;

export type PreferredDayOption = (typeof PREFERRED_DAY_OPTIONS)[number];

export type RegistrationPayload = {
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  activities: ActivityOption[];
  preferredDays: string;
  notes: string;
};

export type RegistrationField = keyof RegistrationPayload;

export type RegistrationFieldErrors = Partial<
  Record<RegistrationField, string>
>;

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

export const DEFAULT_PREFERRED_DAYS =
  'Monday, Tuesday, Wednesday, Thursday, Friday';
export const MAX_NAME_LENGTH = 120;
export const MAX_PREFERRED_DAYS_LENGTH = 80;
export const MAX_NOTES_LENGTH = 1000;

const PREFERRED_DAY_LOOKUP: Record<string, PreferredDayOption> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
};

function getTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isActivityOption(value: string): value is ActivityOption {
  return ACTIVITY_OPTIONS.includes(value as ActivityOption);
}

function toPreferredDayOption(value: string): PreferredDayOption | null {
  return PREFERRED_DAY_LOOKUP[value.trim().toLowerCase()] || null;
}

export function getPreferredDaySelections(value: unknown): PreferredDayOption[] {
  if (Array.isArray(value)) {
    const days = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => toPreferredDayOption(item))
      .filter((item): item is PreferredDayOption => Boolean(item));

    return Array.from(new Set(days));
  }

  const textValue = getTrimmedString(value);

  if (!textValue) {
    return [];
  }

  if (textValue.toLowerCase() === 'monday to friday') {
    return [...PREFERRED_DAY_OPTIONS];
  }

  const days = textValue
    .split(',')
    .map((item) => toPreferredDayOption(item))
    .filter((item): item is PreferredDayOption => Boolean(item));

  return Array.from(new Set(days));
}

export function formatPreferredDays(days: PreferredDayOption[]) {
  return days.join(', ');
}

export function normalizeRegistrationPayload(
  input: Partial<RegistrationPayload> | Record<string, unknown>
): RegistrationPayload {
  const payload = input as Record<string, unknown>;
  const preferredDaySelections = getPreferredDaySelections(payload.preferredDays);

  return {
    parentName: getTrimmedString(payload.parentName),
    studentName: getTrimmedString(payload.studentName),
    email: getTrimmedString(payload.email).toLowerCase(),
    phone: getTrimmedString(payload.phone),
    preferredDays: formatPreferredDays(preferredDaySelections),
    notes: getTrimmedString(payload.notes),
    activities: Array.isArray(payload.activities)
      ? Array.from(
          new Set(
            payload.activities
              .filter((value): value is string => typeof value === 'string')
              .map((value) => value.trim().toUpperCase())
              .filter(isActivityOption)
          )
        )
      : [],
  };
}

export function getRegistrationFieldErrors(
  input: Partial<RegistrationPayload> | Record<string, unknown>
) {
  const data = normalizeRegistrationPayload(input);
  const errors: RegistrationFieldErrors = {};

  if (!data.parentName) {
    errors.parentName = 'Parent name is required.';
  } else if (data.parentName.length > MAX_NAME_LENGTH) {
    errors.parentName = `Parent name must be ${MAX_NAME_LENGTH} characters or less.`;
  }

  if (!data.studentName) {
    errors.studentName = 'Student name is required.';
  } else if (data.studentName.length > MAX_NAME_LENGTH) {
    errors.studentName = `Student name must be ${MAX_NAME_LENGTH} characters or less.`;
  }

  if (!data.email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(data.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!data.phone) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_PATTERN.test(data.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (data.activities.length === 0) {
    errors.activities = 'Select at least one activity.';
  }

  if (!data.preferredDays) {
    errors.preferredDays = 'Select at least one preferred day.';
  }

  if (
    data.preferredDays &&
    data.preferredDays.length > MAX_PREFERRED_DAYS_LENGTH
  ) {
    errors.preferredDays = `Preferred days must be ${MAX_PREFERRED_DAYS_LENGTH} characters or less.`;
  }

  if (data.notes.length > MAX_NOTES_LENGTH) {
    errors.notes = `Notes must be ${MAX_NOTES_LENGTH} characters or less.`;
  }

  return errors;
}

export function getRegistrationErrorMessage(errors: RegistrationFieldErrors) {
  const firstMessage = Object.values(errors).find(Boolean);
  return firstMessage || 'Please review the form and try again.';
}

export function hasRegistrationFieldErrors(errors: RegistrationFieldErrors) {
  return Object.keys(errors).length > 0;
}

export function validateRegistrationPayload(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') {
    return {
      success: false,
      error: 'Invalid registration payload.',
      fieldErrors: {},
    };
  }

  const data = normalizeRegistrationPayload(input as Record<string, unknown>);
  const fieldErrors = getRegistrationFieldErrors(data);

  if (hasRegistrationFieldErrors(fieldErrors)) {
    return {
      success: false,
      error: getRegistrationErrorMessage(fieldErrors),
      fieldErrors,
    };
  }

  return {
    success: true,
    data,
  };
}
