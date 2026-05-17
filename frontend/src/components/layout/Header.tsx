import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, GraduationCap, Phone, Mail, Search, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../../context/LanguageContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Первинна навігація (Основні напрямки)
  const primaryNavItems = [
    { name: 'Підвищення кваліфікації', path: '/qualification' },
    { name: 'Перепідготовка / Магістратура', path: '/retraining' },
    { name: 'Вступникам (НМТ)', path: '/pre-university' },
    { name: 'Про Центр', path: '/about' },
  ];

  // Вторинна навігація
  const secondaryNavItems = [
    { name: 'Випускникам', path: '/alumni' },
    { name: 'Партнерам', path: '/partners' },
    { name: 'Співробітникам', path: '/staff' },
    { name: 'Документи', path: '/documents' },
    { name: 'Контакти', path: '/contacts' },
  ];

  return (
    <>
      {/* Top Banner - Secondary Navigation */}
      <div className="hidden lg:block bg-dnu-dark text-white/90 text-sm py-2">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <a href="tel:+380561234567" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5" /> +38 (056) 123-45-67
            </a>
            <a href="mailto:info@cno.dnu.edu.ua" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5" /> info@cno.dnu.edu.ua
            </a>
          </div>
          <div className="flex gap-5 items-center">
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'transition-colors hover:text-white',
                    isActive ? 'text-white font-medium' : 'text-gray-300'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
            <div className="border-l border-white/20 pl-5 flex items-center gap-4">
              <Link to="/admin/login" className="text-gray-300 hover:text-white transition-colors text-xs font-medium bg-white/10 px-3 py-1 rounded-full">
                Увійти
              </Link>
              <button
                type="button"
                onClick={() => setLocale(locale === 'uk' ? 'en' : 'uk')}
                className="flex items-center gap-1 text-gray-300 hover:text-white cursor-pointer transition-colors"
                title="Switch language"
              >
                <Globe className="h-4 w-4" />
                <span>{locale.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={clsx(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-2" : "bg-white py-4 border-b border-gray-100"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-dnu-blue p-2.5 rounded-lg group-hover:bg-dnu-dark transition-colors">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl text-dnu-dark leading-tight">Центр післядипломної освіти</span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">ДНУ імені Олеся Гончара</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-8">
              {primaryNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'text-base font-medium transition-colors hover:text-dnu-blue relative text-gray-800',
                      isActive && 'text-dnu-blue after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-dnu-blue after:rounded-full'
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="hidden xl:flex items-center gap-4">
              <button aria-label="Search" className="text-gray-600 hover:text-dnu-blue transition-colors p-2">
                <Search className="h-5 w-5" />
              </button>
              <Link
                to="/apply"
                className="bg-dnu-blue text-white px-5 py-2.5 rounded-md font-medium hover:bg-dnu-dark transition-all shadow-sm hover:shadow-md"
              >
                Подати заявку
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full border-b border-gray-200 bg-white shadow-lg overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="p-4 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Основні напрями</h3>
                {primaryNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'block px-2 text-lg font-medium transition-colors hover:text-dnu-blue',
                        isActive ? 'text-dnu-blue' : 'text-gray-800'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Інформація</h3>
                {secondaryNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'block px-2 text-base transition-colors hover:text-dnu-blue',
                        isActive ? 'text-dnu-blue font-medium' : 'text-gray-600'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/apply"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-dnu-blue text-white py-3 rounded-md font-medium hover:bg-dnu-dark transition-colors shadow-sm"
                >
                  Подати заявку на навчання
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
