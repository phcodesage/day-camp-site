import mongoose, { Document, Model, Schema } from 'mongoose';
import type { CmsSectionKey } from '@/lib/cms/types';

export interface ICmsSectionContent extends Document {
  sectionKey: CmsSectionKey;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const cmsSectionContentSchema = new Schema<ICmsSectionContent>(
  {
    sectionKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const CmsSectionContent: Model<ICmsSectionContent> =
  mongoose.models.CmsSectionContent ||
  mongoose.model<ICmsSectionContent>('CmsSectionContent', cmsSectionContentSchema);

export default CmsSectionContent;

