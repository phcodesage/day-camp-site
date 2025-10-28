export default function NavBar() {
  const items = [
    { href: '#about', label: 'About' },
    { href: '#more-information', label: 'More Information' },
    { href: '#kids-day-camp', label: 'Kids Day Camp' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#pricing-info', label: 'Pricing Info' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-extrabold text-[#c74444]">
          <span className="inline-block w-6 h-6 rounded-md bg-[#c74444]"></span>
          <span>Day Camp</span>
        </a>
        <ul className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#1a2945]">
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="hover:text-[#c74444] transition-colors"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="md:hidden" />
      </div>
    </nav>
  );
}
