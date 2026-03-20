import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import {
  getRegistrationErrorMessage,
  type RegistrationFieldErrors,
  validateRegistrationPayload,
} from '@/lib/registration';
import { connectToDatabase, getMongoErrorMessage } from '@/lib/mongodb';
import Registration from '@/lib/models/Registration';

export const runtime = 'nodejs';

function getMongooseFieldErrors(error: mongoose.Error.ValidationError) {
  const fieldErrors: RegistrationFieldErrors = {};

  for (const [fieldName, fieldError] of Object.entries(error.errors)) {
    if (fieldName in Registration.schema.obj) {
      fieldErrors[fieldName as keyof RegistrationFieldErrors] =
        fieldError.message;
    }
  }

  return fieldErrors;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body. Expected JSON.' },
      { status: 400 }
    );
  }

  const validation = validateRegistrationPayload(body);

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
      notes: data.notes || undefined,
    });

    await registration.save();

    return NextResponse.json(
      {
        message:
          'Registration submitted successfully. We will contact you shortly.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration failed:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      const fieldErrors = getMongooseFieldErrors(error);

      return NextResponse.json(
        {
          error: getRegistrationErrorMessage(fieldErrors),
          fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: getMongoErrorMessage(
          error,
          'Could not save the registration right now.'
        ),
      },
      { status: 500 }
    );
  }
}
