export default function ProgramSchedule() {
  return (
    <section id="schedule" className="w-full bg-[#0e243a] text-white px-6 md:px-10 lg:px-16 py-16 md:py-24 scroll-mt-24">
      <div className="max-w-5xl mx-auto grid gap-10 md:gap-14">
        <div className="grid gap-4 max-w-xl w-full mx-auto">
          <div className="rounded-full bg-[#c74444] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl">BRAIN GAMES</div>
          <div className="rounded-full bg-[#f19ac6] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl text-[#1a2945]">CREATIVE ARTS</div>
          <div className="rounded-full bg-[#76b9d4] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl text-[#0e243a]">CHESS AND ABACUS LEARNING</div>
          <div className="rounded-full bg-[#c74444] text-center font-extrabold tracking-wide py-4 px-6 text-lg md:text-xl">AND OTHER INTERACTIVE ACTIVITIES</div>
        </div>

        <div className="text-center space-y-2">
          <p className="opacity-90">Enroll your kids now! <span className="font-bold">Choose your best schedule below!</span></p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <ul className="space-y-3 text-base md:text-lg max-w-md mx-auto md:mx-0">
            <li className="list-disc list-inside font-bold">November 4, 2025</li>
            <li className="list-disc list-inside font-bold">November 11, 2025</li>
            <li className="list-disc list-inside">October 13, 2025</li>
            <li className="list-disc list-inside">October 20, 2025</li>
            <li className="list-disc list-inside">December 24-26, 2025</li>
            <li className="list-disc list-inside">December 29-31, 2025</li>
          </ul>

          <div className="justify-self-center md:justify-self-end">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative">
              <img
                src="/images/kids/child-abacus.png"
                alt="Happy child with abacus"
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
