import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import CmsSectionContentModel from '@/lib/models/CmsSectionContent';
import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type {
  CmsContentBySectionKey,
  CmsSectionContent,
  CmsSectionKey,
} from '@/lib/cms/types';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeCmsValues<T>(defaults: T, savedData: unknown): T {
  if (!isPlainObject(defaults) || !isPlainObject(savedData)) {
    return (savedData ?? defaults) as T;
  }

  const result: Record<string, unknown> = {
    ...(defaults as Record<string, unknown>),
  };

  for (const [key, value] of Object.entries(savedData)) {
    const defaultValue = result[key];

    if (Array.isArray(value)) {
      result[key] = value;
      continue;
    }

    if (isPlainObject(defaultValue) && isPlainObject(value)) {
      result[key] = mergeCmsValues(defaultValue, value);
      continue;
    }

    result[key] = value;
  }

  return result as T;
}

export function mergeCmsSectionContent<K extends CmsSectionKey>(
  sectionKey: K,
  savedData: Partial<CmsSectionContent<K>> | Record<string, unknown>
): CmsSectionContent<K> {
  return mergeCmsValues(
    DEFAULT_CMS_CONTENT[sectionKey],
    savedData
  ) as CmsSectionContent<K>;
}

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
    return mergeCmsSectionContent(sectionKey, savedData);
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
    result[key] = mergeCmsSectionContent(key, savedData);
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
