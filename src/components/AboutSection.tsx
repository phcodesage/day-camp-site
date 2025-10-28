export default function AboutSection() {
  return (
    <section id="about" className="space-y-6 z-10 scroll-mt-24">
      <h1 className="text-5xl md:text-6xl font-bold text-[#c74444] leading-tight">
        KIDS HOLIDAY CAMP
      </h1>

      <div className="space-y-4 text-[#1a2945]">
        <p className="text-lg italic font-medium">
          School is close, but we are not.
        </p>
        
        <p className="text-lg leading-relaxed">
          Turn school break into an incredible journey! We've designed a camp that balances brain-boosting activities with non-stop fun, ensuring your child stays engaged, active, and happy.
        </p>

        <p className="text-lg leading-relaxed">
          This is more than just a camp—it's an opportunity for your child to discover their passions, build confidence, and truly ignite Their Brilliance!
        </p>
      </div>

      <button onClick={() => window.scrollTo({ top: document.getElementById('more-information')!.offsetTop, behavior: 'smooth' })} className="mt-8 bg-[#c74444] hover:bg-[#a63535] text-white font-semibold px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
        Learn More
      </button>
    </section>
  );
}
