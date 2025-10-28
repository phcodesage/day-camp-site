import MoreInformation from './components/MoreInformation';
import KidsDayCamp from './components/KidsDayCamp';
import CampHighlights from './components/CampHighlights';
import ProgramSchedule from './components/ProgramSchedule';
import PricingInfo from './components/PricingInfo';
import NavBar from './components/NavBar';
import AboutSection from './components/AboutSection';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#f5e6e0] relative pt-16">
      <NavBar />
      {/* Decorative Elements */}
      <img
        src="/images/kids/blue-leaf.png"
        alt="Decorative blue leaf"
        className="absolute top-0 right-0 w-72 h-72 -translate-y-12 translate-x-24 opacity-90 object-contain select-none pointer-events-none"
        loading="lazy"
      />
      <div className="absolute top-12 right-32 flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 bg-[#c74444] rounded-full"
            style={{
              opacity: 0.8 - i * 0.15,
              transform: `translateX(${i * 8}px)`,
            }}
          ></div>
        ))}
      </div>

      {/* Bottom left decoration */}
      <div className="absolute bottom-0 left-0 w-64 h-64 -translate-x-20 translate-y-20">
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f5a347] rounded-full opacity-80"></div>
        <div className="absolute bottom-16 left-12 w-32 h-32 bg-[#f5a347] rounded-full opacity-60"></div>
        <div className="absolute bottom-32 left-24 w-20 h-20 bg-[#f5a347] rounded-full opacity-40"></div>
      </div>

      {/* Blue dots decoration bottom left */}
      <div className="absolute bottom-12 left-8 flex gap-2">
        <div className="w-8 h-8 bg-[#1a7b8e] rounded-full"></div>
        <div className="w-6 h-6 bg-[#1a7b8e] rounded-full translate-y-2"></div>
        <div className="w-4 h-4 bg-[#1a7b8e] rounded-full translate-y-4"></div>
      </div>

      {/* Wavy line decoration */}
      <div className="absolute bottom-20 left-40 w-64 h-32">
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-70">
          <path
            d="M 0 50 Q 50 20, 100 50 T 200 50"
            fill="none"
            stroke="#1a7b8e"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="w-full flex items-center justify-center px-8 md:px-16 lg:px-24 py-16 md:py-24">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image Section */}
          <div className="relative">
            <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              {/* Decorative circles */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#1a7b8e] rounded-full opacity-30"></div>
              <div className="absolute top-12 left-8 w-24 h-24 bg-white/50 rounded-full"></div>

              <div className="relative z-10 bg-white rounded-2xl p-6 shadow-lg">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src="/images/kids/chess-kids.jpg"
                    alt="Kids playing chess at camp"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - About Section */}
          <AboutSection />
        </div>
      </div>
      {/* More Information Section */}
      <MoreInformation />
      {/* Kids Day Camp Section */}
      <KidsDayCamp />
      {/* Camp Highlights Section */}
      <CampHighlights />
      {/* Program Schedule Section */}
      <ProgramSchedule />
      {/* Pricing Info Section */}
      <PricingInfo />
    </div>
  );
}

export default App;
