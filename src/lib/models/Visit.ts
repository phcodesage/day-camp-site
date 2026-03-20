import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVisit extends Document {
  sessionId: string;
  device: string;
  createdAt: Date;
  updatedAt: Date;
}

const visitSchema = new Schema<IVisit>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    device: { type: String, required: true },
  },
  { timestamps: true }
);

const Visit: Model<IVisit> =
  mongoose.models.Visit || mongoose.model<IVisit>('Visit', visitSchema);

export default Visit;

