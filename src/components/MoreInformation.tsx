 export default function MoreInformation() {
  return (
    <section id="more-information" className="w-full bg-[#c74444] text-white px-6 md:px-10 lg:px-16 py-16 md:py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-none tracking-wider">
          <span className="block">MORE</span>
          <span className="block mt-2">INFORMATION</span>
        </h2>

        <div className="space-y-4 text-base md:text-lg opacity-95">
          <p className="">Afterschool@exceedlearningcenterny.com</p>
          <p className="">+1 (516) 226-3114</p>
          <p className="">1360 Willis Ave, Albertson, NY</p>
          <p className="font-semibold underline underline-offset-4">
            www.exceedlearningcenterny.com
          </p>
        </div>

        <div className="pt-4">
          <div className="mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/images/kids/kids-more-information.png"
              alt="Children doing arts and crafts at a table"
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

