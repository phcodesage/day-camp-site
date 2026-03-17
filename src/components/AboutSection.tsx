export default function AboutSection() {
  return (
    <section id="about" className="z-10 space-y-6 scroll-mt-24">
      <h1 className="text-5xl font-bold leading-tight text-[#c74444] md:text-6xl">
        KIDS AFTER SCHOOL PROGRAMS
      </h1>

      <div className="space-y-4 text-[#1a2945]">
        <p className="text-lg italic font-medium">
          School is out, but learning continues.
        </p>

        <p className="text-lg leading-relaxed">
          Turn after-school hours into an incredible journey. We have designed
          programs that balance brain-boosting activities with non-stop fun,
          ensuring your child stays engaged, active, and happy.
        </p>

        <p className="text-lg leading-relaxed">
          This is more than just after-school care. It is an opportunity for
          your child to discover passions, build confidence, and truly ignite
          their brilliance.
        </p>
      </div>

      <a
        href="#more-information"
        className="mt-8 inline-flex rounded-full bg-[#c74444] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#a63535]"
      >
        Learn More
      </a>
    </section>
  );
}
