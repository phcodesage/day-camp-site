'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type ChangeEvent, type FocusEvent, type FormEvent, useEffect, useState } from 'react';
import {
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  formatPreferredDays,
  getRegistrationFieldErrors,
  getPreferredDaySelections,
  hasRegistrationFieldErrors,
  type PreferredDayOption,
  type RegistrationField,
  type RegistrationFieldErrors,
  type RegistrationPayload,
  type RegistrationValidationConfig,
} from '@/lib/registration';
import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type { AfterschoolProgramsContent } from '@/lib/cms/types';

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
    startDate: '',
    notes: '',
    pianoLesson: false,
    chessAddon: false,
  };
}

function getInputClassName(hasError: boolean) {
  return `rounded-xl border bg-white px-4 py-3 transition-colors outline-none ${
    hasError
      ? 'border-[#c74444] ring-2 ring-[#c74444]/15'
      : 'border-[#1a2945]/20 focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15'
  }`;
}

export default function AfterschoolPrograms({
  cms,
}: Readonly<{ cms?: AfterschoolProgramsContent }>) {
  const content = cms ?? DEFAULT_CMS_CONTENT.afterschoolPrograms;
  const registrationConfig: RegistrationValidationConfig = {
    activityOptions: content.activityOptions,
    preferredDayOptions: content.preferredDayOptions,
    validationMessages: content.validationMessages,
  };

  const [formData, setFormData] = useState<RegistrationPayload>(
    createInitialFormState
  );
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedPreferredDays = getPreferredDaySelections(
    formData.preferredDays,
    content.preferredDayOptions
  );

  // Trigger confetti when success modal appears
  useEffect(() => {
    if (submissionState?.kind === 'success') {
      // Multiple bursts for celebration effect
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      // First burst from left
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
      }, 0);

      // Second burst from right
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 200);

      // Third burst from center
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 80,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#c74444', '#1a7b8e', '#f5a347', '#f6dedd'],
        });
      }, 400);
    }
  }, [submissionState]);

  const applySingleFieldValidation = (
    field: RegistrationField,
    nextFormData: RegistrationPayload
  ) => {
    const nextErrors = getRegistrationFieldErrors(nextFormData, registrationConfig);

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



  const handlePreferredDayChange = (
    day: PreferredDayOption,
    checked: boolean
  ) => {
    setSubmissionState(null);

    setFormData((current) => {
      const currentDays = getPreferredDaySelections(
        current.preferredDays,
        content.preferredDayOptions
      );
      const nextDays = checked
        ? Array.from(new Set([...currentDays, day]))
        : currentDays.filter((item) => item !== day);

      const dayToActivitiesMap: Record<string, string[]> = {
        'Monday': ['CHESS', 'HOMEWORK HELP'],
        'Tuesday': ['ABACUS', 'BRAIN GAMES'],
        'Wednesday': ['ART', 'HOMEWORK HELP'],
        'Thursday': ['BRAIN GAMES', 'HOMEWORK HELP'],
        'Friday': ['CHESS', 'HOMEWORK HELP'],
      };

      const nextActivities: string[] = [];
      nextDays.forEach((d) => {
        const activitiesForDay = dayToActivitiesMap[d] || [];
        activitiesForDay.forEach((act) => {
          if (!nextActivities.includes(act)) {
            nextActivities.push(act);
          }
        });
      });

      const nextFormData = {
        ...current,
        preferredDays: formatPreferredDays(nextDays),
        activities: nextActivities,
      };

      if (nextActivities.length > 0) {
        setFieldErrors((curr) => {
          const updated = { ...curr };
          delete updated.activities;
          return updated;
        });
      }

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

  const handleCloseModal = () => {
    setSubmissionState(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFieldErrors = getRegistrationFieldErrors(
      formData,
      registrationConfig
    );

    if (hasRegistrationFieldErrors(nextFieldErrors)) {
      setFieldErrors(nextFieldErrors);
      setTouchedFields({
        parentName: true,
        studentName: true,
        email: true,
        phone: true,
        activities: true,
        preferredDays: true,
        startDate: true,
        notes: true,
      });
      setSubmissionState({
        kind: 'error',
        title: content.submissionMessages.invalidFormTitle,
        message: content.submissionMessages.invalidFormMessage,
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
            startDate: true,
            notes: true,
          }));
        }

        throw new Error(
          result?.error || content.submissionMessages.serverErrorMessage
        );
      }

      setFormData(createInitialFormState());
      setFieldErrors({});
      setTouchedFields({});
      setSubmissionState({
        kind: 'success',
        title: content.submissionMessages.successTitle,
        message:
          result?.message ||
          content.submissionMessages.successMessage,
      });
    } catch (error) {
      setSubmissionState({
        kind: 'error',
        title: content.submissionMessages.errorTitle,
        message:
          error instanceof Error
            ? error.message
            : content.submissionMessages.serverErrorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="afterschool"
      className="w-full scroll-mt-24 bg-gradient-to-b from-white via-[#f5e6e0]/20 to-[#f5e6e0]/40 px-6 py-16 text-[#1a2945] md:px-10 md:py-24 lg:px-16 relative overflow-hidden"
    >
      {/* Glowing background blobs to show off the glass blur effect */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#1a7b8e]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-[#f5a347]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-[#c74444]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl space-y-12 relative z-10">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-extrabold text-[#c74444] md:text-5xl">
            {content.heroTitle}
          </h2>
          <p className="text-lg font-semibold">{content.heroSubtitle}</p>
        </div>

        {/* Pricing Section - Moved to top */}
        <div className="mb-10 rounded-3xl bg-[#0e243a]/80 backdrop-blur-md p-8 text-white shadow-2xl shadow-[#0e243a]/25 border border-white/10 md:p-10 relative overflow-hidden">
          {/* Subtle reflection overlay */}
          <div className="absolute -left-1/2 -top-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rotate-45 pointer-events-none" />

          <h3 className="mb-2 text-center text-3xl font-bold relative z-10">
            {content.pricingTitle}
          </h3>
          <p className="mb-4 text-center text-sm text-white/85 relative z-10">
            Sign up early and save! Prices go up after September 26.
          </p>
          <p className="mb-8 text-center text-base font-semibold text-[#f5a347] relative z-10">
            Flexible Schedule: Drop off anytime between 3 and 6 upto 2 hours
          </p>

          {/* Regular Tuition Grid */}
          <div className="mb-10 relative z-10">
            <h4 className="mb-6 text-center text-lg font-bold uppercase tracking-wider text-[#4cd0e0]">
              General Afterschool Tuition
            </h4>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: '1 Day / Week',
                  earlyPrice: '$90',
                  regularPrice: '$100',
                  unit: 'day',
                  link: 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=8ac95c2d-5b74-11f1-a8e1-12a0879a85b1',
                },
                {
                  title: '2 or 3 Days / Week',
                  earlyPrice: '$80',
                  regularPrice: '$90',
                  unit: 'day',
                  link: 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=9c914479-5b74-11f1-a8e1-12a0879a85b1',
                },
                {
                  title: '4 or 5 Days / Week',
                  earlyPrice: '$350',
                  regularPrice: '$400',
                  unit: 'week',
                  link: 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=5fd0292f-5b74-11f1-a8e1-12a0879a85b1',
                },
                {
                  title: 'Monthly (School Days)',
                  earlyPrice: '$1,300',
                  regularPrice: '$1,500',
                  unit: 'month',
                  link: '#afterschool-form',
                },
              ].map((tier) => (
                <div
                  key={tier.title}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm p-6 text-center transition-all hover:-translate-y-1 hover:bg-white/15 hover:border-white/20 hover:shadow-xl hover:shadow-black/20"
                >
                  <div>
                    <h5 className="text-lg font-bold text-white min-h-[56px] flex items-center justify-center">
                      {tier.title}
                    </h5>
                    <div className="mt-4 space-y-1">
                      <p className="text-xs text-white/80">Early Bird Price</p>
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-3xl font-extrabold text-[#f5a347]">{tier.earlyPrice}</span>
                        {tier.unit && <span className="text-xs text-white/70">/{tier.unit}</span>}
                      </div>
                      <p className="text-[10px] text-white/60 italic">Until Sept 26</p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <p className="text-xs text-white/80">Regular Price</p>
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-xl font-bold text-white/95">{tier.regularPrice}</span>
                        {tier.unit && <span className="text-xs text-white/70">/{tier.unit}</span>}
                      </div>
                      <p className="text-[10px] text-white/60 italic">From Sept 26</p>
                    </div>
                  </div>
                  
                  {tier.link && tier.link.startsWith('http') ? (
                    <a
                      href={tier.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 block w-full rounded-xl bg-[#c74444] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#a63535] active:scale-95 shadow-md"
                    >
                      Pay Early Bird
                    </a>
                  ) : (
                    <a
                      href="#afterschool-form"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('afterschool-form');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="mt-6 block w-full rounded-xl bg-[#1a7b8e] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#145f6e] active:scale-95 shadow-md"
                    >
                      Register Below
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Pricing Grid */}
          <div className="border-t border-white/10 pt-8 relative z-10">
            <h4 className="mb-6 text-center text-lg font-bold uppercase tracking-wider text-[#f5a347]">
              Specialist Program Add-ons
            </h4>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Piano Add-on Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#f5a347]/20 bg-[#f5a347]/10 backdrop-blur-md p-6 transition-all hover:-translate-y-1 hover:bg-[#f5a347]/15 hover:border-[#f5a347]/40 hover:shadow-xl hover:shadow-[#f5a347]/5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold text-white">Piano Lesson Add-on</h5>
                    <span className="rounded-full bg-[#f5a347]/20 px-3 py-1 text-xs font-semibold text-[#f5a347]">
                      Private Lessons
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mb-6">
                    Enhance your child's schedule with premium private piano instruction.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <span className="text-sm text-white/90">Per Lesson</span>
                      <span className="text-lg font-extrabold text-[#f5a347]">$75</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <span className="text-sm text-white/90">Once a Week</span>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-[#f5a347]">$280</span>
                        <span className="text-[10px] text-white/70 block">/month</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <span className="text-sm text-white/90">Twice a Week</span>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-[#f5a347]">$550</span>
                        <span className="text-[10px] text-white/70 block">/month</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData((prev) => ({ ...prev, pianoLesson: true }));
                    const el = document.getElementById('piano-addon-field');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="mt-6 w-full rounded-xl bg-[#f5a347] px-4 py-3 text-sm font-bold text-[#0e243a] transition-all hover:bg-[#e49236] active:scale-95 shadow-md"
                >
                  Add Piano to Registration
                </button>
              </div>

              {/* Chess Add-on Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-[#1a7b8e]/30 bg-[#1a7b8e]/10 backdrop-blur-md p-6 transition-all hover:-translate-y-1 hover:bg-[#1a7b8e]/15 hover:border-[#1a7b8e]/50 hover:shadow-xl hover:shadow-[#1a7b8e]/5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold text-white">Chess Add-on</h5>
                    <span className="rounded-full bg-[#1a7b8e]/20 px-3 py-1 text-xs font-semibold text-[#1a7b8e]">
                      Expert Training
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mb-6">
                    Add dedicated chess training to develop strategy and critical thinking.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <span className="text-sm text-white/90">Per Lesson</span>
                      <span className="text-lg font-extrabold text-[#1a7b8e]">$60</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <span className="text-sm text-white/90">Once a Week</span>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-[#1a7b8e]">$220</span>
                        <span className="text-[10px] text-white/70 block">/month</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                      <span className="text-sm text-white/90">Twice a Week</span>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-[#1a7b8e]">$400</span>
                        <span className="text-[10px] text-white/70 block">/month</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData((prev) => ({ ...prev, chessAddon: true }));
                    const el = document.getElementById('chess-addon-field');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="mt-6 w-full rounded-xl bg-[#1a7b8e] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#145f6e] active:scale-95 shadow-md"
                >
                  Add Chess to Registration
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Day Schedule Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {content.activityOptions.map((option) => {
            const parts = option.split(':');
            const day = parts[0]?.trim();
            const activities = parts[1]?.trim();
            return (
              <div
                key={option}
                className="space-y-3 rounded-2xl border border-white/60 bg-white/30 backdrop-blur-sm p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:bg-white/50 hover:border-white/80 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold uppercase text-[#c74444]">
                    {day}
                  </h3>
                  {activities && (
                    <p className="mt-2 text-sm font-semibold text-[#1a2945]">
                      {activities}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1a2945]/70 mt-2">
                    {content.activityScheduleLabel}
                  </p>
                  <p className="text-sm font-semibold text-[#1a7b8e]">{content.activityTimeLabel}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Registration Form */}
        <div className="rounded-3xl border border-white/80 bg-[#f6dedd]/40 backdrop-blur-md p-8 shadow-xl md:p-10">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-[#c74444]">
              {content.registrationTitle}
            </h3>
            <p className="mt-3 text-sm text-[#1a2945]/75">
              {content.registrationDescription}
            </p>
          </div>

          {submissionState?.kind === 'error' ? (
            <div
              className="mb-6 flex items-start gap-3 rounded-2xl border border-[#c74444]/20 bg-[#c74444]/10 px-4 py-4 text-[#7a1f1f]"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">{submissionState.title}</p>
                <p className="mt-1 text-sm">{submissionState.message}</p>
              </div>
            </div>
          ) : null}

          {/* Thank You Modal */}
          {submissionState?.kind === 'success' ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-center">
                  <div className="rounded-full bg-[#1a7b8e]/10 p-4">
                    <CheckCircle2 className="h-12 w-12 text-[#1a7b8e]" />
                  </div>
                </div>
                <h3 className="mb-2 text-center text-2xl font-bold text-[#1a2945]">
                  {content.submissionMessages.successTitle}
                </h3>
                <p className="mb-6 text-center text-[#1a2945]/75">
                  {submissionState.message}
                </p>
                <p className="mb-6 text-center text-sm text-[#1a2945]/60">
                  A confirmation email has been sent to {formData.email || 'your email'}.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="w-full rounded-xl bg-[#c74444] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a63535]"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} noValidate className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="font-semibold">
                {content.parentNameLabel} <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="parentName"
                name="parentName"
                type="text"
                value={formData.parentName}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.parentName))}
                placeholder={content.parentNamePlaceholder}
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
                {content.studentNameLabel} <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="studentName"
                name="studentName"
                type="text"
                value={formData.studentName}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.studentName))}
                placeholder={content.studentNamePlaceholder}
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
                {content.emailLabel} <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.email))}
                placeholder={content.emailPlaceholder}
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
                {content.phoneLabel} <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.phone))}
                placeholder={content.phonePlaceholder}
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
                  {content.phoneHelperText}
                </span>
              </div>
            </label>

            {/* Preferred Days / Select Days */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  {content.preferredDaysLabel} <span className="text-[#c74444]">*</span>
                </p>
                <p className="text-sm text-[#1a2945]/65">
                  {selectedPreferredDays.length} {content.selectedCountSuffix}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {content.preferredDayOptions.map((day) => {
                  const isSelected = selectedPreferredDays.includes(day);
                  const dayDescriptions: Record<string, string> = {
                    'Monday': 'Chess & Homework Help',
                    'Tuesday': 'Abacus & Brain Games',
                    'Wednesday': 'Arts & Homework Help',
                    'Thursday': 'Brain Games & Homework Help',
                    'Friday': 'Chess & Homework Help',
                  };
                  const description = dayDescriptions[day];

                  return (
                    <label
                      key={`day-${day}`}
                      className={`flex flex-col justify-between rounded-xl border px-3 py-3 text-sm transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#1a7b8e]/40 bg-[#1a7b8e]/10'
                          : fieldErrors.preferredDays && touchedFields.preferredDays
                            ? 'border-[#c74444]/35 bg-white'
                            : 'border-[#1a2945]/20 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="preferredDays"
                          value={day}
                          checked={isSelected}
                          onChange={(event) =>
                            handlePreferredDayChange(day, event.target.checked)
                          }
                          onBlur={handlePreferredDaysBlur}
                          className="h-4 w-4 rounded text-[#1a7b8e] focus:ring-[#1a7b8e]"
                        />
                        <span className="font-bold">{day}</span>
                      </div>
                      {description && (
                        <span className="text-xs text-[#1a2945]/70 mt-1 pl-6">
                          {description}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              <p className="text-xs text-[#c74444]">
                {touchedFields.preferredDays ? fieldErrors.preferredDays : ''}
              </p>
            </div>

            {/* Add-on Options */}
            <div className="md:col-span-2 space-y-3">
              <p className="font-semibold">Add-on Options</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Piano Lesson Add-on option */}
                <div id="piano-addon-field">
                  <label className="flex items-center justify-between p-4 rounded-xl border border-[#1a7b8e]/20 bg-white hover:bg-white/80 cursor-pointer transition-colors shadow-sm h-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#f5a347]/10 text-[#f5a347] shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-[#1a2945]">Piano Lesson Add-on</p>
                        <p className="text-xs text-[#1a2945]/70">Add private piano lessons to your child's afterschool schedule</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="pianoLesson"
                      checked={formData.pianoLesson || false}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, pianoLesson: e.target.checked }));
                      }}
                      className="h-5 w-5 rounded text-[#1a7b8e] focus:ring-[#1a7b8e] shrink-0"
                    />
                  </label>
                </div>

                {/* Chess Add-on option */}
                <div id="chess-addon-field">
                  <label className="flex items-center justify-between p-4 rounded-xl border border-[#1a7b8e]/20 bg-white hover:bg-white/80 cursor-pointer transition-colors shadow-sm h-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#1a7b8e]/10 text-[#1a7b8e] shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-[#1a2945]">Chess Add-on</p>
                        <p className="text-xs text-[#1a2945]/70">Add dedicated Chess training to your child's afterschool schedule</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="chessAddon"
                      checked={formData.chessAddon || false}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, chessAddon: e.target.checked }));
                      }}
                      className="h-5 w-5 rounded text-[#1a7b8e] focus:ring-[#1a7b8e] shrink-0"
                    />
                  </label>
                </div>
              </div>
            </div>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="font-semibold">
                {content.startDateLabel} <span className="text-[#c74444]">*</span>
              </span>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={getInputClassName(Boolean(fieldErrors.startDate))}
                aria-invalid={Boolean(fieldErrors.startDate)}
                aria-describedby={fieldErrors.startDate ? 'startDate-error' : undefined}
                required
              />
              <span id="startDate-error" className="text-xs text-[#c74444]">
                {touchedFields.startDate ? fieldErrors.startDate : ''}
              </span>
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="font-semibold">{content.notesLabel}</span>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                className={`${getInputClassName(Boolean(fieldErrors.notes))} min-h-32`}
                placeholder={content.notesPlaceholder}
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
                {isSubmitting
                  ? content.submittingButtonLabel
                  : content.submitButtonLabel}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-[#1a2945]/75">
            {content.requiredFieldsNotice}
          </p>

          {/* Contact Info at bottom */}
          <div className="mt-8 rounded-xl bg-white/50 p-6 text-center">
            <p className="mb-2 font-semibold text-[#1a2945]">Questions? Contact us:</p>
            <div className="space-y-1 text-sm text-[#1a2945]/80">
              <p>Email: kidsprograms@exceedlearningcenterny.com</p>
              <p>Call: +1 (516) 226-3114</p>
              <p>Visit: 1360 Willis Ave, Albertson, NY 11507</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
