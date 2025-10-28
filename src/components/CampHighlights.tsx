export default function CampHighlights() {
  return (
    <section id="highlights" className="w-full bg-[#f6dedd] text-[#1a2945] px-6 md:px-10 lg:px-16 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto grid gap-8 md:gap-12">
        {/* Top image with rounded corners */}
        <div className="mx-auto w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/images/kids/highlights-kids.png"
            alt="Kids working together on activities at camp"
            className="w-full h-full object-cover aspect-[16/9] md:aspect-[3/1]"
            loading="lazy"
          />
        </div>

        {/* Intro heading */}
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#c74444] text-center">
          At our day camp, every day is a new adventure! Your child will:
        </h3>

        {/* Activities list */}
        <div className="bg-[#0e243a] text-white rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl mx-auto">
          <ul className="space-y-5 text-base md:text-lg leading-relaxed">
            <li className="flex gap-3">
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" aria-hidden="true"></span>
              <span className="font-semibold">Brain games</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" aria-hidden="true"></span>
              <span className="font-semibold">Creative Arts</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" aria-hidden="true"></span>
              <span className="font-semibold">Chess and Abacus learning</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" aria-hidden="true"></span>
              <span className="font-semibold">Mini Science</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" aria-hidden="true"></span>
              <span className="font-semibold">and other interactive activities</span>
            </li>
          </ul>
        </div>
        
        {/* Highlight list card */}
        <div className="bg-[#0e243a] text-white rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl mx-auto">
          <ul className="space-y-5 text-base md:text-lg leading-relaxed">
            <li className="flex gap-3">
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" aria-hidden="true"></span>
              <span>
                <span className="font-semibold">Explore New Skills:</span> Dive into creative
                projects like arts and crafts, or challenge their minds with brain games and strategic
                thinking exercises.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" aria-hidden="true"></span>
              <span>
                <span className="font-semibold">Make New Friends:</span> Build friendships and develop
                teamwork skills in a safe, supportive, and engaging environment.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" aria-hidden="true"></span>
              <span>
                <span className="font-semibold">Boost Confidence:</span> Our hands-on activities and
                positive encouragement help every child discover their unique talents and feel proud of
                their accomplishments.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
