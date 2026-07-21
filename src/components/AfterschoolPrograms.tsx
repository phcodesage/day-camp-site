'use client';

import { 
  AlertCircle, 
  CheckCircle2, 
  Calculator, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight,
  Music,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import {
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  GRADE_OPTIONS,
  SUBJECT_OPTIONS,
  TUITION_PLAN_OPTIONS,
  PREFERRED_DAY_OPTIONS,
  calculateTotalAmount,
  getRegistrationFieldErrors,
  getPreferredDaySelections,
  type RegistrationField,
  type RegistrationFieldErrors,
  type RegistrationPayload,
  type RegistrationValidationConfig,
} from '@/lib/registration';
import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type { AfterschoolProgramsContent } from '@/lib/cms/types';

const VALOR_PAYMENT_URL = 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=9c67fe06-8538-11f1-8d9b-128462456e49';

type SubmissionState =
  | null
  | {
      kind: 'success' | 'error';
      title: string;
      message: string;
      totalAmount?: number;
    };

type EditableField = Exclude<RegistrationField, 'activities' | 'preferredDays' | 'subjects'>;
type TouchedFields = Partial<Record<RegistrationField, boolean>>;

function createInitialFormState(): RegistrationPayload {
  return {
    parentName: '',
    studentName: '',
    email: '',
    phone: '',
    grade: 'Kindergarten',
    subjects: ['Math', 'Homework Help'],
    activities: [],
    preferredDays: 'Monday, Wednesday, Friday',
    tuitionPlan: '2or3days',
    startDate: '',
    endDate: '',
    notes: '',
    pianoLesson: false,
    pianoFrequency: 'single',
    chessAddon: false,
    chessFrequency: 'single',
    totalAmount: 240,
  };
}

function getInputClassName(hasError: boolean) {
  return `rounded-xl border bg-white/95 px-4 py-3.5 text-base sm:text-lg transition-all outline-none text-[#1a2945] font-medium ${
    hasError
      ? 'border-[#c74444] ring-2 ring-[#c74444]/20'
      : 'border-[#1a2945]/25 focus:border-[#1a7b8e] focus:bg-white focus:ring-2 focus:ring-[#1a7b8e]/20'
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

  const [formData, setFormData] = useState<RegistrationPayload>(createInitialFormState);
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPreferredDays = getPreferredDaySelections(
    formData.preferredDays,
    PREFERRED_DAY_OPTIONS
  );

  // Live total calculation
  const computedTotal = calculateTotalAmount(formData);

  // Trigger confetti when success modal appears
  useEffect(() => {
    if (submissionState?.kind === 'success') {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 60,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
      }, 0);

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 60,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 200);

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 90,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#c74444', '#1a7b8e', '#f5a347', '#4cd0e0'],
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
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { value, name } = event.target;

    setSubmissionState(null);
    setFormData((current) => {
      const nextFormData = {
        ...current,
        [name]: value,
      };
      applySingleFieldValidation(name as RegistrationField, nextFormData);
      return nextFormData;
    });
  };

  const handleFieldBlur = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = event.target.name as EditableField;
    setTouchedFields((current) => ({
      ...current,
      [name]: true,
    }));
    applySingleFieldValidation(name, formData);
  };

  const handlePreferredDayChange = (day: string, isChecked: boolean) => {
    setSubmissionState(null);

    const currentDays = getPreferredDaySelections(
      formData.preferredDays,
      PREFERRED_DAY_OPTIONS
    );

    const nextDays = isChecked
      ? Array.from(new Set([...currentDays, day]))
      : currentDays.filter((selectedDay) => selectedDay !== day);

    const formattedDays = nextDays.join(', ');

    setFormData((current) => {
      const nextFormData = {
        ...current,
        preferredDays: formattedDays,
      };
      applySingleFieldValidation('preferredDays', nextFormData);
      return nextFormData;
    });
  };

  const handleSubjectChange = (subject: string, isChecked: boolean) => {
    setSubmissionState(null);
    setFormData((current) => {
      const currentSubjects = current.subjects || [];
      const nextSubjects = isChecked
        ? Array.from(new Set([...currentSubjects, subject]))
        : currentSubjects.filter((s) => s !== subject);

      return {
        ...current,
        subjects: nextSubjects,
      };
    });
  };

  const handlePreferredDaysBlur = () => {
    setTouchedFields((current) => ({
      ...current,
      preferredDays: true,
    }));
    applySingleFieldValidation('preferredDays', formData);
  };

  const selectPlanAndScroll = (planId: string) => {
    setFormData((prev) => ({ ...prev, tuitionPlan: planId }));
    const formEl = document.getElementById('afterschool-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouchedFields({
      parentName: true,
      studentName: true,
      email: true,
      phone: true,
      preferredDays: true,
      startDate: true,
      notes: true,
    });

    const currentFieldErrors = getRegistrationFieldErrors(
      formData,
      registrationConfig
    );
    setFieldErrors(currentFieldErrors);

    if (Object.keys(currentFieldErrors).length > 0) {
      setSubmissionState({
        kind: 'error',
        title: content.submissionMessages.invalidFormTitle,
        message: content.submissionMessages.invalidFormMessage,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionState(null);

    const payloadWithTotal = {
      ...formData,
      totalAmount: computedTotal,
    };

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadWithTotal),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result?.fieldErrors) {
          setFieldErrors(result.fieldErrors);
          setTouchedFields((current) => ({
            ...current,
            ...Object.keys(result.fieldErrors).reduce(
              (acc, field) => ({ ...acc, [field]: true }),
              {}
            ),
          }));
        }

        throw new Error(
          result?.error || content.submissionMessages.serverErrorMessage
        );
      }

      setSubmissionState({
        kind: 'success',
        title: content.submissionMessages.successTitle,
        message:
          result?.message ||
          content.submissionMessages.successMessage,
        totalAmount: computedTotal,
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

  const handleCloseModal = () => {
    setSubmissionState(null);
  };

  return (
    <section
      id="afterschool"
      className="w-full scroll-mt-28 bg-gradient-to-b from-white via-[#f5e6e0]/30 to-[#f5e6e0]/50 pt-20 md:pt-24 pb-16 md:pb-24 text-[#1a2945] relative overflow-clip flex flex-col items-center justify-center"
    >
      {/* Background glowing decorations */}
      <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-[#1a7b8e]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-[#f5a347]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-[#c74444]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 mx-auto">
        
        {/* Title Section */}
        <div className="space-y-4 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#c74444]/10 px-5 py-2 text-sm font-extrabold uppercase tracking-wider text-[#c74444]">
            <Sparkles className="h-5 w-5" /> Flexible Tutoring & Afterschool Care
          </span>
          <h2 className="text-4xl font-extrabold text-[#c74444] sm:text-5xl lg:text-6xl tracking-tight">
            {content.heroTitle}
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-[#1a2945]/90">
            Tutoring & Programs Available <span className="font-extrabold text-[#1a7b8e]">Sunday through Friday</span>. Custom amounts depend on your chosen schedule & subjects.
          </p>
        </div>

        {/* Pricing & Plan Cards Section */}
        <div className="rounded-3xl bg-[#0e243a]/95 backdrop-blur-xl p-6 sm:p-10 md:p-12 text-white shadow-2xl shadow-[#0e243a]/30 border border-white/10 relative overflow-hidden">
          <div className="absolute -left-1/2 -top-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rotate-45 pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {content.pricingTitle} & Program Tiers
            </h3>
            <p className="text-base sm:text-lg text-white/90">
              No fixed amount — prices depend on your customized day & subject selection. Choose your plan below to customize your schedule in the form!
            </p>
            <div className="inline-block mt-2 rounded-2xl bg-white/10 border border-white/20 px-5 py-2.5 text-sm sm:text-base text-[#f5a347] font-bold shadow-sm">
              ✨ Early Bird Prices available until September 26! Drop off anytime 3:00 - 6:00 PM.
            </div>
          </div>

          {/* Regular Tuition Grid */}
          <div className="mb-10 relative z-10">
            <h4 className="mb-6 text-center text-base sm:text-lg font-extrabold uppercase tracking-widest text-[#4cd0e0]">
              General Afterschool Tuition Options
            </h4>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  id: '1day',
                  title: '1 Day / Week',
                  earlyPrice: '$90',
                  regularPrice: '$100',
                  unit: 'day',
                  subtitle: 'Ideal for focused tutoring or single subject help',
                },
                {
                  id: '2or3days',
                  title: '2 or 3 Days / Week',
                  earlyPrice: '$80',
                  regularPrice: '$90',
                  unit: 'day',
                  subtitle: 'Most Popular for balanced study & activities',
                },
                {
                  id: '4or5days',
                  title: '4 or 5 Days / Week',
                  earlyPrice: '$350',
                  regularPrice: '$400',
                  unit: 'week',
                  subtitle: 'Full week enrichment and comprehensive care',
                },
                {
                  id: 'monthly',
                  title: 'Monthly (School Days)',
                  earlyPrice: '$1,300',
                  regularPrice: '$1,500',
                  unit: 'month',
                  subtitle: 'Complete monthly package for maximum savings',
                },
              ].map((tier) => (
                <div
                  key={tier.id}
                  className="flex flex-col justify-between rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-6 sm:p-7 text-center transition-all hover:-translate-y-1 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl"
                >
                  <div>
                    <h5 className="text-xl sm:text-2xl font-bold text-white min-h-[56px] flex items-center justify-center">
                      {tier.title}
                    </h5>
                    <p className="text-xs sm:text-sm text-white/80 mb-5 min-h-[40px]">{tier.subtitle}</p>
                    
                    <div className="space-y-1 rounded-2xl bg-white/10 p-4 border border-white/10">
                      <p className="text-xs text-white/90 font-bold uppercase tracking-wider">Early Bird Rate</p>
                      <div className="flex flex-wrap items-baseline justify-center gap-x-1 gap-y-0.5">
                        <span className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black text-[#f5a347] leading-none">
                          {tier.earlyPrice}
                        </span>
                        {tier.unit && (
                          <span className="text-xs sm:text-sm font-semibold text-white/70 whitespace-nowrap">
                            /{tier.unit}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70 italic">Until Sept 26</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/15">
                      <p className="text-xs sm:text-sm text-white/80">Regular Rate: <span className="font-extrabold text-white">{tier.regularPrice}</span>/{tier.unit}</p>
                    </div>
                  </div>
                  
                  {/* Action Button: Scroll to form and select plan */}
                  <button
                    type="button"
                    onClick={() => selectPlanAndScroll(tier.id)}
                    className="mt-6 w-full rounded-2xl bg-[#1a7b8e] px-5 py-3.5 text-sm sm:text-base font-extrabold text-white transition-all hover:bg-[#145f6e] active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    Select Plan & Register <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Pricing Grid */}
          <div className="border-t border-white/15 pt-8 relative z-10">
            <h4 className="mb-6 text-center text-base sm:text-lg font-extrabold uppercase tracking-widest text-[#f5a347]">
              Specialist Program Add-ons
            </h4>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Piano Add-on Card */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#f5a347]/30 bg-[#f5a347]/10 backdrop-blur-md p-6 sm:p-8 transition-all hover:-translate-y-1 hover:bg-[#f5a347]/15">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
                      <Music className="h-7 w-7 text-[#f5a347]" /> Piano Lessons
                    </h5>
                    <span className="rounded-full bg-[#f5a347]/20 px-4 py-1.5 text-xs sm:text-sm font-bold text-[#f5a347]">
                      Private Instruction
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-white/90 mb-6">
                    Enhance your child's schedule with private piano lessons tailored to their skill level.
                  </p>
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3 border border-white/10">
                      <span className="text-white/90 font-medium">Per Single Lesson</span>
                      <span className="font-extrabold text-xl text-[#f5a347]">$75</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3 border border-white/10">
                      <span className="text-white/90 font-medium">Once a Week</span>
                      <span className="font-extrabold text-xl text-[#f5a347]">$280 / month</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3 border border-white/10">
                      <span className="text-white/90 font-medium">Twice a Week</span>
                      <span className="font-extrabold text-xl text-[#f5a347]">$550 / month</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, pianoLesson: true }));
                    selectPlanAndScroll(formData.tuitionPlan || '2or3days');
                  }}
                  className="mt-6 w-full rounded-2xl bg-[#f5a347] px-5 py-3.5 text-sm sm:text-base font-extrabold text-[#0e243a] transition-all hover:bg-[#e49236] active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  + Add Piano to Registration Form
                </button>
              </div>

              {/* Chess Add-on Card */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#4cd0e0]/30 bg-[#4cd0e0]/10 backdrop-blur-md p-6 sm:p-8 transition-all hover:-translate-y-1 hover:bg-[#4cd0e0]/15">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
                      <Trophy className="h-7 w-7 text-[#4cd0e0]" /> Chess Training
                    </h5>
                    <span className="rounded-full bg-[#4cd0e0]/20 px-4 py-1.5 text-xs sm:text-sm font-bold text-[#4cd0e0]">
                      Expert Strategy
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-white/90 mb-6">
                    Add dedicated chess tactics and strategic critical thinking instruction.
                  </p>
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3 border border-white/10">
                      <span className="text-white/90 font-medium">Per Single Lesson</span>
                      <span className="font-extrabold text-xl text-[#4cd0e0]">$60</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3 border border-white/10">
                      <span className="text-white/90 font-medium">Once a Week</span>
                      <span className="font-extrabold text-xl text-[#4cd0e0]">$220 / month</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-3 border border-white/10">
                      <span className="text-white/90 font-medium">Twice a Week</span>
                      <span className="font-extrabold text-xl text-[#4cd0e0]">$400 / month</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, chessAddon: true }));
                    selectPlanAndScroll(formData.tuitionPlan || '2or3days');
                  }}
                  className="mt-6 w-full rounded-2xl bg-[#1a7b8e] px-5 py-3.5 text-sm sm:text-base font-extrabold text-white transition-all hover:bg-[#145f6e] active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  + Add Chess to Registration Form
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Day Schedule Grid - Sunday to Friday */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-[#1a2945]">Available Days & Programs</h3>
            <p className="text-sm sm:text-base text-[#1a2945]/80 font-medium">Choose any days from Sunday to Friday that work best for your child.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { day: 'Sunday', title: 'Custom Tutoring', desc: '1-on-1 Prep & Intensive Review', color: 'bg-purple-50 border-purple-300 text-purple-900' },
              { day: 'Monday', title: 'Chess & Homework', desc: 'Strategic Thinking & Study', color: 'bg-blue-50 border-blue-300 text-blue-900' },
              { day: 'Tuesday', title: 'Abacus & Brain', desc: 'Mental Math & Cognitive Speed', color: 'bg-amber-50 border-amber-300 text-amber-900' },
              { day: 'Wednesday', title: 'Arts & Homework', desc: 'Creative Expression & Projects', color: 'bg-rose-50 border-rose-300 text-rose-900' },
              { day: 'Thursday', title: 'Brain & Homework', desc: 'Puzzles, Logic & Study Skills', color: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
              { day: 'Friday', title: 'Chess & Homework', desc: 'Tactic Challenges & Review', color: 'bg-teal-50 border-teal-300 text-teal-900' },
            ].map((item) => (
              <div
                key={item.day}
                className={`rounded-2xl border-2 p-5 text-center shadow-sm flex flex-col justify-between transition-all hover:-translate-y-1 ${item.color}`}
              >
                <div>
                  <h4 className="text-lg font-extrabold uppercase">{item.day}</h4>
                  <p className="mt-1 text-sm font-bold">{item.title}</p>
                  <p className="mt-1 text-xs opacity-90">{item.desc}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-black/10">
                  <span className="text-xs font-bold opacity-80">3:00 - 6:00 PM</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REGISTRATION FORM SECTION WITH SIDEBAR & BOTTOM SUMMARY */}
        <div id="afterschool-form" className="scroll-mt-28">
          <div className="rounded-3xl border-2 border-white/80 bg-white/75 backdrop-blur-xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-10">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#c74444]">
                {content.registrationTitle}
              </h3>
              <p className="text-base sm:text-lg text-[#1a2945]/90 font-medium">
                {content.registrationDescription}
              </p>
            </div>

            {submissionState?.kind === 'error' ? (
              <div
                className="flex items-start gap-3 rounded-2xl border-2 border-[#c74444]/40 bg-[#c74444]/10 px-6 py-5 text-[#7a1f1f]"
                role="alert"
              >
                <AlertCircle className="mt-1 h-6 w-6 shrink-0" />
                <div>
                  <p className="font-bold text-base">{submissionState.title}</p>
                  <p className="mt-1 text-sm">{submissionState.message}</p>
                </div>
              </div>
            ) : null}

            {/* Main Form Container */}
            <form onSubmit={handleSubmit} noValidate className="space-y-10">
              
              {/* 2-Column Layout: Left = Inputs, Right = Sticky Sidebar */}
              <div className="grid gap-8 lg:grid-cols-12 items-start relative">
                
                {/* LEFT COLUMN: Input Fields (8 cols on lg) */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Contact Information Group */}
                  <div className="rounded-3xl border border-[#1a2945]/15 bg-white/90 p-6 sm:p-8 space-y-5 shadow-sm">
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#1a2945] flex items-center gap-3 border-b border-[#1a2945]/10 pb-4">
                      <GraduationCap className="h-7 w-7 text-[#1a7b8e]" /> Student & Parent Contact Details
                    </h4>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#1a2945]">
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
                          required
                        />
                        {fieldErrors.parentName && touchedFields.parentName && (
                          <span className="text-xs sm:text-sm font-semibold text-[#c74444]">{fieldErrors.parentName}</span>
                        )}
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#1a2945]">
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
                          required
                        />
                        {fieldErrors.studentName && touchedFields.studentName && (
                          <span className="text-xs sm:text-sm font-semibold text-[#c74444]">{fieldErrors.studentName}</span>
                        )}
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#1a2945]">
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
                          required
                        />
                        {fieldErrors.email && touchedFields.email && (
                          <span className="text-xs sm:text-sm font-semibold text-[#c74444]">{fieldErrors.email}</span>
                        )}
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#1a2945]">
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
                          aria-invalid={Boolean(fieldErrors.phone)}
                          required
                        />
                        {fieldErrors.phone && touchedFields.phone && (
                          <span className="text-xs sm:text-sm font-semibold text-[#c74444]">{fieldErrors.phone}</span>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Grade & Tuition Plan Selection */}
                  <div className="rounded-3xl border border-[#1a2945]/15 bg-white/90 p-6 sm:p-8 space-y-5 shadow-sm">
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#1a2945] flex items-center gap-3 border-b border-[#1a2945]/10 pb-4">
                      <BookOpen className="h-7 w-7 text-[#f5a347]" /> Grade Level & Tuition Plan
                    </h4>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#1a2945]">
                          Grade Level <span className="text-[#c74444]">*</span>
                        </span>
                        <select
                          name="grade"
                          value={formData.grade}
                          onChange={handleFieldChange}
                          className={getInputClassName(false)}
                        >
                          {GRADE_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#1a2945]">
                          Tuition Package Tier
                        </span>
                        <select
                          name="tuitionPlan"
                          value={formData.tuitionPlan}
                          onChange={handleFieldChange}
                          className={getInputClassName(false)}
                        >
                          {TUITION_PLAN_OPTIONS.map((plan) => (
                            <option key={plan.id} value={plan.id}>{plan.label}</option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#1a2945]">
                          Desired Start Date <span className="text-[#c74444]">*</span>
                        </span>
                        <input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleFieldChange}
                          onBlur={handleFieldBlur}
                          className={getInputClassName(Boolean(fieldErrors.startDate))}
                          required
                        />
                        {fieldErrors.startDate && touchedFields.startDate && (
                          <span className="text-xs sm:text-sm font-semibold text-[#c74444]">{fieldErrors.startDate}</span>
                        )}
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#1a2945]">
                          Desired End Date (Optional)
                        </span>
                        <input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate || ''}
                          onChange={handleFieldChange}
                          className={getInputClassName(false)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Preferred Tutoring / Program Days (Sunday to Friday) */}
                  <div className="rounded-3xl border border-[#1a2945]/15 bg-white/90 p-6 sm:p-8 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a2945]/10 pb-4">
                      <h4 className="text-xl sm:text-2xl font-extrabold text-[#1a2945] flex items-center gap-3">
                        <Calendar className="h-7 w-7 text-[#1a7b8e]" /> Available Days for Tutoring & Afterschool <span className="text-[#c74444]">*</span>
                      </h4>
                      <span className="rounded-full bg-[#1a7b8e]/15 px-4 py-1.5 text-sm font-bold text-[#1a7b8e]">
                        {selectedPreferredDays.length} day(s) selected
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#1a2945]/80 font-medium">
                      We offer programs from <strong className="text-[#1a7b8e] font-extrabold">Sunday to Friday</strong>. Select all days your student will attend:
                    </p>

                    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                      {PREFERRED_DAY_OPTIONS.map((day) => {
                        const isSelected = selectedPreferredDays.includes(day);
                        return (
                          <label
                            key={`day-${day}`}
                            className={`flex items-center justify-between rounded-2xl border-2 p-4 text-sm sm:text-base font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#1a7b8e] bg-[#1a7b8e]/15 shadow-md text-[#145f6e]'
                                : 'border-[#1a2945]/20 bg-white hover:border-[#1a7b8e]/50 text-[#1a2945]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                name="preferredDays"
                                value={day}
                                checked={isSelected}
                                onChange={(event) =>
                                  handlePreferredDayChange(day, event.target.checked)
                                }
                                onBlur={handlePreferredDaysBlur}
                                className="h-5 w-5 rounded text-[#1a7b8e] focus:ring-[#1a7b8e]"
                              />
                              <span>{day}</span>
                            </div>
                            {day === 'Sunday' && <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-extrabold">Weekend</span>}
                          </label>
                        );
                      })}
                    </div>

                    {fieldErrors.preferredDays && touchedFields.preferredDays && (
                      <p className="text-xs sm:text-sm text-[#c74444] font-bold">{fieldErrors.preferredDays}</p>
                    )}
                  </div>

                  {/* Subjects & Field of Tutoring */}
                  <div className="rounded-3xl border border-[#1a2945]/15 bg-white/90 p-6 sm:p-8 space-y-4 shadow-sm">
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#1a2945] flex items-center gap-3 border-b border-[#1a2945]/10 pb-4">
                      <BookOpen className="h-7 w-7 text-[#c74444]" /> Subjects & Tutoring Fields Needed
                    </h4>
                    <p className="text-sm sm:text-base text-[#1a2945]/80 font-medium">
                      Select all subjects or areas where your student requires instruction or guidance:
                    </p>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      {SUBJECT_OPTIONS.map((subject) => {
                        const isSelected = (formData.subjects || []).includes(subject);
                        return (
                          <label
                            key={`subject-${subject}`}
                            className={`flex items-center gap-3.5 rounded-2xl border-2 p-4 text-sm sm:text-base font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#c74444] bg-[#c74444]/15 text-[#7a1f1f] shadow-md'
                                : 'border-[#1a2945]/20 bg-white hover:border-[#c74444]/50 text-[#1a2945]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              value={subject}
                              checked={isSelected}
                              onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                              className="h-5 w-5 rounded text-[#c74444] focus:ring-[#c74444]"
                            />
                            <span>{subject}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add-on Options (Piano & Chess) */}
                  <div className="rounded-3xl border border-[#1a2945]/15 bg-white/90 p-6 sm:p-8 space-y-5 shadow-sm">
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#1a2945] flex items-center gap-3 border-b border-[#1a2945]/10 pb-4">
                      <Sparkles className="h-7 w-7 text-[#f5a347]" /> Specialist Lessons & Add-ons
                    </h4>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Piano Addon */}
                      <div className={`rounded-2xl border-2 p-5 space-y-4 transition-all ${formData.pianoLesson ? 'border-[#f5a347] bg-[#f5a347]/15' : 'border-[#1a2945]/20 bg-white'}`}>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="font-extrabold text-base sm:text-lg text-[#1a2945] flex items-center gap-2.5">
                            <Music className="h-6 w-6 text-[#f5a347]" /> Piano Lessons
                          </span>
                          <input
                            type="checkbox"
                            name="pianoLesson"
                            checked={formData.pianoLesson || false}
                            onChange={(e) => setFormData((prev) => ({ ...prev, pianoLesson: e.target.checked }))}
                            className="h-5 w-5 rounded text-[#f5a347] focus:ring-[#f5a347]"
                          />
                        </label>
                        {formData.pianoLesson && (
                          <div className="pt-3 border-t border-[#1a2945]/15 space-y-2">
                            <span className="text-xs sm:text-sm font-bold text-[#1a2945] block">Select Frequency:</span>
                            <select
                              name="pianoFrequency"
                              value={formData.pianoFrequency || 'single'}
                              onChange={handleFieldChange}
                              className="w-full text-sm sm:text-base rounded-xl border border-[#1a2945]/25 p-3 bg-white font-semibold text-[#1a2945]"
                            >
                              <option value="single">Per Single Lesson (+$75)</option>
                              <option value="once_weekly">Once a Week (+$280/mo)</option>
                              <option value="twice_weekly">Twice a Week (+$550/mo)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Chess Addon */}
                      <div className={`rounded-2xl border-2 p-5 space-y-4 transition-all ${formData.chessAddon ? 'border-[#1a7b8e] bg-[#1a7b8e]/15' : 'border-[#1a2945]/20 bg-white'}`}>
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="font-extrabold text-base sm:text-lg text-[#1a2945] flex items-center gap-2.5">
                            <Trophy className="h-6 w-6 text-[#1a7b8e]" /> Chess Training
                          </span>
                          <input
                            type="checkbox"
                            name="chessAddon"
                            checked={formData.chessAddon || false}
                            onChange={(e) => setFormData((prev) => ({ ...prev, chessAddon: e.target.checked }))}
                            className="h-5 w-5 rounded text-[#1a7b8e] focus:ring-[#1a7b8e]"
                          />
                        </label>
                        {formData.chessAddon && (
                          <div className="pt-3 border-t border-[#1a2945]/15 space-y-2">
                            <span className="text-xs sm:text-sm font-bold text-[#1a2945] block">Select Frequency:</span>
                            <select
                              name="chessFrequency"
                              value={formData.chessFrequency || 'single'}
                              onChange={handleFieldChange}
                              className="w-full text-sm sm:text-base rounded-xl border border-[#1a2945]/25 p-3 bg-white font-semibold text-[#1a2945]"
                            >
                              <option value="single">Per Single Lesson (+$60)</option>
                              <option value="once_weekly">Once a Week (+$220/mo)</option>
                              <option value="twice_weekly">Twice a Week (+$400/mo)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="rounded-3xl border border-[#1a2945]/15 bg-white/90 p-6 sm:p-8 space-y-3 shadow-sm">
                    <label className="flex flex-col gap-2">
                      <span className="text-sm sm:text-base font-bold text-[#1a2945]">
                        {content.notesLabel} / Special Instructions
                      </span>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        className={`${getInputClassName(Boolean(fieldErrors.notes))} min-h-28`}
                        placeholder={content.notesPlaceholder}
                        maxLength={MAX_NOTES_LENGTH}
                      />
                    </label>
                  </div>

                </div>

                {/* RIGHT COLUMN: STICKY LIVE CALCULATED TOTAL SIDEBAR (4 cols on lg) */}
                <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                  <div className="rounded-3xl border-2 border-[#1a7b8e]/40 bg-gradient-to-br from-[#0e243a] via-[#163654] to-[#0e243a] p-6 text-white shadow-2xl relative overflow-hidden">
                    
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-6 w-6 text-[#f5a347]" />
                        <h4 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider">
                          Summary Sidebar
                        </h4>
                      </div>
                      <span className="rounded-full bg-[#1a7b8e]/30 px-3 py-1 text-xs font-extrabold text-[#4cd0e0]">
                        Live Estimate
                      </span>
                    </div>

                    {/* Big Calculated Total Amount Display */}
                    <div className="rounded-2xl bg-white/10 p-5 text-center border border-white/15 backdrop-blur-md mb-6 space-y-1">
                      <span className="text-xs text-white/80 uppercase tracking-widest font-extrabold block">
                        Calculated Total Amount
                      </span>
                      <div className="text-4xl sm:text-5xl font-black text-[#f5a347] tracking-tight">
                        ${computedTotal.toFixed(2)}
                      </div>
                      <p className="text-xs text-white/70 italic pt-1">
                        Amount computed based on your selected days & options
                      </p>
                    </div>

                    {/* Summary Breakdown List */}
                    <div className="space-y-3 text-xs sm:text-sm mb-6 border-b border-white/10 pb-6">
                      <div className="flex items-center justify-between text-white/90">
                        <span className="text-white/70">Selected Days:</span>
                        <span className="font-bold text-white">{selectedPreferredDays.length} day(s)</span>
                      </div>
                      <div className="text-[11px] text-[#4cd0e0] font-semibold pl-2">
                        ({selectedPreferredDays.join(', ') || 'None selected'})
                      </div>

                      <div className="flex items-center justify-between text-white/90 pt-1">
                        <span className="text-white/70">Grade Level:</span>
                        <span className="font-bold text-white">{formData.grade || 'Not selected'}</span>
                      </div>

                      <div className="flex items-center justify-between text-white/90">
                        <span className="text-white/70">Subjects:</span>
                        <span className="font-bold text-white">{(formData.subjects || []).length} subject(s)</span>
                      </div>

                      {formData.pianoLesson && (
                        <div className="flex items-center justify-between text-[#f5a347] font-bold">
                          <span>+ Piano Add-on:</span>
                          <span>Included</span>
                        </div>
                      )}

                      {formData.chessAddon && (
                        <div className="flex items-center justify-between text-[#4cd0e0] font-bold">
                          <span>+ Chess Add-on:</span>
                          <span>Included</span>
                        </div>
                      )}
                    </div>

                    {/* 3-Step Process Guide */}
                    <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-2xl text-xs sm:text-sm">
                      <p className="font-bold text-[#f5a347] uppercase tracking-wider text-xs">
                        How Payment Works:
                      </p>
                      <ol className="space-y-2 text-white/80 list-decimal pl-4">
                        <li>Complete & submit this form.</li>
                        <li>Review total amount of <strong className="text-white">${computedTotal.toFixed(2)}</strong>.</li>
                        <li>Click Valor Pay link after submitting to enter amount.</li>
                      </ol>
                    </div>

                    {/* Sidebar Submit Form Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-2xl bg-[#c74444] px-6 py-4 text-base font-extrabold text-white transition-all hover:bg-[#a63535] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#c74444]/60 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        content.submittingButtonLabel
                      ) : (
                        <>
                          <span>Submit (${computedTotal.toFixed(2)})</span>
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-center text-xs text-white/60">
                      {content.requiredFieldsNotice}
                    </p>
                  </div>

                  {/* Contact Help box in sidebar */}
                  <div className="rounded-2xl border border-[#1a2945]/15 bg-white/90 p-5 text-center text-xs sm:text-sm space-y-1.5 shadow-sm">
                    <p className="font-bold text-[#1a2945]">Have questions about pricing?</p>
                    <p className="text-[#1a2945]/80">Call us at <a href="tel:+15162263114" className="font-bold text-[#1a7b8e] hover:underline">+1 (516) 226-3114</a></p>
                    <p className="text-[#1a2945]/80">Email: <a href="mailto:kidsprograms@exceedlearningcenterny.com" className="font-bold text-[#1a7b8e] hover:underline">kidsprograms@exceedlearningcenterny.com</a></p>
                  </div>
                </div>

              </div>

            </form>
          </div>
        </div>

        {/* SUCCESS MODAL WITH VALOR PAY LINK */}
        {submissionState?.kind === 'success' ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-10 shadow-2xl border border-white/20 text-center space-y-6">
              
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1a7b8e]/15 text-[#1a7b8e]">
                <CheckCircle2 className="h-12 w-12 text-[#1a7b8e]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1a2945]">
                  {content.submissionMessages.successTitle}
                </h3>
                <p className="text-base sm:text-lg text-[#1a2945]/80 font-medium">
                  {submissionState.message}
                </p>
              </div>

              {/* Total Amount Box */}
              <div className="rounded-2xl bg-[#f5e6e0]/80 p-6 border-2 border-[#c74444]/30">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1a2945]/80">
                  Your Registration Total Amount:
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[#c74444] mt-2">
                  ${(submissionState.totalAmount || computedTotal).toFixed(2)}
                </div>
                <p className="text-xs sm:text-sm text-[#1a2945]/80 mt-2 font-medium">
                  A confirmation email has been sent to <strong>{formData.email || 'your email'}</strong>.
                </p>
              </div>



              {/* Direct Valor Pay Link Call to Action */}
              <div className="rounded-3xl bg-[#0e243a] p-6 sm:p-8 text-white space-y-4 text-center shadow-xl">
                <div className="flex items-center justify-center gap-2 text-[#f5a347] font-extrabold text-base sm:text-lg">
                  <ShieldCheck className="h-6 w-6" /> Ready to Settle Payment?
                </div>
                <p className="text-xs sm:text-sm text-white/90">
                  Please click the link below to open Valor Pay. Enter your total amount of <strong className="text-[#f5a347] font-extrabold text-base">${(submissionState.totalAmount || computedTotal).toFixed(2)}</strong> on the portal to finalize your payment:
                </p>

                <a
                  href={VALOR_PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-2xl bg-[#c74444] px-6 py-4 text-base sm:text-lg font-black text-white transition-all hover:bg-[#a63535] active:scale-95 shadow-xl flex items-center justify-center gap-3"
                >
                  <span>Pay ${(submissionState.totalAmount || computedTotal).toFixed(2)} via Valor Pay</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-full rounded-2xl border-2 border-[#1a2945]/20 bg-gray-100 px-6 py-3.5 font-extrabold text-[#1a2945] transition-colors hover:bg-gray-200 text-base"
              >
                Close & Return to Site
              </button>
            </div>
          </div>
        ) : null}

      </div>
    </section>
  );
}
