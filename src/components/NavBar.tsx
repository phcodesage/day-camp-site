import { useEffect, useState } from 'react';

export default function NavBar() {
  const items = [
    { href: '#about', label: 'About' },
    { href: '#more-information', label: 'More Information' },
    { href: '#kids-day-camp', label: 'Kids After School Programs' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#pricing-info', label: 'Pricing Info' },
  ];

  const [activeSection, setActiveSection] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sectionIds = items.map((item) => item.href.replace('#', ''));

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-extrabold text-[#c74444]">
            <span className="inline-block w-6 h-6 rounded-md bg-[#c74444]"></span>
            <span className="text-sm sm:text-base">Kids After School Programs</span>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#1a2945]">
            {items.map((it) => {
              const sectionId = it.href.replace('#', '');
              const isActive = activeSection === sectionId;

              return (
                <li key={it.href} className="relative">
                  <a
                    href={it.href}
                    className={`py-1 transition-colors duration-300 ${isActive ? 'text-[#c74444]' : 'hover:text-[#c74444]'
                      }`}
                  >
                    {it.label}
                  </a>
                  {/* Active indicator underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-[#c74444] rounded-full transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                      }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center focus:outline-none"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-[#1a2945] rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
              />
              <span
                className={`block h-0.5 w-full bg-[#1a2945] rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''
                  }`}
              />
              <span
                className={`block h-0.5 w-full bg-[#1a2945] rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 max-w-[80vw] bg-white z-50 lg:hidden shadow-2xl transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <ul className="flex flex-col py-4">
          {items.map((it) => {
            const sectionId = it.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <li key={it.href}>
                <a
                  href={it.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-colors duration-200 ${isActive
                      ? 'text-[#c74444] bg-[#c74444]/5 border-r-4 border-[#c74444]'
                      : 'text-[#1a2945] hover:text-[#c74444] hover:bg-[#f5e6e0]/50'
                    }`}
                >
                  {/* Active dot indicator */}
                  <span
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-[#c74444] scale-100' : 'bg-transparent scale-0'
                      }`}
                  />
                  {it.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
