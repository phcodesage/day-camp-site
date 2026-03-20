import { getCmsSectionContent } from '@/lib/cms/cms';

export const dynamic = 'force-dynamic';

export default async function MoreInformation() {
  const content = await getCmsSectionContent('moreInformation');
  const videoUrl = content.videoUrl?.trim();

  return (
    <section
      id="more-information"
      className="w-full bg-[#c74444] px-6 py-16 text-white md:px-10 md:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <h2 className="text-4xl font-extrabold leading-none tracking-wider md:text-5xl">
          <span className="block">{content.headingLine1}</span>
          <span className="mt-2 block">{content.headingLine2}</span>
        </h2>

        <div className="space-y-4 text-base opacity-95 md:text-lg">
          <p>{content.email}</p>
          <p>{content.phone}</p>
          <p>{content.address}</p>
          <p className="font-semibold underline underline-offset-4">
            <a href={content.websiteHref} target="_blank" rel="noreferrer">
              {content.websiteLabel}
            </a>
          </p>
        </div>

        {videoUrl ? (
          <div className="pt-4">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-xl">
              <video
                src={videoUrl}
                controls
                className="h-auto w-full rounded-2xl"
              />
            </div>
          </div>
        ) : null}

        <div className="pt-4">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-xl">
            <img
              src={content.imageSrc}
              alt={content.imageAlt}
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
