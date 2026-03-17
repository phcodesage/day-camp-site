import mongoose, { Schema, Document, Model } from 'mongoose';
import type { ActivityOption } from '@/lib/registration';

export interface IRegistration extends Document {
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  activities: ActivityOption[];
  preferredDays: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    parentName: {
      type: String,
      required: [true, 'Parent name is required'],
      maxlength: [120, 'Parent name must not exceed 120 characters'],
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      maxlength: [120, 'Student name must not exceed 120 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+().\-\s]{7,20}$/, 'Please provide a valid phone number'],
    },
    activities: {
      type: [String],
      required: [true, 'At least one activity is required'],
      enum: ['CHESS', 'ABACUS', 'ART', 'BRAIN GAMES', 'HOMEWORK HELP'],
    },
    preferredDays: {
      type: String,
      default: 'Monday to Friday',
      maxlength: [80, 'Preferred days must not exceed 80 characters'],
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes must not exceed 1000 characters'],
      trim: true,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

let Registration: Model<IRegistration>;

try {
  Registration = mongoose.model<IRegistration>('Registration');
} catch {
  Registration = mongoose.model<IRegistration>(
    'Registration',
    registrationSchema
  );
}

export default Registration;
