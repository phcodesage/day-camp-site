export type AdminMediaKind = 'image' | 'video';

export type AdminMediaItem = {
  name: string;
  url: string;
  kind: AdminMediaKind;
  size: number;
  modifiedAt: string;
  usage: string[];
};

export const IMAGE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
] as const;

export const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v'] as const;
