'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SiteChromeContent } from '@/lib/cms/types';

export default function NavBar({
  cms,
}: Readonly<{ cms: SiteChromeContent }>) {
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sectionIds = cms.navItems.map((item) => item.href.replace('#', ''));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [cms.navItems]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[#c74444]">
            <Image
              src={cms.logoSrc}
              alt={cms.logoAlt}
              width={40}
              height={46}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="text-sm sm:text-base">
              {cms.brandTitle}
            </span>
          </Link>

          <ul className="hidden items-center gap-6 text-sm font-semibold text-[#1a2945] lg:flex">
            {cms.navItems.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;

              return (
                <li key={item.href} className="relative">
                  <a
                    href={item.href}
                    className={`py-1 transition-colors duration-300 ${
                      isActive ? 'text-[#c74444]' : 'hover:text-[#c74444]'
                    }`}
                  >
                    {item.label}
                  </a>
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 rounded-full bg-[#c74444] transition-all duration-300 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          <button
            onClick={() => setIsMenuOpen((current) => !current)}
            className="relative flex h-10 w-10 items-center justify-center lg:hidden"
            aria-label={
              isMenuOpen ? cms.mobileMenuCloseLabel : cms.mobileMenuOpenLabel
            }
          >
            <div className="relative flex h-5 w-6 flex-col justify-between">
              <span
                className={`block h-0.5 w-full rounded-full bg-[#1a2945] transition-all duration-300 ${
                  isMenuOpen ? 'translate-y-2 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full rounded-full bg-[#1a2945] transition-all duration-300 ${
                  isMenuOpen ? 'scale-0 opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full rounded-full bg-[#1a2945] transition-all duration-300 ${
                  isMenuOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 max-w-[80vw] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="flex flex-col py-4">
          {cms.navItems.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-6 py-4 font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'border-r-4 border-[#c74444] bg-[#c74444]/5 text-[#c74444]'
                      : 'text-[#1a2945] hover:bg-[#f5e6e0]/50 hover:text-[#c74444]'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      isActive ? 'scale-100 bg-[#c74444]' : 'scale-0 bg-transparent'
                    }`}
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
