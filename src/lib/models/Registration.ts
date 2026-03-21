import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegistration extends Document {
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  activities: string[];
  preferredDays: string;
  startDate: string;
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
    },
    preferredDays: {
      type: String,
      required: [true, 'Select at least one preferred day'],
      maxlength: [80, 'Preferred days must not exceed 80 characters'],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, 'Desired start date is required'],
      maxlength: [20, 'Start date must not exceed 20 characters'],
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

const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>('Registration', registrationSchema);

export default Registration;
