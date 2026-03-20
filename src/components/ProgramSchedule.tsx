import { getCmsSectionContent } from '@/lib/cms/cms';

export const dynamic = 'force-dynamic';

const BADGE_STYLES = [
  'bg-[#c74444] text-white',
  'bg-[#f19ac6] text-[#1a2945]',
  'bg-[#76b9d4] text-[#0e243a]',
  'bg-[#c74444] text-white',
  'bg-[#f5a347] text-[#0e243a]',
] as const;

export default async function ProgramSchedule() {
  const content = await getCmsSectionContent('programSchedule');
  const videoUrl = content.videoUrl?.trim();
  const badgeLabels = content.badgeLabels.length
    ? content.badgeLabels
    : ['Programs'];

  return (
    <section id="schedule" className="w-full bg-[#0e243a] text-white px-6 md:px-10 lg:px-16 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto grid gap-10 md:gap-14">
        <div className="grid gap-4 max-w-xl w-full mx-auto">
          {badgeLabels.map((label, index) => (
            <div
              key={`${label}-${index}`}
              className={`rounded-full px-6 py-4 text-center text-lg font-extrabold tracking-wide md:text-xl ${
                BADGE_STYLES[index % BADGE_STYLES.length]
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="text-center space-y-2">
          <p className="opacity-90">
            {content.enrollPrefix}{' '}
            <span className="font-bold">{content.enrollBold}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div className="space-y-4 text-base md:text-lg max-w-md mx-auto md:mx-0">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-2xl md:text-3xl font-extrabold text-[#f5a347] mb-2">
                {content.scheduleTitle}
              </p>
              <p className="opacity-90">{content.scheduleSubtitle}</p>
              <p className="mt-3 font-semibold">{content.scheduleBody}</p>
            </div>
          </div>

          <div className="justify-self-center md:justify-self-end">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <img
                  src={content.imageSrc}
                  alt={content.imageAlt}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
