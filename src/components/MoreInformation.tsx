export default function MoreInformation() {
  return (
    <section
      id="more-information"
      className="w-full bg-[#c74444] px-6 py-16 text-white md:px-10 md:py-20 lg:px-16"
    >
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <h2 className="text-4xl font-extrabold leading-none tracking-wider md:text-5xl">
          <span className="block">MORE</span>
          <span className="mt-2 block">INFORMATION</span>
        </h2>

        <div className="space-y-4 text-base opacity-95 md:text-lg">
          <p>Afterschool@exceedlearningcenterny.com</p>
          <p>+1 (516) 226-3114</p>
          <p>1360 Willis Ave, Albertson, NY</p>
          <p className="font-semibold underline underline-offset-4">
            www.exceedlearningcenterny.com
          </p>
        </div>

        <div className="pt-4">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/images/kids/kids-more-information.png"
              alt="Children doing arts and crafts at a table"
              className="aspect-[4/3] h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
