import { getCmsSectionContent } from '@/lib/cms/cms';

export const dynamic = 'force-dynamic';

export default async function AboutSection() {
  const content = await getCmsSectionContent('about');

  return (
    <section id="about" className="z-10 space-y-6 scroll-mt-24">
      <h1 className="text-5xl font-bold leading-tight text-[#c74444] md:text-6xl">
        {content.heading}
      </h1>

      <div className="space-y-4 text-[#1a2945]">
        <p className="text-lg italic font-medium">
          {content.italicLine}
        </p>

        <p className="text-lg leading-relaxed">{content.paragraph1}</p>

        <p className="text-lg leading-relaxed">{content.paragraph2}</p>
      </div>

      <a
        href={content.buttonHref}
        className="mt-8 inline-flex rounded-full bg-[#c74444] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#a63535]"
      >
        {content.buttonLabel}
      </a>
    </section>
  );
}
