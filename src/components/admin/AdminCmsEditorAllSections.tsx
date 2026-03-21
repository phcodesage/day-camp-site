'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { AdminMediaItem } from '@/lib/admin/mediaTypes';
import type {
  AfterschoolProgramsContent,
  AboutSectionContent,
  CampHighlightsContent,
  CmsContentBySectionKey,
  CmsSectionKey,
  MoreInformationContent,
  ProgramScheduleContent,
  SiteChromeContent,
} from '@/lib/cms/types';

function sectionLabel(key: CmsSectionKey) {
  switch (key) {
    case 'about':
      return 'About Section';
    case 'siteChrome':
      return 'Site Chrome';
    case 'moreInformation':
      return 'More Information';
    case 'campHighlights':
      return 'Camp Highlights';
    case 'programSchedule':
      return 'Program Schedule';
    case 'afterschoolPrograms':
      return 'Afterschool Programs';
  }
}

function toCommaSeparated(values: string[]) {
  return values.join(', ');
}

function parseCommaSeparated(values: string) {
  return values
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getInputClassName(multiline = false) {
  return `${multiline ? 'min-h-24 resize-y' : ''} rounded-xl border border-[#1a2945]/20 bg-white px-3 py-2 text-sm outline-none focus:border-[#1a7b8e] focus:ring-2 focus:ring-[#1a7b8e]/15`;
}

function CmsField({
  label,
  value,
  onChange,
  multiline = false,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={getInputClassName(true)}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={getInputClassName()}
        />
      )}
    </label>
  );
}

function CmsSectionCard({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white/60 p-4 shadow md:p-6">
      <div>
        <h2 className="text-base font-extrabold text-[#1a2945] md:text-lg">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-[#1a2945]/65 md:text-sm">{description}</p>
        ) : null}
      </div>
      <div className="mt-4 space-y-4 md:mt-5 md:space-y-5">{children}</div>
    </section>
  );
}

function CmsMediaPicker({
  title,
  imageSrc,
  videoUrl,
  imageAlt,
  mediaItems,
  previewClassName,
  onImageSrcChange,
  onVideoUrlChange,
  onImageAltChange,
}: Readonly<{
  title: string;
  imageSrc: string;
  videoUrl: string;
  imageAlt: string;
  mediaItems: AdminMediaItem[];
  previewClassName: string;
  onImageSrcChange: (value: string) => void;
  onVideoUrlChange: (value: string) => void;
  onImageAltChange: (value: string) => void;
}>) {
  const imageItems = mediaItems.filter((item) => item.kind === 'image');
  const videoItems = mediaItems.filter((item) => item.kind === 'video');
  const mediaMode = videoUrl.trim() ? 'video' : 'image';

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-3 md:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">{title}</p>
          <p className="mt-1 text-xs text-[#1a2945]/55">
            Pick files from the media library. Video replaces the image on the
            live site.
          </p>
        </div>

        <Link
          href="/admin/cms/media"
          className="inline-flex items-center justify-center rounded-xl border border-[#1a2945]/15 bg-[#f5e6e0] px-3 py-2 text-xs font-semibold text-[#1a2945] transition-colors hover:bg-[#ead5cd] md:text-sm"
        >
          Manage Media
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onVideoUrlChange('')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mediaMode === 'image'
              ? 'bg-[#1a2945] text-white'
              : 'bg-[#f5e6e0] text-[#1a2945] hover:bg-[#ead5cd]'
          }`}
        >
          Use Image
        </button>
        <button
          type="button"
          onClick={() =>
            onVideoUrlChange(videoUrl || videoItems[0]?.url || '')
          }
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mediaMode === 'video'
              ? 'bg-[#1a2945] text-white'
              : 'bg-[#f5e6e0] text-[#1a2945] hover:bg-[#ead5cd]'
          }`}
        >
          Use Video
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">
              Image File
            </span>
            <select
              value={imageSrc}
              onChange={(event) => onImageSrcChange(event.target.value)}
              className={getInputClassName()}
            >
              <option value="">Select an image</option>
              {imageItems.map((item) => (
                <option key={item.url} value={item.url}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">
              Video File
            </span>
            <select
              value={videoUrl}
              onChange={(event) => onVideoUrlChange(event.target.value)}
              className={getInputClassName()}
            >
              <option value="">No video selected</option>
              {videoItems.map((item) => (
                <option key={item.url} value={item.url}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <CmsField
            label="Image Alt Text"
            value={imageAlt}
            onChange={onImageAltChange}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#f8f4f2] min-h-[200px]">
          {mediaMode === 'video' && videoUrl ? (
            <video
              src={videoUrl}
              controls
              className={`h-full w-full object-cover ${previewClassName}`}
            />
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt || title}
              className={`h-full w-full object-cover ${previewClassName}`}
            />
          ) : (
            <div
              className={`flex items-center justify-center px-4 text-center text-xs text-[#1a2945]/55 md:px-6 md:text-sm ${previewClassName}`}
            >
              No media selected yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CmsImageSelect({
  title,
  imageSrc,
  imageAlt,
  mediaItems,
  previewClassName,
  onImageSrcChange,
  onImageAltChange,
}: Readonly<{
  title: string;
  imageSrc: string;
  imageAlt: string;
  mediaItems: AdminMediaItem[];
  previewClassName: string;
  onImageSrcChange: (value: string) => void;
  onImageAltChange: (value: string) => void;
}>) {
  const imageItems = mediaItems.filter((item) => item.kind === 'image');

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-3 md:p-4">
      <p className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">{title}</p>
      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#1a2945]/70 md:text-sm">
              Image File
            </span>
            <select
              value={imageSrc}
              onChange={(event) => onImageSrcChange(event.target.value)}
              className={getInputClassName()}
            >
              <option value="">Select an image</option>
              {imageItems.map((item) => (
                <option key={item.url} value={item.url}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <CmsField
            label="Alt Text"
            value={imageAlt}
            onChange={onImageAltChange}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#f8f4f2] min-h-[200px]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt || title}
              className={`h-full w-full object-cover ${previewClassName}`}
            />
          ) : (
            <div
              className={`flex items-center justify-center px-4 text-center text-xs text-[#1a2945]/55 md:px-6 md:text-sm ${previewClassName}`}
            >
              No image selected yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCmsEditorAllSections() {
  const [sections, setSections] = useState<CmsContentBySectionKey | null>(null);
  const [drafts, setDrafts] = useState<CmsContentBySectionKey | null>(null);
  const [mediaItems, setMediaItems] = useState<AdminMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshingMedia, setIsRefreshingMedia] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const hasUnsavedChanges = Boolean(
    sections &&
      drafts &&
      JSON.stringify(sections) !== JSON.stringify(drafts)
  );

  async function loadCmsSections() {
    const res = await fetch('/api/admin/cms/sections', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
    });

    const payload = (await res.json().catch(() => null)) as
      | { error?: string }
      | CmsContentBySectionKey
      | null;

    if (!res.ok) {
      throw new Error(
        payload && 'error' in payload ? payload.error || 'Error' : 'Error'
      );
    }

    return payload as CmsContentBySectionKey;
  }

  async function loadMediaLibrary() {
    const res = await fetch('/api/admin/media', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
    });

    const payload = (await res.json().catch(() => null)) as
      | { error?: string; items?: AdminMediaItem[] }
      | null;

    if (!res.ok) {
      throw new Error(payload?.error || 'Could not load media.');
    }

    return payload?.items || [];
  }

  useEffect(() => {
    let cancelled = false;

    async function loadEditorData() {
      setIsLoading(true);
      setError(null);

      try {
        const [nextSections, nextMedia] = await Promise.all([
          loadCmsSections(),
          loadMediaLibrary(),
        ]);

        if (cancelled) return;

        setSections(nextSections);
        setDrafts(nextSections);
        setMediaItems(nextMedia);
      } catch (loadError) {
        if (cancelled) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load CMS content.'
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadEditorData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 400);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function updateDraft<K extends CmsSectionKey>(
    key: K,
    patch: Partial<CmsContentBySectionKey[K]>
  ) {
    setDrafts((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: {
          ...current[key],
          ...patch,
        },
      };
    });
  }

  async function handleSaveAll() {
    if (!drafts) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/cms/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(drafts),
      });

      const payload = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!res.ok) {
        setError(payload?.error || 'Save failed.');
        return;
      }

      setSections(drafts);
      setSuccess('All CMS changes saved.');
    } catch {
      setError('Save failed.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRefreshMedia() {
    setIsRefreshingMedia(true);
    setError(null);

    try {
      const nextMedia = await loadMediaLibrary();
      setMediaItems(nextMedia);
      setSuccess('Media library refreshed.');
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : 'Could not refresh media.'
      );
    } finally {
      setIsRefreshingMedia(false);
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (isLoading || !drafts) {
    return (
      <div className="px-4 pt-[100px] md:px-6 md:pt-36">
        <div className="fixed left-0 right-0 top-[57px] z-30 border-b border-black/5 bg-[#f5e6e0]/95 backdrop-blur md:left-72 md:top-0">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6">
            <h1 className="text-xl font-extrabold text-[#1a2945] md:text-2xl">
              CMS Editor
            </h1>
            <p className="mt-1 text-sm text-[#1a2945]/70">
              Loading the editor and media library...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const about = drafts.about as AboutSectionContent;
  const siteChrome = drafts.siteChrome as SiteChromeContent;
  const moreInformation = drafts.moreInformation as MoreInformationContent;
  const campHighlights = drafts.campHighlights as CampHighlightsContent;
  const programSchedule = drafts.programSchedule as ProgramScheduleContent;
  const afterschoolPrograms =
    drafts.afterschoolPrograms as AfterschoolProgramsContent;

  return (
    <div className="px-4 pt-[120px] md:px-6 md:pt-40">
      <div className="fixed left-0 right-0 top-[57px] z-30 border-b border-black/5 bg-[#f5e6e0]/95 backdrop-blur md:left-72 md:top-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 md:px-6 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#1a2945] md:text-2xl">
                CMS Editor
              </h1>
              <p className="mt-1 text-xs text-[#1a2945]/70 md:text-sm">
                Edit all sections here, then save once. {mediaItems.length}{' '}
                media file{mediaItems.length === 1 ? '' : 's'} available.
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#1a2945]/55 md:mt-2">
                {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-[#1a2945]/15 bg-white px-3 py-2 text-xs font-semibold text-[#1a2945] transition-colors hover:bg-white/80 md:px-4 md:text-sm"
              >
                View Live Website
              </Link>
              <Link
                href="/admin/cms/media"
                className="inline-flex items-center justify-center rounded-xl border border-[#1a2945]/15 bg-white px-3 py-2 text-xs font-semibold text-[#1a2945] transition-colors hover:bg-white/80 md:px-4 md:text-sm"
              >
                Open Media Library
              </Link>
              <button
                type="button"
                onClick={() => void handleRefreshMedia()}
                disabled={isRefreshingMedia}
                className="inline-flex items-center justify-center rounded-xl border border-[#1a2945]/15 bg-[#f5e6e0] px-3 py-2 text-xs font-semibold text-[#1a2945] transition-colors hover:bg-[#ead5cd] disabled:cursor-not-allowed disabled:opacity-60 md:px-4 md:text-sm"
              >
                {isRefreshingMedia ? 'Refreshing...' : 'Refresh Media'}
              </button>
              <button
                type="button"
                onClick={() => void handleSaveAll()}
                disabled={isSaving || !hasUnsavedChanges}
                className="inline-flex items-center justify-center rounded-xl bg-[#c74444] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#a63535] disabled:cursor-not-allowed disabled:bg-[#c74444]/60 md:px-5 md:text-sm"
              >
                {isSaving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mx-auto mt-4 w-full max-w-6xl rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 p-3 text-xs text-[#7a1f1f] md:p-4 md:text-sm">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mx-auto mt-4 w-full max-w-6xl rounded-xl border border-[#1a7b8e]/20 bg-[#1a7b8e]/10 p-3 text-xs text-[#0e243a] md:p-4 md:text-sm">
          {success}
        </div>
      ) : null}

      <div className="mx-auto mt-4 w-full max-w-6xl space-y-6 md:mt-6 md:space-y-8">
        <CmsSectionCard
          title={sectionLabel('siteChrome')}
          description="Navigation labels, logo, and the hero media at the top of the site."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CmsField
              label="Brand Title"
              value={siteChrome.brandTitle}
              onChange={(value) =>
                updateDraft('siteChrome', { brandTitle: value })
              }
            />
            <CmsField
              label="Browser Title"
              value={siteChrome.metadataTitle}
              onChange={(value) =>
                updateDraft('siteChrome', { metadataTitle: value })
              }
            />
            <CmsField
              label="Browser Description"
              value={siteChrome.metadataDescription}
              onChange={(value) =>
                updateDraft('siteChrome', { metadataDescription: value })
              }
              multiline
            />
            <CmsField
              label="Mobile Open Menu Label"
              value={siteChrome.mobileMenuOpenLabel}
              onChange={(value) =>
                updateDraft('siteChrome', { mobileMenuOpenLabel: value })
              }
            />
            <CmsField
              label="Mobile Close Menu Label"
              value={siteChrome.mobileMenuCloseLabel}
              onChange={(value) =>
                updateDraft('siteChrome', { mobileMenuCloseLabel: value })
              }
            />
            <CmsField
              label="Scroll To Top Label"
              value={siteChrome.scrollToTopLabel}
              onChange={(value) =>
                updateDraft('siteChrome', { scrollToTopLabel: value })
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1a2945]/70">
                Navigation Items
              </p>
              <button
                type="button"
                onClick={() =>
                  updateDraft('siteChrome', {
                    navItems: [
                      ...siteChrome.navItems,
                      { href: '#new-section', label: 'New Link' },
                    ],
                  })
                }
                className="rounded-xl border border-[#1a2945]/15 bg-white px-3 py-2 text-sm font-semibold text-[#1a2945] transition-colors hover:bg-white/80"
              >
                Add Link
              </button>
            </div>

            {siteChrome.navItems.map((item, index) => (
              <div
                key={`${item.href}-${index}`}
                className="rounded-2xl border border-black/5 bg-white p-4"
              >
                <p className="text-sm font-semibold text-[#1a2945]/70">
                  Navigation Item {index + 1}
                </p>
                <div className="mt-3 flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <CmsField
                    label="Label"
                    value={item.label}
                    onChange={(value) => {
                      const nextItems = [...siteChrome.navItems];
                      nextItems[index] = {
                        ...nextItems[index],
                        label: value,
                      };
                      updateDraft('siteChrome', { navItems: nextItems });
                    }}
                  />
                  <CmsField
                    label="Href"
                    value={item.href}
                    onChange={(value) => {
                      const nextItems = [...siteChrome.navItems];
                      nextItems[index] = {
                        ...nextItems[index],
                        href: value,
                      };
                      updateDraft('siteChrome', { navItems: nextItems });
                    }}
                  />
                  <div className="flex items-end md:items-end">
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft('siteChrome', {
                          navItems: siteChrome.navItems.filter(
                            (_, itemIndex) => itemIndex !== index
                          ),
                        })
                      }
                      disabled={siteChrome.navItems.length === 1}
                      className="w-full rounded-xl border border-[#c74444]/30 bg-[#c74444]/10 px-4 py-2 text-xs font-semibold text-[#7a1f1f] transition-colors hover:bg-[#c74444]/20 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
            <CmsImageSelect
              title="Logo"
              imageSrc={siteChrome.logoSrc}
              imageAlt={siteChrome.logoAlt}
              mediaItems={mediaItems}
              previewClassName="aspect-[4/3]"
              onImageSrcChange={(value) =>
                updateDraft('siteChrome', { logoSrc: value })
              }
              onImageAltChange={(value) =>
                updateDraft('siteChrome', { logoAlt: value })
              }
            />
            <CmsImageSelect
              title="Hero Image"
              imageSrc={siteChrome.heroImageSrc}
              imageAlt={siteChrome.heroImageAlt}
              mediaItems={mediaItems}
              previewClassName="aspect-square"
              onImageSrcChange={(value) =>
                updateDraft('siteChrome', { heroImageSrc: value })
              }
              onImageAltChange={(value) =>
                updateDraft('siteChrome', { heroImageAlt: value })
              }
            />
            <CmsImageSelect
              title="Accent Image"
              imageSrc={siteChrome.accentImageSrc}
              imageAlt={siteChrome.accentImageAlt}
              mediaItems={mediaItems}
              previewClassName="aspect-square"
              onImageSrcChange={(value) =>
                updateDraft('siteChrome', { accentImageSrc: value })
              }
              onImageAltChange={(value) =>
                updateDraft('siteChrome', { accentImageAlt: value })
              }
            />
          </div>
        </CmsSectionCard>

        <CmsSectionCard
          title={sectionLabel('about')}
          description="Top hero copy and call-to-action."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CmsField
              label="Heading"
              value={about.heading}
              onChange={(value) => updateDraft('about', { heading: value })}
            />
            <CmsField
              label="Italic Line"
              value={about.italicLine}
              onChange={(value) => updateDraft('about', { italicLine: value })}
            />
            <CmsField
              label="Paragraph 1"
              value={about.paragraph1}
              onChange={(value) => updateDraft('about', { paragraph1: value })}
              multiline
            />
            <CmsField
              label="Paragraph 2"
              value={about.paragraph2}
              onChange={(value) => updateDraft('about', { paragraph2: value })}
              multiline
            />
            <CmsField
              label="Button Label"
              value={about.buttonLabel}
              onChange={(value) => updateDraft('about', { buttonLabel: value })}
            />
            <CmsField
              label="Button Link"
              value={about.buttonHref}
              onChange={(value) => updateDraft('about', { buttonHref: value })}
            />
          </div>
        </CmsSectionCard>

        <CmsSectionCard
          title={sectionLabel('moreInformation')}
          description="Contact details and the main media block."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CmsField
              label="Heading Line 1"
              value={moreInformation.headingLine1}
              onChange={(value) =>
                updateDraft('moreInformation', { headingLine1: value })
              }
            />
            <CmsField
              label="Heading Line 2"
              value={moreInformation.headingLine2}
              onChange={(value) =>
                updateDraft('moreInformation', { headingLine2: value })
              }
            />
            <CmsField
              label="Email"
              value={moreInformation.email}
              onChange={(value) =>
                updateDraft('moreInformation', { email: value })
              }
            />
            <CmsField
              label="Phone"
              value={moreInformation.phone}
              onChange={(value) =>
                updateDraft('moreInformation', { phone: value })
              }
            />
            <CmsField
              label="Address"
              value={moreInformation.address}
              onChange={(value) =>
                updateDraft('moreInformation', { address: value })
              }
            />
            <CmsField
              label="Website Label"
              value={moreInformation.websiteLabel}
              onChange={(value) =>
                updateDraft('moreInformation', { websiteLabel: value })
              }
            />
            <CmsField
              label="Website Link"
              value={moreInformation.websiteHref}
              onChange={(value) =>
                updateDraft('moreInformation', { websiteHref: value })
              }
            />
          </div>

          <CmsMediaPicker
            title="More Information Media"
            imageSrc={moreInformation.imageSrc}
            videoUrl={moreInformation.videoUrl}
            imageAlt={moreInformation.imageAlt}
            mediaItems={mediaItems}
            previewClassName="aspect-[4/3]"
            onImageSrcChange={(value) =>
              updateDraft('moreInformation', { imageSrc: value })
            }
            onVideoUrlChange={(value) =>
              updateDraft('moreInformation', { videoUrl: value })
            }
            onImageAltChange={(value) =>
              updateDraft('moreInformation', { imageAlt: value })
            }
          />
        </CmsSectionCard>

        <CmsSectionCard
          title={sectionLabel('campHighlights')}
          description="Highlights copy, activity list, and section media."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CmsField
              label="Intro Heading"
              value={campHighlights.introHeading}
              onChange={(value) =>
                updateDraft('campHighlights', { introHeading: value })
              }
            />
            <CmsField
              label="Activities (comma separated)"
              value={toCommaSeparated(campHighlights.activities)}
              onChange={(value) =>
                updateDraft('campHighlights', {
                  activities: parseCommaSeparated(value),
                })
              }
            />
          </div>

          <CmsMediaPicker
            title="Camp Highlights Media"
            imageSrc={campHighlights.imageSrc}
            videoUrl={campHighlights.videoUrl}
            imageAlt={campHighlights.imageAlt}
            mediaItems={mediaItems}
            previewClassName="aspect-[16/9]"
            onImageSrcChange={(value) =>
              updateDraft('campHighlights', { imageSrc: value })
            }
            onVideoUrlChange={(value) =>
              updateDraft('campHighlights', { videoUrl: value })
            }
            onImageAltChange={(value) =>
              updateDraft('campHighlights', { imageAlt: value })
            }
          />

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#1a2945]/70">
              Highlights
            </p>
            {campHighlights.highlights.map((item, index) => (
              <div
                key={`${item.boldText}-${index}`}
                className="rounded-2xl border border-black/5 bg-white p-4"
              >
                <p className="text-sm font-semibold text-[#1a2945]/70">
                  Highlight {index + 1}
                </p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <CmsField
                    label="Bold Text"
                    value={item.boldText}
                    onChange={(value) => {
                      const nextHighlights = [...campHighlights.highlights];
                      nextHighlights[index] = {
                        ...nextHighlights[index],
                        boldText: value,
                      };
                      updateDraft('campHighlights', {
                        highlights: nextHighlights,
                      });
                    }}
                  />
                  <CmsField
                    label="Text"
                    value={item.text}
                    onChange={(value) => {
                      const nextHighlights = [...campHighlights.highlights];
                      nextHighlights[index] = {
                        ...nextHighlights[index],
                        text: value,
                      };
                      updateDraft('campHighlights', {
                        highlights: nextHighlights,
                      });
                    }}
                    multiline
                  />
                </div>
              </div>
            ))}
          </div>
        </CmsSectionCard>

        <CmsSectionCard
          title={sectionLabel('programSchedule')}
          description="Schedule badges, copy, and supporting media."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CmsField
              label="Badge Labels (comma separated)"
              value={toCommaSeparated(programSchedule.badgeLabels)}
              onChange={(value) =>
                updateDraft('programSchedule', {
                  badgeLabels: parseCommaSeparated(value),
                })
              }
            />
            <CmsField
              label="Enroll Prefix"
              value={programSchedule.enrollPrefix}
              onChange={(value) =>
                updateDraft('programSchedule', { enrollPrefix: value })
              }
            />
            <CmsField
              label="Enroll Bold"
              value={programSchedule.enrollBold}
              onChange={(value) =>
                updateDraft('programSchedule', { enrollBold: value })
              }
            />
            <CmsField
              label="Schedule Title"
              value={programSchedule.scheduleTitle}
              onChange={(value) =>
                updateDraft('programSchedule', { scheduleTitle: value })
              }
            />
            <CmsField
              label="Schedule Subtitle"
              value={programSchedule.scheduleSubtitle}
              onChange={(value) =>
                updateDraft('programSchedule', { scheduleSubtitle: value })
              }
            />
            <CmsField
              label="Schedule Body"
              value={programSchedule.scheduleBody}
              onChange={(value) =>
                updateDraft('programSchedule', { scheduleBody: value })
              }
              multiline
            />
          </div>

          <CmsMediaPicker
            title="Program Schedule Media"
            imageSrc={programSchedule.imageSrc}
            videoUrl={programSchedule.videoUrl}
            imageAlt={programSchedule.imageAlt}
            mediaItems={mediaItems}
            previewClassName="aspect-square"
            onImageSrcChange={(value) =>
              updateDraft('programSchedule', { imageSrc: value })
            }
            onVideoUrlChange={(value) =>
              updateDraft('programSchedule', { videoUrl: value })
            }
            onImageAltChange={(value) =>
              updateDraft('programSchedule', { imageAlt: value })
            }
          />
        </CmsSectionCard>

        <CmsSectionCard
          title={sectionLabel('afterschoolPrograms')}
          description="Hero, registration copy, pricing, and discount banner."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CmsField
              label="Hero Title"
              value={afterschoolPrograms.heroTitle}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', { heroTitle: value })
              }
            />
            <CmsField
              label="Hero Subtitle"
              value={afterschoolPrograms.heroSubtitle}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', { heroSubtitle: value })
              }
            />
            <CmsField
              label="Activity Options (comma separated)"
              value={toCommaSeparated(afterschoolPrograms.activityOptions)}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  activityOptions: parseCommaSeparated(value),
                })
              }
            />
            <CmsField
              label="Activity Schedule Label"
              value={afterschoolPrograms.activityScheduleLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  activityScheduleLabel: value,
                })
              }
            />
            <CmsField
              label="Activity Time Label"
              value={afterschoolPrograms.activityTimeLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  activityTimeLabel: value,
                })
              }
            />
            <CmsField
              label="Registration Title"
              value={afterschoolPrograms.registrationTitle}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  registrationTitle: value,
                })
              }
            />
            <CmsField
              label="Registration Description"
              value={afterschoolPrograms.registrationDescription}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  registrationDescription: value,
                })
              }
              multiline
            />
            <CmsField
              label="Parent Name Label"
              value={afterschoolPrograms.parentNameLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  parentNameLabel: value,
                })
              }
            />
            <CmsField
              label="Parent Name Placeholder"
              value={afterschoolPrograms.parentNamePlaceholder}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  parentNamePlaceholder: value,
                })
              }
            />
            <CmsField
              label="Student Name Label"
              value={afterschoolPrograms.studentNameLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  studentNameLabel: value,
                })
              }
            />
            <CmsField
              label="Student Name Placeholder"
              value={afterschoolPrograms.studentNamePlaceholder}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  studentNamePlaceholder: value,
                })
              }
            />
            <CmsField
              label="Email Label"
              value={afterschoolPrograms.emailLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', { emailLabel: value })
              }
            />
            <CmsField
              label="Email Placeholder"
              value={afterschoolPrograms.emailPlaceholder}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  emailPlaceholder: value,
                })
              }
            />
            <CmsField
              label="Phone Label"
              value={afterschoolPrograms.phoneLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', { phoneLabel: value })
              }
            />
            <CmsField
              label="Phone Placeholder"
              value={afterschoolPrograms.phonePlaceholder}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  phonePlaceholder: value,
                })
              }
            />
            <CmsField
              label="Phone Helper Text"
              value={afterschoolPrograms.phoneHelperText}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  phoneHelperText: value,
                })
              }
            />
            <CmsField
              label="Activities Label"
              value={afterschoolPrograms.activitiesLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  activitiesLabel: value,
                })
              }
            />
            <CmsField
              label="Preferred Days Label"
              value={afterschoolPrograms.preferredDaysLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  preferredDaysLabel: value,
                })
              }
            />
            <CmsField
              label="Preferred Day Options (comma separated)"
              value={toCommaSeparated(afterschoolPrograms.preferredDayOptions)}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  preferredDayOptions: parseCommaSeparated(value),
                })
              }
            />
            <CmsField
              label="Selected Count Suffix"
              value={afterschoolPrograms.selectedCountSuffix}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  selectedCountSuffix: value,
                })
              }
            />
            <CmsField
              label="Notes Label"
              value={afterschoolPrograms.notesLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', { notesLabel: value })
              }
            />
            <CmsField
              label="Notes Placeholder"
              value={afterschoolPrograms.notesPlaceholder}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  notesPlaceholder: value,
                })
              }
              multiline
            />
            <CmsField
              label="Submit Button Label"
              value={afterschoolPrograms.submitButtonLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  submitButtonLabel: value,
                })
              }
            />
            <CmsField
              label="Submitting Button Label"
              value={afterschoolPrograms.submittingButtonLabel}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  submittingButtonLabel: value,
                })
              }
            />
            <CmsField
              label="Required Fields Notice"
              value={afterschoolPrograms.requiredFieldsNotice}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', {
                  requiredFieldsNotice: value,
                })
              }
              multiline
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#1a2945]/70">
              Registration Status Messages
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <CmsField
                label="Validation Error Title"
                value={afterschoolPrograms.submissionMessages.invalidFormTitle}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    submissionMessages: {
                      ...afterschoolPrograms.submissionMessages,
                      invalidFormTitle: value,
                    },
                  })
                }
              />
              <CmsField
                label="Validation Error Message"
                value={afterschoolPrograms.submissionMessages.invalidFormMessage}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    submissionMessages: {
                      ...afterschoolPrograms.submissionMessages,
                      invalidFormMessage: value,
                    },
                  })
                }
                multiline
              />
              <CmsField
                label="Success Title"
                value={afterschoolPrograms.submissionMessages.successTitle}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    submissionMessages: {
                      ...afterschoolPrograms.submissionMessages,
                      successTitle: value,
                    },
                  })
                }
              />
              <CmsField
                label="Success Message"
                value={afterschoolPrograms.submissionMessages.successMessage}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    submissionMessages: {
                      ...afterschoolPrograms.submissionMessages,
                      successMessage: value,
                    },
                  })
                }
                multiline
              />
              <CmsField
                label="Submission Error Title"
                value={afterschoolPrograms.submissionMessages.errorTitle}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    submissionMessages: {
                      ...afterschoolPrograms.submissionMessages,
                      errorTitle: value,
                    },
                  })
                }
              />
              <CmsField
                label="Server Error Message"
                value={afterschoolPrograms.submissionMessages.serverErrorMessage}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    submissionMessages: {
                      ...afterschoolPrograms.submissionMessages,
                      serverErrorMessage: value,
                    },
                  })
                }
                multiline
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#1a2945]/70">
              Registration Validation Messages
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <CmsField
                label="Invalid Payload Message"
                value={afterschoolPrograms.validationMessages.invalidPayload}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      invalidPayload: value,
                    },
                  })
                }
              />
              <CmsField
                label="Generic Review Message"
                value={afterschoolPrograms.validationMessages.genericReview}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      genericReview: value,
                    },
                  })
                }
                multiline
              />
              <CmsField
                label="Parent Required Message"
                value={afterschoolPrograms.validationMessages.parentNameRequired}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      parentNameRequired: value,
                    },
                  })
                }
              />
              <CmsField
                label="Parent Max Length Message"
                value={afterschoolPrograms.validationMessages.parentNameTooLong}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      parentNameTooLong: value,
                    },
                  })
                }
              />
              <CmsField
                label="Student Required Message"
                value={afterschoolPrograms.validationMessages.studentNameRequired}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      studentNameRequired: value,
                    },
                  })
                }
              />
              <CmsField
                label="Student Max Length Message"
                value={afterschoolPrograms.validationMessages.studentNameTooLong}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      studentNameTooLong: value,
                    },
                  })
                }
              />
              <CmsField
                label="Email Required Message"
                value={afterschoolPrograms.validationMessages.emailRequired}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      emailRequired: value,
                    },
                  })
                }
              />
              <CmsField
                label="Email Invalid Message"
                value={afterschoolPrograms.validationMessages.emailInvalid}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      emailInvalid: value,
                    },
                  })
                }
              />
              <CmsField
                label="Phone Required Message"
                value={afterschoolPrograms.validationMessages.phoneRequired}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      phoneRequired: value,
                    },
                  })
                }
              />
              <CmsField
                label="Phone Invalid Message"
                value={afterschoolPrograms.validationMessages.phoneInvalid}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      phoneInvalid: value,
                    },
                  })
                }
              />
              <CmsField
                label="Activities Required Message"
                value={afterschoolPrograms.validationMessages.activitiesRequired}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      activitiesRequired: value,
                    },
                  })
                }
              />
              <CmsField
                label="Preferred Days Required Message"
                value={afterschoolPrograms.validationMessages.preferredDaysRequired}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      preferredDaysRequired: value,
                    },
                  })
                }
              />
              <CmsField
                label="Preferred Days Max Length Message"
                value={afterschoolPrograms.validationMessages.preferredDaysTooLong}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      preferredDaysTooLong: value,
                    },
                  })
                }
              />
              <CmsField
                label="Notes Max Length Message"
                value={afterschoolPrograms.validationMessages.notesTooLong}
                onChange={(value) =>
                  updateDraft('afterschoolPrograms', {
                    validationMessages: {
                      ...afterschoolPrograms.validationMessages,
                      notesTooLong: value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <CmsField
              label="Pricing Title"
              value={afterschoolPrograms.pricingTitle}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', { pricingTitle: value })
              }
            />
            <CmsField
              label="Discount Notice"
              value={afterschoolPrograms.discountNotice}
              onChange={(value) =>
                updateDraft('afterschoolPrograms', { discountNotice: value })
              }
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#1a2945]/70">
              Pricing Items
            </p>
            {afterschoolPrograms.pricingItems.map((item, index) => (
              <div
                key={`${item.durationLabel}-${index}`}
                className="rounded-2xl border border-black/5 bg-white p-4"
              >
                <p className="text-sm font-semibold text-[#1a2945]/70">
                  Item {index + 1}
                </p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <CmsField
                    label="Duration Label"
                    value={item.durationLabel}
                    onChange={(value) => {
                      const nextItems = [...afterschoolPrograms.pricingItems];
                      nextItems[index] = {
                        ...nextItems[index],
                        durationLabel: value,
                      };
                      updateDraft('afterschoolPrograms', {
                        pricingItems: nextItems,
                      });
                    }}
                  />
                  <CmsField
                    label="Price"
                    value={item.price}
                    onChange={(value) => {
                      const nextItems = [...afterschoolPrograms.pricingItems];
                      nextItems[index] = {
                        ...nextItems[index],
                        price: value,
                      };
                      updateDraft('afterschoolPrograms', {
                        pricingItems: nextItems,
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CmsSectionCard>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#c74444] text-white shadow-lg transition-all hover:bg-[#a63535] hover:shadow-xl md:h-14 md:w-14"
          aria-label="Back to top"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
