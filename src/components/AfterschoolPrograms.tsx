export default function AfterschoolPrograms() {
  return (
    <section id="afterschool" className="w-full bg-white text-[#1a2945] px-6 md:px-10 lg:px-16 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#c74444]">
            Kids Afterschool November
          </h2>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Chess Kids Class */}
          <div className="bg-[#f6dedd] rounded-2xl p-6 md:p-8 shadow-lg space-y-4 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-[#c74444] uppercase">
              Chess Kids Class
            </h3>
            <p className="text-base leading-relaxed">
              Curious about making strategic moves and boosting brainpower? Join our chess program where kids learn to think critically and develop problem-solving skills, all while having fun and making friends!
            </p>
            <div className="pt-4 border-t border-[#1a2945]/20">
              <p className="font-semibold text-lg">Schedule:</p>
              <p className="text-base">Mondays / Thursdays</p>
              <p className="text-base">4pm - 5:15pm</p>
            </div>
          </div>

          {/* Homework Help */}
          <div className="bg-[#f6dedd] rounded-2xl p-6 md:p-8 shadow-lg space-y-4 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-[#c74444] uppercase">
              Homework Help
            </h3>
            <p className="text-base leading-relaxed">
              Personalized homework help that makes tough assignments feel easy and even fun! Whether it's math, science, reading, or writing, our expert support turns frustration into achievement!
            </p>
            <div className="pt-4 border-t border-[#1a2945]/20">
              <p className="font-semibold text-lg">Schedule:</p>
              <p className="text-base">Mondays / Wednesdays / Fridays</p>
              <p className="text-base">4pm - 6pm</p>
            </div>
          </div>

          {/* Art for Kids */}
          <div className="bg-[#f6dedd] rounded-2xl p-6 md:p-8 shadow-lg space-y-4 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-[#c74444] uppercase">
              Art for Kids
            </h3>
            <p className="text-base leading-relaxed">
              Spark your child's creativity with our Arts Program—explore painting, drawing, and crafting, all while having fun and expressing their unique imagination!
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-[#0e243a] text-white rounded-2xl p-8 md:p-10 shadow-xl">
          <h3 className="text-3xl font-bold text-center mb-8">Pricing</h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6 text-center space-y-2 hover:bg-white/20 transition-colors">
              <p className="text-lg font-semibold">1 day/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$75</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center space-y-2 hover:bg-white/20 transition-colors">
              <p className="text-lg font-semibold">2 days/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$150</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center space-y-2 hover:bg-white/20 transition-colors">
              <p className="text-lg font-semibold">3 days/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$225</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center space-y-2 hover:bg-white/20 transition-colors">
              <p className="text-lg font-semibold">4 days/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$300</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center space-y-2 hover:bg-white/20 transition-colors">
              <p className="text-lg font-semibold">5 days/week</p>
              <p className="text-3xl font-bold text-[#f5a347]">$375</p>
            </div>
          </div>

          {/* Special Offer */}
          <div className="bg-[#c74444] rounded-xl p-6 text-center">
            <p className="text-2xl md:text-3xl font-extrabold">
              Get 40% OFF for 2 or more days of afterschool programs!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
