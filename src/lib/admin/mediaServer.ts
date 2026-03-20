import { promises as fs } from 'fs';
import path from 'path';
import { getAllCmsContent } from '@/lib/cms/cms';
import { DEFAULT_CMS_CONTENT } from '@/lib/cms/defaultContent';
import type { CmsContentBySectionKey } from '@/lib/cms/types';
import {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  type AdminMediaItem,
  type AdminMediaKind,
} from './mediaTypes';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const CMS_UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'cms-media');
const SUPPORTED_MEDIA_EXTENSIONS = new Set<string>([
  ...IMAGE_EXTENSIONS,
  ...VIDEO_EXTENSIONS,
]);

function getMediaKind(fileName: string): AdminMediaKind | null {
  const extension = path.extname(fileName).toLowerCase();

  if (IMAGE_EXTENSIONS.includes(extension as (typeof IMAGE_EXTENSIONS)[number])) {
    return 'image';
  }

  if (VIDEO_EXTENSIONS.includes(extension as (typeof VIDEO_EXTENSIONS)[number])) {
    return 'video';
  }

  return null;
}

function toPublicUrl(filePath: string) {
  const relativePath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  return `/${relativePath}`;
}

function sanitizeBaseName(fileName: string) {
  const baseName = path.basename(fileName, path.extname(fileName));
  return (
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'media'
  );
}

function getExtensionFromMimeType(mimeType: string) {
  switch (mimeType) {
    case 'image/png':
      return '.png';
    case 'image/jpeg':
      return '.jpg';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    case 'image/svg+xml':
      return '.svg';
    case 'image/avif':
      return '.avif';
    case 'video/mp4':
      return '.mp4';
    case 'video/webm':
      return '.webm';
    case 'video/quicktime':
      return '.mov';
    case 'video/x-m4v':
      return '.m4v';
    default:
      return '';
  }
}

function collectCmsMediaUsage(content: CmsContentBySectionKey) {
  const usage = new Map<string, string[]>();

  const addUsage = (url: string, label: string) => {
    const normalizedUrl = url.trim();
    if (!normalizedUrl) return;

    const existing = usage.get(normalizedUrl) || [];
    usage.set(normalizedUrl, [...existing, label]);
  };

  addUsage(content.siteChrome.logoSrc, 'Site Chrome logo');
  addUsage(content.siteChrome.heroImageSrc, 'Site Chrome hero image');
  addUsage(content.siteChrome.accentImageSrc, 'Site Chrome accent image');
  addUsage(content.moreInformation.imageSrc, 'More Information image');
  addUsage(content.moreInformation.videoUrl, 'More Information video');
  addUsage(content.campHighlights.imageSrc, 'Camp Highlights image');
  addUsage(content.campHighlights.videoUrl, 'Camp Highlights video');
  addUsage(content.programSchedule.imageSrc, 'Program Schedule image');
  addUsage(content.programSchedule.videoUrl, 'Program Schedule video');

  return usage;
}

async function getCmsMediaUsageMap() {
  try {
    const content = await getAllCmsContent();
    return collectCmsMediaUsage(content);
  } catch {
    return collectCmsMediaUsage(DEFAULT_CMS_CONTENT);
  }
}

async function buildMediaItem(
  filePath: string,
  usageMap: Map<string, string[]>
): Promise<AdminMediaItem | null> {
  const kind = getMediaKind(filePath);
  if (!kind) return null;

  const stat = await fs.stat(filePath);
  if (!stat.isFile()) return null;

  const url = toPublicUrl(filePath);

  return {
    name: path.basename(filePath),
    url,
    kind,
    size: stat.size,
    modifiedAt: stat.mtime.toISOString(),
    usage: usageMap.get(url) || [],
  };
}

async function walkMediaDirectory(
  directoryPath: string,
  usageMap: Map<string, string[]>
): Promise<AdminMediaItem[]> {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const items: AdminMediaItem[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      items.push(...(await walkMediaDirectory(fullPath, usageMap)));
      continue;
    }

    const item = await buildMediaItem(fullPath, usageMap);
    if (item) {
      items.push(item);
    }
  }

  return items;
}

export async function listAdminMedia(kind?: AdminMediaKind) {
  const usageMap = await getCmsMediaUsageMap();
  const items = await walkMediaDirectory(PUBLIC_DIR, usageMap);
  const filteredItems = kind ? items.filter((item) => item.kind === kind) : items;

  return filteredItems.sort((left, right) => {
    const usageDifference = right.usage.length - left.usage.length;
    if (usageDifference !== 0) return usageDifference;

    const modifiedDifference =
      new Date(right.modifiedAt).getTime() - new Date(left.modifiedAt).getTime();
    if (modifiedDifference !== 0) return modifiedDifference;

    return left.url.localeCompare(right.url);
  });
}

export async function saveUploadedMedia(file: File) {
  if (!file.size) {
    throw new Error('Uploaded file is empty.');
  }

  const originalExtension = path.extname(file.name).toLowerCase();
  const extension = SUPPORTED_MEDIA_EXTENSIONS.has(originalExtension)
    ? originalExtension
    : getExtensionFromMimeType(file.type);

  if (!SUPPORTED_MEDIA_EXTENSIONS.has(extension as string)) {
    throw new Error('Unsupported media type. Upload an image or video file.');
  }

  await fs.mkdir(CMS_UPLOAD_DIR, { recursive: true });

  const safeBaseName = sanitizeBaseName(file.name);
  const fileName = `${Date.now()}-${safeBaseName}${extension}`;
  const filePath = path.join(CMS_UPLOAD_DIR, fileName);

  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const usageMap = await getCmsMediaUsageMap();
  const item = await buildMediaItem(filePath, usageMap);
  if (!item) {
    throw new Error('Uploaded file could not be processed.');
  }

  return item;
}

export async function deleteMediaByUrl(url: string) {
  const normalizedUrl = url.trim().split('?')[0];

  if (!normalizedUrl.startsWith('/')) {
    throw new Error('Invalid media path.');
  }

  const filePath = path.resolve(PUBLIC_DIR, `.${normalizedUrl}`);
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error('Invalid media path.');
  }

  if (!getMediaKind(filePath)) {
    throw new Error('Unsupported media file.');
  }

  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat || !stat.isFile()) {
    throw new Error('Media file not found.');
  }

  await fs.unlink(filePath);
}
