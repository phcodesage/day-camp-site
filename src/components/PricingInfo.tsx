export default function PricingInfo() {
  return (
    <section id="pricing-info" className="w-full bg-[#f6dedd] text-[#1a2945] px-6 md:px-10 lg:px-16 py-16 md:py-24">
      <div className="max-w-5xl mx-auto grid gap-10 md:gap-14">
        {/* Image and discount badge */}
        <div className="relative mx-auto w-full max-w-3xl">
          <div className="rounded-2xl overflow-hidden shadow-xl ring-4 ring-[#c74444]/70">
            <img
              src="/images/kids/teacher-with-kids-in-classroom.png"
              alt="Teacher with kids in a classroom"
              className="w-full h-full object-cover aspect-[4/5] md:aspect-[4/3]"
              loading="lazy"
            />
          </div>

          {/* Red blob discount badge */}
          <div className="absolute -bottom-10 right-6 md:-bottom-12 md:right-10">
            <div className="bg-[#c74444] text-white rounded-[40%] px-6 py-6 md:px-8 md:py-8 shadow-lg rotate-[-8deg]">
              <p className="text-base md:text-lg font-extrabold leading-tight text-center">
                MULTI DAYS AND
                <br />
                SIBLING
                <br />
                DISCOUNT
                <br />
                <span className="text-xs md:text-sm font-semibold tracking-wider">MAY APPLY</span>
              </p>
            </div>
          </div>
        </div>

        {/* Pricing bullets */}
        <div className="max-w-3xl mx-auto grid gap-6">
          <ul className="space-y-6 text-base md:text-lg">
            <li>
              <div className="flex items-start gap-3">
                <span className="mt-2 inline-block w-2.5 h-2.5 rounded-full bg-[#0e243a]" aria-hidden="true"></span>
                <div>
                  <p className="font-bold">Half day 9–12PM</p>
                  <p className="text-[#c74444]/80 italic text-sm md:text-base">(only breakfast included).</p>
                  <p className="text-[#c74444] font-extrabold mt-1">$90/day.</p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex items-start gap-3">
                <span className="mt-2 inline-block w-2.5 h-2.5 rounded-full bg-[#0e243a]" aria-hidden="true"></span>
                <div>
                  <p className="font-bold">Full day 9–3PM</p>
                  <p className="text-[#c74444]/80 italic text-sm md:text-base">(breakfast and lunch)</p>
                  <p className="text-[#c74444] font-extrabold mt-1">$150 per day.</p>
                </div>
              </div>
            </li>
          </ul>

          <p className="text-center font-semibold underline underline-offset-4 text-[#1a2945]/90">
            www.exceedlearningcenterny.com
          </p>
        </div>
      </div>
    </section>
  );
}
