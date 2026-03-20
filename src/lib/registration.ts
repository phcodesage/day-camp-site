import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type { RegistrationValidationMessages } from '@/lib/cms/types';

export const ACTIVITY_OPTIONS = [
  'CHESS',
  'ABACUS',
  'ART',
  'BRAIN GAMES',
  'HOMEWORK HELP',
] as const;

export type ActivityOption = string;

export const PREFERRED_DAY_OPTIONS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
] as const;

export type PreferredDayOption = string;

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
export const MAX_PREFERRED_DAYS_LENGTH = 80;
export const MAX_NOTES_LENGTH = 1000;
const DEFAULT_VALIDATION_MESSAGES =
  DEFAULT_CMS_CONTENT.afterschoolPrograms.validationMessages;

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

  return {
    parentName: getTrimmedString(payload.parentName),
    studentName: getTrimmedString(payload.studentName),
    email: getTrimmedString(payload.email).toLowerCase(),
    phone: getTrimmedString(payload.phone),
    preferredDays: formatPreferredDays(
      getPreferredDaySelections(payload.preferredDays, preferredDayOptions)
    ),
    notes: getTrimmedString(payload.notes),
    activities: normalizeOptionSelections(payload.activities, activityOptions),
  };
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

  if (data.activities.length === 0) {
    errors.activities = messages.activitiesRequired;
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
