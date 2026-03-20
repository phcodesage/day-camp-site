'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { type ChangeEvent, type FocusEvent, type FormEvent, useState } from 'react';
import {
  ACTIVITY_OPTIONS,
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  PREFERRED_DAY_OPTIONS,
  formatPreferredDays,
  getRegistrationFieldErrors,
  getPreferredDaySelections,
  hasRegistrationFieldErrors,
  type ActivityOption,
  type PreferredDayOption,
  type RegistrationField,
  type RegistrationFieldErrors,
  type RegistrationPayload,
} from '@/lib/registration';

type SubmissionState =
  | null
  | {
      kind: 'success' | 'error';
      title: string;
      message: string;
    };

type EditableField = Exclude<RegistrationField, 'activities' | 'preferredDays'>;
type TouchedFields = Partial<Record<RegistrationField, boolean>>;

type RegistrationApiResponse = {
  error?: string;
  message?: string;
  fieldErrors?: RegistrationFieldErrors;
};

function createInitialFormState(): RegistrationPayload {
  return {
    parentName: '',
    studentName: '',
    email: '',
    phone: '',
    activities: [],
    preferredDays: '',
    notes: '',
  };
}

function getInputClassName(hasError: boolean) {
  return `rounded-xl border bg-white px-4 py-3 transition-colors outline-none ${
    hasError
      ? 'border-[#c74444] ring-2 ring-[#c74444]/15'
      : 'border-[#1a2945]/20 focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15'
  }`;
}

export default function AfterschoolPrograms() {
  const [formData, setFormData] = useState<RegistrationPayload>(
    createInitialFormState
  );
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedPreferredDays = getPreferredDaySelections(formData.preferredDays);

  const applySingleFieldValidation = (
    field: RegistrationField,
    nextFormData: RegistrationPayload
  ) => {
    const nextErrors = getRegistrationFieldErrors(nextFormData);

    setFieldErrors((current) => {
      const updatedErrors = { ...current };

      if (nextErrors[field]) {
        updatedErrors[field] = nextErrors[field];
      } else {
        delete updatedErrors[field];
      }

      return updatedErrors;
    });
  };

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    const name = event.target.name as EditableField;

    setSubmissionState(null);
    setFormData((current) => {
      const nextFormData = {
        ...current,
        [name]: value,
      };

      if (touchedFields[name] || fieldErrors[name]) {
        applySingleFieldValidation(name, nextFormData);
      }

      return nextFormData;
    });
  };

  const handleFieldBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const field = event.target.name as EditableField;

    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));

    applySingleFieldValidation(field, formData);
  };

  const handleActivityChange = (activity: ActivityOption, checked: boolean) => {
    setSubmissionState(null);
    setFormData((current) => {
      const nextFormData = {
        ...current,
        activities: checked
          ? [...current.activities, activity]
          : current.activities.filter((item) => item !== activity),
      };

      if (touchedFields.activities || fieldErrors.activities) {
        applySingleFieldValidation('activities', nextFormData);
      }

      return nextFormData;
    });
  };

  const handleActivitiesBlur = () => {
    setTouchedFields((current) => ({
      ...current,
      activities: true,
    }));

    applySingleFieldValidation('activities', formData);
  };

  const handlePreferredDayChange = (
    day: PreferredDayOption,
    checked: boolean
  ) => {
    setSubmissionState(null);

    setFormData((current) => {
      const currentDays = getPreferredDaySelections(current.preferredDays);
      const nextDays = checked
        ? Array.from(new Set([...currentDays, day]))
        : currentDays.filter((item) => item !== day);

      const nextFormData = {
        ...current,
        preferredDays: formatPreferredDays(nextDays),
      };

      if (touchedFields.preferredDays || fieldErrors.preferredDays) {
        applySingleFieldValidation('preferredDays', nextFormData);
      }

      return nextFormData;
    });
  };

  const handlePreferredDaysBlur = () => {
    setTouchedFields((current) => ({
      ...current,
      preferredDays: true,
    }));

    applySingleFieldValidation('preferredDays', formData);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFieldErrors = getRegistrationFieldErrors(formData);

    if (hasRegistrationFieldErrors(nextFieldErrors)) {
      setFieldErrors(nextFieldErrors);
      setTouchedFields({
        parentName: true,
        studentName: true,
        email: true,
        phone: true,
        activities: true,
        preferredDays: true,
        notes: true,
      });
      setSubmissionState({
        kind: 'error',
        title: 'Please fix the highlighted fields.',
        message: 'Review the form and try again.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionState(null);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json().catch(() => null)) as
        | RegistrationApiResponse
        | null;

      if (!response.ok) {
        if (result?.fieldErrors) {
          setFieldErrors(result.fieldErrors);
          setTouchedFields((current) => ({
            ...current,
            parentName: true,
            studentName: true,
            email: true,
            phone: true,
            activities: true,
            preferredDays: true,
            notes: true,
          }));
        }

        throw new Error(
          result?.error || 'Could not submit the registration right now.'
        );
      }

      setFormData(createInitialFormState());
      setFieldErrors({});
      setTouchedFields({});
      setSubmissionState({
        kind: 'success',
        title: 'Registration submitted.',
        message:
          result?.message ||
          'Thank you. Your registration was received successfully.',
      });
    } catch (error) {
      setSubmissionState({
        kind: 'error',
        title: 'Submission failed.',
        message:
          error instanceof Error
            ? error.message
            : 'Could not submit the registration right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="afterschool"
      className="w-full scroll-mt-24 bg-white px-6 py-16 text-[#1a2945] md:px-10 md:py-24 lg:px-16"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-extrabold text-[#c74444] md:text-5xl">
            Kids Afterschool Programs
          </h2>
          <p className="text-lg font-semibold">Monday to Friday</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {ACTIVITY_OPTIONS.map((activity) => (
            <div
              key={activity}
              className="space-y-3 rounded-2xl bg-[#f6dedd] p-6 text-center shadow-lg transition-shadow hover:shadow-xl"
            >
              <h3 className="text-xl font-bold uppercase text-[#c74444]">
                {activity}
              </h3>
              <p className="text-sm font-semibold">Monday to Friday</p>
              <p className="text-sm">4:00 PM - 6:00 PM</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#f6dedd] p-8 shadow-lg md:p-10">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-[#c74444]">
              Registration Form
            </h3>
            <p className="mt-3 text-sm text-[#1a2945]/75">
              Fill up the form below to register and we will contact you to
              settle your payment.
            </p>
          </div>

          {submissionState ? (
            <div
              className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-4 ${
                submissionState.kind === 'success'
                  ? 'border-[#1a7b8e]/25 bg-[#1a7b8e]/10 text-[#0e243a]'
                  : 'border-[#c74444]/20 bg-[#c74444]/10 text-[#7a1f1f]'
              }`}
              role={submissionState.kind === 'success' ? 'status' : 'alert'}
            >
              {submissionState.kind === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              )}

              <div>
                <p className="font-semibold">{submissionState.title}</p>
                <p className="mt-1 text-sm">{submissionState.message}</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="font-semibold">
                Parent Name <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="parentName"
                name="parentName"
                type="text"
                value={formData.parentName}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.parentName))}
                placeholder="Enter parent name"
                autoComplete="name"
                maxLength={MAX_NAME_LENGTH}
                aria-invalid={Boolean(fieldErrors.parentName)}
                aria-describedby={
                  fieldErrors.parentName ? 'parentName-error' : 'parentName-help'
                }
                required
              />
              <div className="flex items-center justify-between text-xs">
                <span
                  id="parentName-error"
                  className="text-[#c74444]"
                >
                  {touchedFields.parentName ? fieldErrors.parentName : ''}
                </span>
                <span id="parentName-help" className="text-[#1a2945]/55">
                  {formData.parentName.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-semibold">
                Student Name <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="studentName"
                name="studentName"
                type="text"
                value={formData.studentName}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.studentName))}
                placeholder="Enter student name"
                maxLength={MAX_NAME_LENGTH}
                aria-invalid={Boolean(fieldErrors.studentName)}
                aria-describedby={
                  fieldErrors.studentName
                    ? 'studentName-error'
                    : 'studentName-help'
                }
                required
              />
              <div className="flex items-center justify-between text-xs">
                <span
                  id="studentName-error"
                  className="text-[#c74444]"
                >
                  {touchedFields.studentName ? fieldErrors.studentName : ''}
                </span>
                <span id="studentName-help" className="text-[#1a2945]/55">
                  {formData.studentName.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-semibold">
                Email <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.email))}
                placeholder="Enter email"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                required
              />
              <span id="email-error" className="text-xs text-[#c74444]">
                {touchedFields.email ? fieldErrors.email : ''}
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-semibold">
                Phone Number <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.phone))}
                placeholder="Enter phone number"
                autoComplete="tel"
                inputMode="tel"
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? 'phone-error' : 'phone-help'}
                required
              />
              <div className="flex items-center justify-between text-xs">
                <span id="phone-error" className="text-[#c74444]">
                  {touchedFields.phone ? fieldErrors.phone : ''}
                </span>
                <span id="phone-help" className="text-[#1a2945]/55">
                  Use digits, spaces, or + ( )
                </span>
              </div>
            </label>

            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  Select Activities <span className="text-[#c74444]">*</span>
                </p>
                <p className="text-sm text-[#1a2945]/65">
                  {formData.activities.length} selected
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {ACTIVITY_OPTIONS.map((activity) => {
                  const isSelected = formData.activities.includes(activity);

                  return (
                    <label
                      key={`form-${activity}`}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                        isSelected
                          ? 'border-[#1a7b8e]/40 bg-[#1a7b8e]/10'
                          : fieldErrors.activities && touchedFields.activities
                            ? 'border-[#c74444]/35 bg-white'
                            : 'border-[#1a2945]/20 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="activities"
                        value={activity}
                        checked={isSelected}
                        onChange={(event) =>
                          handleActivityChange(activity, event.target.checked)
                        }
                        onBlur={handleActivitiesBlur}
                      />
                      <span>{activity}</span>
                    </label>
                  );
                })}
              </div>

              <p className="text-xs text-[#c74444]">
                {touchedFields.activities ? fieldErrors.activities : ''}
              </p>
            </div>

            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  Preferred Days <span className="text-[#c74444]">*</span>
                </p>
                <p className="text-sm text-[#1a2945]/65">
                  {selectedPreferredDays.length} selected
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {PREFERRED_DAY_OPTIONS.map((day) => {
                  const isSelected = selectedPreferredDays.includes(day);

                  return (
                    <label
                      key={`day-${day}`}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                        isSelected
                          ? 'border-[#1a7b8e]/40 bg-[#1a7b8e]/10'
                          : fieldErrors.preferredDays && touchedFields.preferredDays
                            ? 'border-[#c74444]/35 bg-white'
                            : 'border-[#1a2945]/20 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="preferredDays"
                        value={day}
                        checked={isSelected}
                        onChange={(event) =>
                          handlePreferredDayChange(day, event.target.checked)
                        }
                        onBlur={handlePreferredDaysBlur}
                      />
                      <span>{day}</span>
                    </label>
                  );
                })}
              </div>

              <p className="text-xs text-[#c74444]">
                {touchedFields.preferredDays ? fieldErrors.preferredDays : ''}
              </p>
            </div>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="font-semibold">Notes</span>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={`${getInputClassName(Boolean(fieldErrors.notes))} min-h-32`}
                placeholder="Share allergies, pickup details, or anything else we should know"
                maxLength={MAX_NOTES_LENGTH}
                aria-invalid={Boolean(fieldErrors.notes)}
                aria-describedby={fieldErrors.notes ? 'notes-error' : 'notes-help'}
              />
              <div className="flex items-center justify-between text-xs">
                <span id="notes-error" className="text-[#c74444]">
                  {touchedFields.notes ? fieldErrors.notes : ''}
                </span>
                <span id="notes-help" className="text-[#1a2945]/55">
                  {formData.notes.length}/{MAX_NOTES_LENGTH}
                </span>
              </div>
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#c74444] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60 md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-[#1a2945]/75">
            Required fields are marked with <span className="text-[#c74444]">*</span>.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0e243a] p-8 text-white shadow-xl md:p-10">
          <h3 className="mb-8 text-center text-3xl font-bold">Pricing</h3>

          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2 rounded-xl bg-white/10 p-6 text-center transition-colors hover:bg-white/20">
              <p className="text-lg font-semibold">1 day/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$75</p>
            </div>
            <div className="space-y-2 rounded-xl bg-white/10 p-6 text-center transition-colors hover:bg-white/20">
              <p className="text-lg font-semibold">2 days/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$150</p>
            </div>
            <div className="space-y-2 rounded-xl bg-white/10 p-6 text-center transition-colors hover:bg-white/20">
              <p className="text-lg font-semibold">3 days/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$225</p>
            </div>
            <div className="space-y-2 rounded-xl bg-white/10 p-6 text-center transition-colors hover:bg-white/20">
              <p className="text-lg font-semibold">4 days/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$300</p>
            </div>
            <div className="space-y-2 rounded-xl bg-white/10 p-6 text-center transition-colors hover:bg-white/20">
              <p className="text-lg font-semibold">5 days/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$375</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#c74444] p-6 text-center">
            <p className="text-2xl font-extrabold md:text-3xl">
              Get 40% OFF for 2 or more days of afterschool programs!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
