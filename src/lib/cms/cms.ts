import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import CmsSectionContentModel from '@/lib/models/CmsSectionContent';
import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type {
  CmsContentBySectionKey,
  CmsSectionContent,
  CmsSectionKey,
} from '@/lib/cms/types';

export async function getCmsSectionContent<K extends CmsSectionKey>(
  sectionKey: K
): Promise<CmsSectionContent<K>> {
  if (!isMongoConfigured()) {
    return DEFAULT_CMS_CONTENT[sectionKey] as CmsSectionContent<K>;
  }

  try {
    await connectToDatabase();

    const doc = await CmsSectionContentModel.findOne({ sectionKey }).lean();
    if (!doc) {
      return DEFAULT_CMS_CONTENT[sectionKey] as CmsSectionContent<K>;
    }

    const savedData = (doc.data || {}) as Partial<CmsSectionContent<K>>;
    return {
      ...DEFAULT_CMS_CONTENT[sectionKey],
      ...savedData,
    } as CmsSectionContent<K>;
  } catch (error) {
    console.error(`CMS read failed for section "${sectionKey}":`, error);
    return DEFAULT_CMS_CONTENT[sectionKey] as CmsSectionContent<K>;
  }
}

export async function getAllCmsContent(): Promise<CmsContentBySectionKey> {
  await connectToDatabase();

  // Use a broad intermediate type to avoid intersection-type issues when
  // indexing by dynamic section keys.
  const result: Record<string, unknown> = { ...DEFAULT_CMS_CONTENT };
  const docs = await CmsSectionContentModel.find().lean();

  for (const doc of docs) {
    const key = doc.sectionKey as CmsSectionKey;
    const savedData = (doc.data || {}) as Record<string, unknown>;
    result[key] = {
      ...(result[key] as Record<string, unknown>),
      ...savedData,
    };
  }

  return result as CmsContentBySectionKey;
}

export async function upsertCmsSectionContent(
  sectionKey: CmsSectionKey,
  data: Record<string, unknown>
) {
  await connectToDatabase();

  await CmsSectionContentModel.updateOne(
    { sectionKey },
    { $set: { data } },
    { upsert: true }
  );
}
