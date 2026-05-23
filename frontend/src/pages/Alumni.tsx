import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowRight, Building2, GraduationCap, TrendingUp } from 'lucide-react';
import { getAlumniPage, getGraduates } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

const STRAPI_BASE = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');

const employmentIconMap: Record<string, string> = {
  education: '🏫',
  business: '🏢',
  government: '🏛',
};

const achievementIconMap: Record<string, React.ReactNode> = {
  programs: <GraduationCap className="w-8 h-8 text-dnu-blue" />,
  budget: <TrendingUp className="w-8 h-8 text-dnu-blue" />,
  partners: <Building2 className="w-8 h-8 text-dnu-blue" />,
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default function Alumni() {
  const { locale } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  const [alumniItems, setAlumniItems] = useState<{
    id: number; name: string; program: string; year: string;
    photo: string; text: string; rating: number; current: string; isFeatured: boolean;
  }[]>([]);
  const [hero, setHero] = useState<{ badge: string; title: string; subtitle: string }>({ badge: '', title: '', subtitle: '' });
  const [heroStats, setHeroStats] = useState<{ value: string; label: string }[]>([]);
  const [cta, setCta] = useState<{ title: string; description: string }>({ title: '', description: '' });
  const [employmentSection, setEmploymentSection] = useState<{ title: string; subtitle: string }>({ title: '', subtitle: '' });
  const [employmentItems, setEmploymentItems] = useState<{ iconKey: string; pct: string; label: string; sub: string }[]>([]);
  const [achievementsTitle, setAchievementsTitle] = useState('');
  const [achievementItems, setAchievementItems] = useState<{ iconKey: string; title: string; description: string }[]>([]);
  const [testimonialsSection, setTestimonialsSection] = useState<{ title: string; subtitle: string }>({ title: '', subtitle: '' });
  const [graduateYearTemplate, setGraduateYearTemplate] = useState('Випуск {year}');
  const [currentPositionLabel, setCurrentPositionLabel] = useState('Зараз:');

  const featured = alumniItems.find((item) => item.isFeatured) || null;
  const testimonialsList = featured
    ? alumniItems.filter((item) => String(item.id) !== String((featured as any).id))
    : alumniItems;
  const visibleTestimonials = showAll ? testimonialsList : testimonialsList.slice(0, 3);

  React.useEffect(() => {
    getAlumniPage(locale)
      .then((page: any) => {
        if (!page) return;
        setHero({
          badge: page.hero_badge_text || '',
          title: page.hero_title || '',
          subtitle: page.hero_subtitle || '',
        });
        setCta({
          title: page.cta_title || '',
          description: page.cta_description || '',
        });
        setEmploymentSection({
          title: page.employment_section_title || '',
          subtitle: page.employment_section_subtitle || '',
        });
        if (Array.isArray(page.employment_items) && page.employment_items.length) {
          setEmploymentItems(
            page.employment_items
              .slice()
              .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
              .map((item: any) => ({
                iconKey: item.icon_key || 'education',
                pct: item.value || '',
                label: item.label || '',
                sub: item.sub || '',
              }))
              .filter((item: any) => item.pct && item.label)
          );
        }
        setAchievementsTitle(page.achievements_section_title || '');
        if (page.testimonials_section_title || page.testimonials_section_subtitle) {
          setTestimonialsSection({
            title: page.testimonials_section_title || '',
            subtitle: page.testimonials_section_subtitle || '',
          });
        }
        if (Array.isArray(page.achievement_items) && page.achievement_items.length) {
          setAchievementItems(
            page.achievement_items
              .slice()
              .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
              .map((item: any) => ({
                iconKey: item.icon_key || 'programs',
                title: item.title || '',
                description: item.description || '',
              }))
              .filter((item: any) => item.title)
          );
        }
        if (Array.isArray(page.hero_stats) && page.hero_stats.length) {
          setHeroStats(
            page.hero_stats
              .slice()
              .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
              .map((item: any) => ({ value: item.value || '', label: item.label || '' }))
              .filter((item: any) => item.value && item.label)
          );
        }
        if (page.graduate_year_template) setGraduateYearTemplate(page.graduate_year_template);
        if (page.current_position_label) setCurrentPositionLabel(page.current_position_label);
      })
      .catch(() => undefined);

    getGraduates(locale)
      .then((items: any[]) => {
        if (!items.length) return;
        const mapped = items.map((item, idx) => ({
          id: Number(item.id ?? idx + 1),
          name: item.name || '',
          program: item.program || item.position || '',
          year: item.year || '',
          photo: item.photo?.url
            ? (item.photo.url.startsWith('http') ? item.photo.url : `${STRAPI_BASE}${item.photo.url}`)
            : 'https://i.pravatar.cc/200?img=30',
          text: item.story || '',
          rating: item.rating || 5,
          current: item.organization || '',
          isFeatured: !!item.is_featured,
        }));
        setAlumniItems(mapped);
        setShowAll(false);
      })
      .catch(() => undefined);
  }, [locale]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-linear-to-r from-dnu-dark to-dnu-blue text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          {hero.badge && (
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              {hero.badge}
            </span>
          )}
          {hero.title && (
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">{hero.title}</h1>
          )}
          {hero.subtitle && (
            <p className="text-xl opacity-90 max-w-2xl mx-auto">{hero.subtitle}</p>
          )}
        </div>
      </section>

      {/* Stats */}
      {heroStats.length > 0 && (
        <section className="bg-dnu-light border-b border-gray-100">
          <div className="container mx-auto px-4 md:px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {heroStats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-dnu-dark">{value}</div>
                  <div className="text-sm text-gray-600 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 md:px-6 py-16 space-y-20">

        {/* Featured testimonial + grid */}
        {(alumniItems.length > 0 || testimonialsSection.title) && (
          <section>
            {testimonialsSection.title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{testimonialsSection.title}</h2>
            )}
            {testimonialsSection.subtitle && (
              <p className="text-gray-600 mb-8">{testimonialsSection.subtitle}</p>
            )}

            {featured && (
              <div className="bg-white border-2 border-dnu-blue/20 rounded-3xl p-8 mb-8 flex flex-col sm:flex-row gap-8 items-start shadow-sm hover:shadow-md transition-shadow">
                <div className="shrink-0 text-center sm:w-32">
                  <img
                    src={featured.photo}
                    alt={featured.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="font-bold text-gray-900 text-sm leading-tight">{featured.name}</div>
                  <div className="text-xs text-dnu-blue mt-1">{featured.program}</div>
                  <div className="text-xs text-gray-400">{graduateYearTemplate.replace('{year}', featured.year)}</div>
                </div>
                <div className="flex-1">
                  <Quote className="w-8 h-8 text-dnu-light mb-3" />
                  <p className="text-lg text-gray-700 italic leading-relaxed mb-4">{featured.text}</p>
                  <StarRating count={featured.rating} />
                  {featured.current && (
                    <p className="text-sm text-gray-500 mt-3">
                      <span className="font-semibold">{currentPositionLabel}</span> {featured.current}
                    </p>
                  )}
                </div>
              </div>
            )}

            {visibleTestimonials.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleTestimonials.map((t) => (
                  <div key={t.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={t.photo}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                        <div className="text-xs text-dnu-blue">{t.program}, {t.year}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed mb-3">"{t.text}"</p>
                    <StarRating count={t.rating} />
                  </div>
                ))}
              </div>
            )}

            {!showAll && testimonialsList.length > 3 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:border-dnu-blue hover:text-dnu-blue transition-colors"
                >
                  Всі відгуки ({testimonialsList.length})
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Where graduates work */}
        {employmentItems.length > 0 && (
          <section>
            {employmentSection.title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{employmentSection.title}</h2>
            )}
            {employmentSection.subtitle && (
              <p className="text-gray-600 mb-10">{employmentSection.subtitle}</p>
            )}
            <div className="grid sm:grid-cols-3 gap-6">
              {employmentItems.map(({ iconKey, pct, label, sub }) => (
                <div key={label} className="bg-gray-50 border border-gray-200 rounded-2xl p-7 text-center hover:shadow-sm transition-shadow">
                  <div className="text-4xl mb-4">{employmentIconMap[iconKey] || '🏫'}</div>
                  <div className="text-3xl font-extrabold text-dnu-dark mb-1">{pct}</div>
                  <div className="font-semibold text-gray-900 text-sm">{label}</div>
                  <div className="text-xs text-gray-500 mt-1">{sub}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievement highlights */}
        {achievementItems.length > 0 && (
          <section className="bg-dnu-light rounded-3xl p-8 md:p-12">
            {achievementsTitle && (
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{achievementsTitle}</h2>
            )}
            <div className="grid sm:grid-cols-3 gap-6">
              {achievementItems.map(({ iconKey, title, description }) => (
                <div key={title} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {achievementIconMap[iconKey] || achievementIconMap.programs}
                  </div>
                  <div className="font-bold text-gray-900 mb-1">{title}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{description}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA */}
      {(cta.title || cta.description) && (
        <section className="bg-dnu-dark text-white py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            {cta.title && <h2 className="text-3xl font-extrabold mb-4">{cta.title}</h2>}
            {cta.description && (
              <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">{cta.description}</p>
            )}
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 bg-white text-dnu-dark font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Обрати програму <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
