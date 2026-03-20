import { getCmsSectionContent } from '@/lib/cms/cms';

export const dynamic = 'force-dynamic';

export default async function CampHighlights() {
  const content = await getCmsSectionContent('campHighlights');
  const videoUrl = content.videoUrl?.trim();

  return (
    <section id="highlights" className="w-full bg-[#f6dedd] text-[#1a2945] px-6 md:px-10 lg:px-16 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto grid gap-8 md:gap-12">
        {/* Top media with rounded corners */}
        {videoUrl ? (
          <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl">
            <video
              src={videoUrl}
              controls
              className="w-full h-auto"
            />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl">
            <img
              src={content.imageSrc}
              alt={content.imageAlt}
              className="w-full h-full object-cover aspect-[16/9] md:aspect-[3/1]"
              loading="lazy"
            />
          </div>
        )}

        {/* Intro heading */}
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#c74444] text-center">
          {content.introHeading}
        </h3>

        {/* Activities list */}
        <div className="bg-[#0e243a] text-white rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl mx-auto">
          <ul className="space-y-5 text-base md:text-lg leading-relaxed">
            {content.activities.map((activity) => (
              <li key={activity} className="flex gap-3">
                <span
                  className="mt-2 inline-block w-2 h-2 rounded-full bg-white"
                  aria-hidden="true"
                ></span>
                <span className="font-semibold">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Highlight list card */}
        <div className="bg-[#0e243a] text-white rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl mx-auto">
          <ul className="space-y-5 text-base md:text-lg leading-relaxed">
            {content.highlights.map((item) => (
              <li key={item.boldText} className="flex gap-3">
                <span
                  className="mt-2 inline-block w-2 h-2 rounded-full bg-white"
                  aria-hidden="true"
                ></span>
                <span>
                  <span className="font-semibold">{item.boldText}</span> {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
