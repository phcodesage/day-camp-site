import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import {
  getRegistrationErrorMessage,
  type RegistrationFieldErrors,
  validateRegistrationPayload,
} from '@/lib/registration';
import { getCmsSectionContent } from '@/lib/cms/cms';
import type { RegistrationValidationMessages } from '@/lib/cms/types';
import { connectToDatabase } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';
import { sendRegistrationConfirmationEmail, type RegistrationEmailData } from '@/lib/email';

export const runtime = 'nodejs';

function getMongooseFieldMessage(
  fieldName: keyof RegistrationFieldErrors,
  kind: string | undefined,
  messages: RegistrationValidationMessages
) {
  switch (fieldName) {
    case 'parentName':
      return kind === 'maxlength'
        ? messages.parentNameTooLong
        : messages.parentNameRequired;
    case 'studentName':
      return kind === 'maxlength'
        ? messages.studentNameTooLong
        : messages.studentNameRequired;
    case 'email':
      return kind === 'required'
        ? messages.emailRequired
        : messages.emailInvalid;
    case 'phone':
      return kind === 'required'
        ? messages.phoneRequired
        : messages.phoneInvalid;
    case 'activities':
      return messages.activitiesRequired;
    case 'preferredDays':
      return kind === 'maxlength'
        ? messages.preferredDaysTooLong
        : messages.preferredDaysRequired;
    case 'startDate':
      return messages.startDateRequired;
    case 'notes':
      return messages.notesTooLong;
    default:
      return messages.genericReview;
  }
}

function getMongooseFieldErrors(
  error: mongoose.Error.ValidationError,
  messages: RegistrationValidationMessages
) {
  const fieldErrors: RegistrationFieldErrors = {};

  for (const [fieldName, fieldError] of Object.entries(error.errors)) {
    if (fieldName in Registration.schema.obj) {
      fieldErrors[fieldName as keyof RegistrationFieldErrors] =
        getMongooseFieldMessage(
          fieldName as keyof RegistrationFieldErrors,
          'kind' in fieldError ? fieldError.kind : undefined,
          messages
        );
    }
  }

  return fieldErrors;
}

export async function POST(request: Request) {
  const registrationContent = await getCmsSectionContent('afterschoolPrograms');
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: registrationContent.validationMessages.invalidPayload },
      { status: 400 }
    );
  }

  const validation = validateRegistrationPayload(body, {
    activityOptions: registrationContent.activityOptions,
    preferredDayOptions: registrationContent.preferredDayOptions,
    validationMessages: registrationContent.validationMessages,
  });

  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.error,
        fieldErrors: validation.fieldErrors,
      },
      { status: 400 }
    );
  }

  const { data } = validation;

  try {
    await connectToDatabase();

    const registration = new Registration({
      parentName: data.parentName,
      studentName: data.studentName,
      email: data.email,
      phone: data.phone,
      activities: data.activities,
      preferredDays: data.preferredDays,
      startDate: data.startDate,
      notes: data.notes || undefined,
    });

    await registration.save();

    // Send confirmation email
    try {
      const emailData: RegistrationEmailData = {
        parentName: data.parentName,
        studentName: data.studentName,
        email: data.email,
        phone: data.phone,
        activities: data.activities,
        preferredDays: data.preferredDays,
        startDate: data.startDate,
        notes: data.notes || undefined,
      };
      await sendRegistrationConfirmationEmail(emailData);
    } catch (emailError) {
      // Log email error but don't fail the registration
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json(
      {
        message: registrationContent.submissionMessages.successMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration failed:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      const fieldErrors = getMongooseFieldErrors(
        error,
        registrationContent.validationMessages
      );

      return NextResponse.json(
        {
          error: getRegistrationErrorMessage(
            fieldErrors,
            registrationContent.validationMessages
          ),
          fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: registrationContent.submissionMessages.serverErrorMessage,
      },
      { status: 500 }
    );
  }
}
