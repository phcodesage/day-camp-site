import AboutSection from './components/AboutSection';
import AfterschoolPrograms from './components/AfterschoolPrograms';
import CampHighlights from './components/CampHighlights';
import MoreInformation from './components/MoreInformation';
import NavBar from './components/NavBar';
import ProgramSchedule from './components/ProgramSchedule';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#f5e6e0] pt-16">
      <NavBar />
      <ScrollToTop />

      <main>
        <img
          src="/images/kids/blue-leaf.png"
          alt="Decorative blue leaf"
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-24 -translate-y-12 select-none object-contain opacity-90"
          loading="lazy"
        />

        <div className="absolute right-32 top-12 flex flex-col gap-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-4 w-4 rounded-full bg-[#c74444]"
              style={{
                opacity: 0.8 - index * 0.15,
                transform: `translateX(${index * 8}px)`,
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-20 translate-y-20">
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#f5a347] opacity-80" />
          <div className="absolute bottom-16 left-12 h-32 w-32 rounded-full bg-[#f5a347] opacity-60" />
          <div className="absolute bottom-32 left-24 h-20 w-20 rounded-full bg-[#f5a347] opacity-40" />
        </div>

        <div className="absolute bottom-12 left-8 flex gap-2">
          <div className="h-8 w-8 rounded-full bg-[#1a7b8e]" />
          <div className="h-6 w-6 translate-y-2 rounded-full bg-[#1a7b8e]" />
          <div className="h-4 w-4 translate-y-4 rounded-full bg-[#1a7b8e]" />
        </div>

        <div className="absolute bottom-20 left-40 h-32 w-64">
          <svg viewBox="0 0 200 100" className="h-full w-full opacity-70">
            <path
              d="M 0 50 Q 50 20, 100 50 T 200 50"
              fill="none"
              stroke="#1a7b8e"
              strokeWidth="3"
            />
          </svg>
        </div>

        <div className="flex w-full items-center justify-center px-8 py-16 md:px-16 md:py-24 lg:px-24">
          <div className="grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
            <div className="relative">
              <div className="rounded-3xl bg-white/30 p-8 shadow-xl backdrop-blur-sm">
                <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-[#1a7b8e] opacity-30" />
                <div className="absolute left-8 top-12 h-24 w-24 rounded-full bg-white/50" />

                <div className="relative z-10 rounded-2xl bg-white p-6 shadow-lg">
                  <div className="aspect-square overflow-hidden rounded-xl">
                    <img
                      src="/images/kids/chess-kids.jpg"
                      alt="Kids playing chess at camp"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            <AboutSection />
          </div>
        </div>

        <MoreInformation />
        <CampHighlights />
        <ProgramSchedule />
        <AfterschoolPrograms />
      </main>
    </div>
  );
}

export default App;
