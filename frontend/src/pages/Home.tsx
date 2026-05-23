import React, { useState } from 'react';
import { formatDuration, formatPrice } from '../types';
import { ArrowRight, BookOpen, Users, Award, Calendar, Search, CheckCircle2, TrendingUp, Presentation, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePrograms } from '../context/ProgramsContext';
import { getHomePage, getNews, StrapiNewsItem } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { locale } = useLanguage();
  const { programs } = usePrograms();
  const [searchQuery, setSearchQuery] = useState('');
  const [audience, setAudience] = useState('all');
  const [homeData, setHomeData] = useState<null | {
    hero_badge_text?: string;
    hero_title?: string;
    hero_subtitle?: string;
    stats_graduates?: number;
    stats_years?: number;
    stats_programs?: number;
    stats?: { value: string; label: string; order: number }[];
    licensed_badge_value?: string;
    licensed_badge_label?: string;
    search_heading?: string;
    search_placeholder?: string;
    popular_tags_title?: string;
    popular_tags?: { text: string; query: string; order: number }[];
    featured_section_title?: string;
    featured_section_subtitle?: string;
    admissions_badge_text?: string;
    admissions_section_title?: string;
    news_section_title?: string;
    quality_section_title?: string;
    quality_section_description?: string;
    bottom_cta_title?: string;
    bottom_cta_description?: string;
    quality_bullets?: { text: string }[];
    direction_cards?: { title: string; description: string; link_path: string; icon_key: string; order: number }[];
    admissions_cards?: { title: string; description: string; date_label: string; order: number }[];
  }>(null);
  const [newsItems, setNewsItems] = useState<StrapiNewsItem[]>([]);
  const navigate = useNavigate();

  const featuredPrograms = (() => {
    const featured = programs.filter((p) => p.is_featured);
    return featured.length > 0 ? featured : programs.slice(0, 3);
  })();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (audience !== 'all') params.set('audience', audience);
    navigate(`/programs?${params.toString()}`);
  };

  const handleTagSearch = (tag: string) => {
    navigate(`/programs?search=${encodeURIComponent(tag)}`);
  };

  const DIRECTION_ICON_MAP: Record<string, React.ElementType> = {
    TrendingUp, Briefcase, Award, Presentation, BookOpen, Users,
    trending_up: TrendingUp, briefcase: Briefcase, award: Award,
  };

  const FORMAT_ICON: Record<string, string> = { online: '💻', offline: '📍', mixed: '🏛' };
  const FORMAT_LABEL: Record<string, string> = { online: 'Онлайн', offline: 'Офлайн', mixed: 'Змішана' };
  const CERT_ICON: Record<string, string> = { qualification: '📋', retraining: '🎓', master: '🎓', 'pre-university': '📜' };

  React.useEffect(() => {
    getHomePage(locale).then(setHomeData).catch(() => undefined);
    getNews(locale, 3).then(setNewsItems).catch(() => undefined);
  }, [locale]);

  const popularTags = homeData?.popular_tags?.length
    ? [...homeData.popular_tags].sort((a, b) => a.order - b.order)
    : [];

  const statItems = homeData?.stats?.length
    ? [...homeData.stats].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="flex flex-col gap-0 pb-0">
      {/* Hero Section */}
      <section className="relative bg-[#002f5e] text-white pt-24 pb-32 overflow-hidden mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#002f5e] via-[#002f5e]/90 to-transparent" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl space-y-6 mb-12">
            {homeData?.hero_badge_text && (
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
                {homeData.hero_badge_text}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {homeData?.hero_title || ''}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl font-light">
              {homeData?.hero_subtitle || ''}
            </p>
          </div>

          {/* Search Widget */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-4xl text-gray-800">
            {homeData?.search_heading && (
              <h2 className="text-xl font-bold mb-4">{homeData.search_heading}</h2>
            )}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={homeData?.search_placeholder || ''}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3] focus:border-[#0056b3] outline-none transition-all placeholder:text-gray-400"
                />
              </div>
              <div className="w-full md:w-64">
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3] focus:border-[#0056b3] outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Для кого програма?</option>
                  <option value="teachers">Педагогам</option>
                  <option value="civil">Держслужбовцям</option>
                  <option value="applicants">Абітурієнтам</option>
                  <option value="specialists">Фахівцям</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-[#0056b3] hover:bg-[#003366] text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 md:w-auto w-full"
              >
                Пошук <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {popularTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500 items-center">
                {homeData?.popular_tags_title && (
                  <span className="font-medium text-gray-700">{homeData.popular_tags_title}</span>
                )}
                {popularTags.map((tag) => (
                  <button
                    key={tag.text}
                    onClick={() => handleTagSearch(tag.query || tag.text)}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                  >
                    {tag.text}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100">
              <Link
                to="/programs"
                className="flex-1 text-center bg-[#0056b3] text-white font-bold py-3 rounded-xl hover:bg-[#003366] transition-colors"
              >
                Усі програми
              </Link>
              <Link
                to="/contacts"
                className="flex-1 text-center border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:border-[#0056b3] hover:text-[#0056b3] transition-colors"
              >
                Безкоштовна консультація
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences / Key Directions */}
      {homeData?.direction_cards?.length ? (
        <section className="container mx-auto px-4 md:px-6 mb-24 -mt-20 relative z-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...homeData.direction_cards]
              .sort((a, b) => a.order - b.order)
              .map((card) => {
                const IconComp = DIRECTION_ICON_MAP[card.icon_key] || TrendingUp;
                return (
                  <Link
                    key={card.title}
                    to={card.link_path || '/programs'}
                    className="group flex flex-col justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all h-full"
                  >
                    <div>
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0056b3] mb-5 group-hover:scale-110 transition-transform">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-gray-600 text-sm mb-6">{card.description}</p>
                    </div>
                    <div className="flex items-center text-[#0056b3] font-medium text-sm group-hover:underline mt-auto pt-4 border-t border-gray-50">
                      Детальніше <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      ) : null}

      {/* Stats Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-200 mb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {homeData?.quality_section_title || ''}
              </h2>
              <p className="text-lg text-gray-600">
                {homeData?.quality_section_description || ''}
              </p>
              {homeData?.quality_bullets && homeData.quality_bullets.length > 0 && (
                <ul className="space-y-3 pt-4">
                  {homeData.quality_bullets.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                      <span className="text-gray-800 font-medium">{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {statItems.map((stat, i) => (
                <div
                  key={i}
                  className={i === 0
                    ? 'bg-[#0056b3] p-6 rounded-2xl shadow-md text-white text-center border border-[#003366]'
                    : 'bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center'}
                >
                  <div className={`text-4xl font-extrabold mb-2 ${i === 0 ? '' : 'text-[#0056b3]'}`}>{stat.value}</div>
                  <div className={`text-sm font-medium ${i === 0 ? 'text-white/80' : 'text-gray-600'}`}>{stat.label}</div>
                </div>
              ))}
              {homeData?.licensed_badge_value && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="text-4xl font-extrabold text-[#0056b3] mb-2">{homeData.licensed_badge_value}</div>
                  <div className="text-gray-600 text-sm font-medium">{homeData.licensed_badge_label}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      {featuredPrograms.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{homeData?.featured_section_title || ''}</h2>
              <p className="text-gray-600 mt-1">{homeData?.featured_section_subtitle || ''}</p>
            </div>
            <Link to="/programs" className="hidden md:inline-flex items-center text-[#0056b3] font-semibold hover:text-[#003366]">
              Всі програми <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredPrograms.map((program) => (
              <Link
                key={program.id}
                to={`/programs/${program.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="p-6 flex flex-col h-full">
                  <span className="text-xs font-semibold bg-dnu-light text-dnu-dark px-3 py-1 rounded-full mb-3 self-start">
                    {program.category === 'qualification' ? 'Підвищення кваліфікації' :
                     program.category === 'retraining' ? 'Перепідготовка' :
                     program.category === 'master' ? 'Магістратура' : 'НМТ-підготовка'}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#0056b3] transition-colors leading-snug">
                    {program.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{program.description}</p>
                  <hr className="border-gray-100 mb-4" />
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>⏱ {formatDuration(program.duration, program.duration_unit)}</span>
                    <span>{FORMAT_ICON[program.format]} {FORMAT_LABEL[program.format]}</span>
                    <span>{CERT_ICON[program.category]} {program.certificate?.split(' ')[0] || 'Документ'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#003366]">{formatPrice(program.price)}</span>
                    <span className="text-sm text-[#0056b3] font-semibold group-hover:underline flex items-center gap-1">
                      Детальніше <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link to="/programs" className="inline-flex items-center text-[#0056b3] font-semibold">
              Всі програми <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Admissions / Deadlines */}
      {homeData?.admissions_cards?.length ? (
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-4 border-b border-gray-200">
            <div>
              {homeData.admissions_badge_text && (
                <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  {homeData.admissions_badge_text}
                </div>
              )}
              <h2 className="text-3xl font-bold text-gray-900">{homeData.admissions_section_title}</h2>
            </div>
            <Link to="/programs" className="hidden md:inline-flex items-center text-[#0056b3] font-semibold hover:text-[#003366]">
              Всі програми <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[...homeData.admissions_cards]
              .sort((a, b) => a.order - b.order)
              .map((card, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gray-300 group-hover:bg-[#0056b3] transition-colors"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-3 bg-gray-100 w-max px-3 py-1 rounded-md text-sm font-bold">
                      <Calendar className="h-4 w-4" />
                      {card.date_label}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                    <Link to="/programs" className="text-[#0056b3] font-medium text-sm group-hover:underline flex items-center">
                      Детальніше <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      {/* News Preview */}
      {newsItems.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900">{homeData?.news_section_title || ''}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    item.category === 'announcement' ? 'bg-blue-50 text-blue-700' :
                    item.category === 'event' ? 'bg-green-50 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.category === 'announcement' ? 'Оголошення' :
                     item.category === 'event' ? 'Подія' : 'Новина'}
                  </span>
                  {item.date && (
                    <span className="text-xs text-gray-400">
                      {new Date(item.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug line-clamp-2">{item.title}</h3>
                {item.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-[#003366] text-white py-16 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-4">
            {homeData?.bottom_cta_title || ''}
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            {homeData?.bottom_cta_description || ''}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apply"
              className="bg-white text-[#003366] font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Подати заявку
            </Link>
            <Link
              to="/contacts"
              className="border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Зв'язатися з нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
