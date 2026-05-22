import React, { useState } from 'react';
import { formatDuration, formatPrice } from '../types';
import { ArrowRight, BookOpen, Users, Award, Calendar, Search, CheckCircle2, TrendingUp, Presentation, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePrograms } from '../context/ProgramsContext';
import { getHomePage } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

const FEATURED_IDS = ['q4', 'r1', 'p1']; // Педагогічна майстерність, Психологія, НМТ Математика

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
    quality_section_title?: string;
    quality_section_description?: string;
    bottom_cta_title?: string;
    bottom_cta_description?: string;
    quality_bullets?: { text: string }[];
    direction_cards?: { title: string; description: string; link_path: string; icon_key: string; order: number }[];
    admissions_cards?: { title: string; description: string; date_label: string; order: number }[];
  }>(null);
  const navigate = useNavigate();

  const featuredPrograms = programs.filter((p) => FEATURED_IDS.includes(p.id));

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

  const FORMAT_ICON: Record<string, string> = { online: '💻', offline: '📍', mixed: '🏛' };
  const FORMAT_LABEL: Record<string, string> = { online: 'Онлайн', offline: 'Офлайн', mixed: 'Змішана' };
  const CERT_ICON: Record<string, string> = { qualification: '📋', retraining: '🎓', master: '🎓', 'pre-university': '📜' };

  React.useEffect(() => {
    getHomePage(locale).then(setHomeData).catch(() => undefined);
  }, [locale]);

  return (
    <div className="flex flex-col gap-0 pb-0">
      {/* Hero Section with Functional Search */}
      <section className="relative bg-[#002f5e] text-white pt-24 pb-32 overflow-hidden mb-16">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#002f5e] via-[#002f5e]/90 to-transparent" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl space-y-6 mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
              {homeData?.hero_badge_text || 'Дніпровський національний університет імені Олеся Гончара'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {homeData?.hero_title || (
                <>
                  Ваш розвиток — <br /><span className="text-[#ffcc00]">наша спеціальність</span>
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl font-light">
              {homeData?.hero_subtitle ||
                'Якісна післядипломна освіта, підвищення кваліфікації та підготовка до вступу. Станьте затребуваним фахівцем разом з лідером освіти регіону.'}
            </p>
          </div>

          {/* Search Widget */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-4xl text-gray-800">
            <h2 className="text-xl font-bold mb-4">Знайдіть свою програму:</h2>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Наприклад: Психологія, Менеджмент, НМТ..."
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

            <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500 items-center">
              <span className="font-medium text-gray-700">Популярне:</span>
              {['Підготовка до НМТ', 'Психологія', 'Менеджмент', 'Англійська мова'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSearch(tag)}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

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
      <section className="container mx-auto px-4 md:px-6 mb-24 -mt-20 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/qualification" className="group flex flex-col justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all h-full">
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0056b3] mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Здобути нові навички</h3>
              <p className="text-gray-600 text-sm mb-6">
                Підвищення кваліфікації для фахівців. Сучасні програми та сертифікати державного зразка.
              </p>
            </div>
            <div className="flex items-center text-[#0056b3] font-medium text-sm group-hover:underline mt-auto pt-4 border-t border-gray-50">
              Програми підвищення кваліфікації <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>

          <Link to="/retraining" className="group flex flex-col justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all h-full">
            <div>
              <div className="w-12 h-12 bg-[#e6f0fa] rounded-xl flex items-center justify-center text-[#003366] mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Змінити професію</h3>
              <p className="text-gray-600 text-sm mb-6">
                Магістратура та програми перепідготовки. Отримайте нову спеціальність на базі вищої освіти.
              </p>
            </div>
            <div className="flex items-center text-[#003366] font-medium text-sm group-hover:underline mt-auto pt-4 border-t border-gray-50">
              Спеціальності та вимоги <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>

          <Link to="/pre-university" className="group flex flex-col justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all h-full">
            <div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#e65c00] mb-5 group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Вступити до ВНЗ</h3>
              <p className="text-gray-600 text-sm mb-6">
                Ефективна підготовка до складання НМТ, ЄВІ, ЄФВВ. Заняття з провідними викладачами ДНУ.
              </p>
            </div>
            <div className="flex items-center text-[#e65c00] font-medium text-sm group-hover:underline mt-auto pt-4 border-t border-gray-50">
              Підготовчі курси <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>

          <div className="bg-[#003366] rounded-2xl p-6 shadow-lg text-white group relative overflow-hidden flex flex-col justify-center items-center text-center h-full">
            <div className="absolute inset-0 bg-[#0056b3] opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
            <div className="relative z-10">
              <Presentation className="h-10 w-10 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-4">Не знаєте, що обрати?</h3>
              <p className="text-white/80 text-sm mb-6">Отримайте безкоштовну консультацію від наших фахівців.</p>
              <Link to="/contacts" className="inline-block bg-white text-[#003366] px-6 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-colors w-full">
                Консультація
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20 border-y border-gray-200 mb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {homeData?.quality_section_title || (<>Якісна освіта <br />з гарантією результату</>)}
              </h2>
              <p className="text-lg text-gray-600">
                {homeData?.quality_section_description || 'Центр є офіційним структурним підрозділом Дніпровського національного університету імені Олеся Гончара. Ми забезпечуємо високі стандарти навчання та надаємо документи державного зразка.'}
              </p>
              <ul className="space-y-3 pt-4">
                {(homeData?.quality_bullets?.length
                  ? homeData.quality_bullets.map((b) => b.text)
                  : [
                      'Понад 50 активних програм щорічно',
                      'Документи про освіту державного зразка',
                      'Гнучкий графік навчання (онлайн/офлайн)',
                      'Викладачі-практики та професори ДНУ',
                    ]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                    <span className="text-gray-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-4xl font-extrabold text-[#0056b3] mb-2">{homeData?.stats_graduates || 1000}+</div>
                <div className="text-gray-600 text-sm font-medium">Слухачів щороку</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-4xl font-extrabold text-[#0056b3] mb-2">{homeData?.stats_years || 25}+</div>
                <div className="text-gray-600 text-sm font-medium">Років досвіду</div>
              </div>
              <div className="bg-[#0056b3] p-6 rounded-2xl shadow-md text-white text-center border border-[#003366]">
                <div className="text-4xl font-extrabold mb-2">{homeData?.stats_programs || 50}+</div>
                <div className="text-white/80 text-sm font-medium">Освітніх програм</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-4xl font-extrabold text-[#0056b3] mb-2">100%</div>
                <div className="text-gray-600 text-sm font-medium">Ліцензовано</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="container mx-auto px-4 md:px-6 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Популярні програми</h2>
            <p className="text-gray-600 mt-1">Найбільш обирані слухачами цього сезону</p>
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

      {/* Announcements / Deadlines */}
      <section className="container mx-auto px-4 md:px-6 mb-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Актуально
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Набір та Дедлайни</h2>
          </div>
          <Link to="/programs" className="hidden md:inline-flex items-center text-[#0056b3] font-semibold hover:text-[#003366]">
            Всі програми <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-blue-600 mb-3 bg-blue-50 w-max px-3 py-1 rounded-md text-sm font-bold">
                <Calendar className="h-4 w-4" />
                до 15 Травня
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Реєстрація на курси підготовки до НМТ</h3>
              <p className="text-gray-600 text-sm mb-4">
                Інтенсивний курс підготовки з математики, укр. мови та історії. Офлайн та онлайн формати.
              </p>
              <Link to="/pre-university" className="text-[#0056b3] font-medium text-sm group-hover:underline flex items-center">
                Деталі та реєстрація <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-300 group-hover:bg-[#0056b3] transition-colors"></div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-600 mb-3 bg-gray-100 w-max px-3 py-1 rounded-md text-sm font-bold">
                <Calendar className="h-4 w-4" />
                набір відкрито
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Підвищення кваліфікації психологів</h3>
              <p className="text-gray-600 text-sm mb-4">
                Нова програма «Кризове консультування». Обсяг: 180 год. (6 кредитів ЄКТС).
              </p>
              <Link to="/programs/q1" className="text-[#0056b3] font-medium text-sm group-hover:underline flex items-center">
                Деталі програми <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-300 group-hover:bg-[#0056b3] transition-colors"></div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-gray-600 mb-3 bg-gray-100 w-max px-3 py-1 rounded-md text-sm font-bold">
                <BookOpen className="h-4 w-4" />
                вступ 2026
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Набір на магістратуру та перепідготовку</h3>
              <p className="text-gray-600 text-sm mb-4">
                Прийом документів з 1 липня. Спеціальності: Психологія, Право, Менеджмент, Публічне управління.
              </p>
              <Link to="/retraining" className="text-[#0056b3] font-medium text-sm group-hover:underline flex items-center">
                Умови вступу <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link to="/programs" className="inline-flex items-center text-[#0056b3] font-semibold">
            Всі програми <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#003366] text-white py-16 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-4">
            {homeData?.bottom_cta_title || 'Готові розпочати навчання?'}
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            {homeData?.bottom_cta_description || "Залиште заявку — наш менеджер зв'яжеться з вами протягом одного робочого дня."}
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
