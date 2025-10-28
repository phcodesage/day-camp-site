export default function KidsDayCamp() {
  return (
    <section id="kids-day-camp" className="w-full bg-[#f6dedd] text-[#1a2945] px-6 md:px-10 lg:px-16 py-16 md:py-20 scroll-mt-24">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Top emblem logo */}
        <div className="flex justify-center">
          <img
            src="https://lirp.cdn-website.com/3bba8822/dms3rep/multi/opt/Exceed-learning-center-194w.png"
            alt="Exceed Learning Center logo"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain drop-shadow"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Title */}
        <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide">
          <span className="block">KIDS HOLIDAY</span>
          <span className="block mt-1">CAMP</span>
        </h2>

        {/* Circular hero image */}
        <div className="mx-auto w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl">
          <img
            src="/images/kids/kids-day-camp.png"
            alt="Kids clapping and smiling in a classroom"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Taglines */}
        <div className="space-y-3">
          <p className="uppercase tracking-widest font-semibold">Where adventure begins!</p>
          <p className="text-2xl md:text-3xl font-extrabold text-[#c74444] uppercase">Grades K-6</p>
        </div>
      </div>
    </section>
  );
}
