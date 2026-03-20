import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPageView extends Document {
  sessionId: string;
  device: string;
  path: string;
  hash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const pageViewSchema = new Schema<IPageView>(
  {
    sessionId: { type: String, required: true, index: true },
    device: { type: String, required: true },
    path: { type: String, required: true },
    hash: { type: String, default: null },
  },
  { timestamps: true }
);

const PageView: Model<IPageView> =
  mongoose.models.PageView || mongoose.model<IPageView>('PageView', pageViewSchema);

export default PageView;

