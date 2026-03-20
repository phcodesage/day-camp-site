import { getCmsSectionContent } from '@/lib/cms/cms';

export const dynamic = 'force-dynamic';

export default async function ProgramSchedule() {
  const content = await getCmsSectionContent('programSchedule');
  const videoUrl = content.videoUrl?.trim();

  return (
    <section id="schedule" className="w-full bg-[#0e243a] text-white px-6 md:px-10 lg:px-16 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto grid gap-10 md:gap-14">
        <div className="grid gap-4 max-w-xl w-full mx-auto">
          <div className="rounded-full bg-[#c74444] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl">
            {content.badgeLabels[0]}
          </div>
          <div className="rounded-full bg-[#f19ac6] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl text-[#1a2945]">
            {content.badgeLabels[1]}
          </div>
          <div className="rounded-full bg-[#76b9d4] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl text-[#0e243a]">
            {content.badgeLabels[2]}
          </div>
          <div className="rounded-full bg-[#c74444] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl">
            {content.badgeLabels[3]}
          </div>
          <div className="rounded-full bg-[#f5a347] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl text-[#0e243a]">
            {content.badgeLabels[4]}
          </div>
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
