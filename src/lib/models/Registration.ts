import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegistration extends Document {
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  grade?: string;
  subjects?: string[];
  activities: string[];
  preferredDays: string;
  tuitionPlan?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  pianoLesson?: boolean;
  pianoFrequency?: string;
  chessAddon?: boolean;
  chessFrequency?: string;
  totalAmount?: number;
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
    grade: {
      type: String,
      trim: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    activities: {
      type: [String],
      default: [],
    },
    preferredDays: {
      type: String,
      required: [true, 'Select at least one preferred day'],
      maxlength: [120, 'Preferred days must not exceed 120 characters'],
      trim: true,
    },
    tuitionPlan: {
      type: String,
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, 'Desired start date is required'],
      maxlength: [20, 'Start date must not exceed 20 characters'],
      trim: true,
    },
    endDate: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes must not exceed 1000 characters'],
      trim: true,
      default: undefined,
    },
    pianoLesson: {
      type: Boolean,
      default: false,
    },
    pianoFrequency: {
      type: String,
      trim: true,
    },
    chessAddon: {
      type: Boolean,
      default: false,
    },
    chessFrequency: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>('Registration', registrationSchema);

export default Registration;

