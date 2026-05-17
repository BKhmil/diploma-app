import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowRight, Building2, GraduationCap, TrendingUp } from 'lucide-react';
import { getAlumniPage, getGraduates } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

const stats = [
  { value: '50 000+', label: 'Всього випускників' },
  { value: '2 500+', label: 'Щорічно' },
  { value: '98%', label: 'Задоволені навчанням' },
  { value: '87%', label: 'Підвищили кар\'єру' },
];

const defaultHero = {
  badge: 'Більше 50 000 випускників з 1995 року',
  title: 'Наші випускники по всій Україні та за кордоном',
  subtitle: "Дізнайтесь, як навчання в ЦНО ДНУ змінило кар'єру і життя наших слухачів.",
};

const defaultCta = {
  title: 'Станьте нашим випускником',
  description: 'Приєднайтесь до спільноти 50 000+ фахівців, що обрали ЦНО ДНУ для свого розвитку.',
};

const testimonials = [
  {
    id: 1,
    name: 'Андрій Коваленко',
    program: 'Педагогічна майстерність',
    year: '2024',
    photo: 'https://i.pravatar.cc/200?img=12',
    text: 'Курс «Педагогічна майстерність» дав мені нові інструменти роботи з дітьми. Дуже практичний, без зайвої теорії.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Марія Сидоренко',
    program: 'НМТ Математика',
    year: '2024',
    photo: 'https://i.pravatar.cc/200?img=44',
    text: 'Підготувалась до НМТ на 187 балів! Викладач пояснив теми, з якими не могла розібратись два роки.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Руслан Бондаренко',
    program: 'Менеджмент організацій (магістр)',
    year: '2023',
    photo: 'https://i.pravatar.cc/200?img=15',
    text: 'Після здобуття диплома магістра з менеджменту мене підвищили до керівника відділу. Диплом ДНУ — це авторитет.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Ірина Мороз',
    program: 'Інклюзивна освіта',
    year: '2024',
    photo: 'https://i.pravatar.cc/200?img=30',
    text: 'Курс допоміг зрозуміти специфіку роботи з дітьми з особливими потребами. Рекомендую всім педагогам.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Василь Ткаченко',
    program: 'Охорона праці в освіті',
    year: '2024',
    photo: 'https://i.pravatar.cc/200?img=68',
    text: 'Отримав сертифікат вчасно до атестації. Навчання онлайн — зручно, без відриву від роботи.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Наталія Захаренко',
    program: 'Право (перепідготовка)',
    year: '2023',
    photo: 'https://i.pravatar.cc/200?img=9',
    text: 'Якісна юридична освіта за доступну ціну. Тепер працюю юристом у приватній фірмі.',
    rating: 5,
    current: 'юрист, приватна фірма',
    isFeatured: false,
  },
];

const featuredTestimonial = {
  name: 'Олена Петренко',
  program: 'Психологія (перепідготовка)',
  year: '2023',
  photo: 'https://i.pravatar.cc/200?img=47',
  text: 'Навчання в ЦНО ДНУ повністю змінило мій кар\'єрний шлях. Після отримання диплома магістра з психології я відкрила власну практику. Викладачі — справжні професіонали, які поєднують теорію з практикою.',
  current: 'психолог, приватна практика, м. Дніпро',
  rating: 5,
  isFeatured: true,
};

const employment = [
  { iconKey: 'education', pct: '62%', label: 'Заклади освіти', sub: 'школи, ЗВО, ліцеї' },
  { iconKey: 'business', pct: '25%', label: 'Підприємства та бізнес', sub: 'після перепідготовки' },
  { iconKey: 'government', pct: '13%', label: 'Держструктури', sub: 'та громадські організації' },
];

const defaultEmploymentSection = {
  title: 'Де працюють наші випускники',
  subtitle: 'Карта працевлаштування',
};

const achievements = [
  {
    iconKey: 'programs',
    title: '120+ програм',
    description: 'Від короткострокових курсів до магістерських програм',
  },
  {
    iconKey: 'budget',
    title: '90% бюджет',
    description: 'Наших НМТ-випускників вступають на бюджетну форму',
  },
  {
    iconKey: 'partners',
    title: '200+ партнерів',
    description: 'Роботодавці та організації співпрацюють з центром',
  },
];

const defaultAchievementsSectionTitle = 'Наші досягнення';

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
  const [alumniItems, setAlumniItems] = useState([featuredTestimonial, ...testimonials]);
  const [hero, setHero] = useState(defaultHero);
  const [heroStats, setHeroStats] = useState(stats);
  const [cta, setCta] = useState(defaultCta);
  const [employmentSection, setEmploymentSection] = useState(defaultEmploymentSection);
  const [employmentItems, setEmploymentItems] = useState(employment);
  const [achievementsTitle, setAchievementsTitle] = useState(defaultAchievementsSectionTitle);
  const [achievementItems, setAchievementItems] = useState(achievements);
  const featured = alumniItems.find((item: any) => item.isFeatured) || alumniItems[0] || null;
  const testimonialsList = featured
    ? alumniItems.filter((item: any) => String(item.id) !== String((featured as any).id))
    : alumniItems;
  const visibleTestimonials = showAll ? testimonialsList : testimonialsList.slice(0, 3);

  React.useEffect(() => {
    getAlumniPage(locale)
      .then((page) => {
        if (!page) return;
        setHero({
          badge: page.hero_badge_text || defaultHero.badge,
          title: page.hero_title || defaultHero.title,
          subtitle: page.hero_subtitle || defaultHero.subtitle,
        });
        setCta({
          title: page.cta_title || defaultCta.title,
          description: page.cta_description || defaultCta.description,
        });

        setEmploymentSection({
          title: page.employment_section_title || defaultEmploymentSection.title,
          subtitle: page.employment_section_subtitle || defaultEmploymentSection.subtitle,
        });

        if (Array.isArray(page.employment_items) && page.employment_items.length) {
          const normalizedEmployment = page.employment_items
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((item) => ({
              iconKey: item.icon_key || 'education',
              pct: item.value || '',
              label: item.label || '',
              sub: item.sub || '',
            }))
            .filter((item) => item.pct && item.label);

          if (normalizedEmployment.length) {
            setEmploymentItems(normalizedEmployment);
          }
        }

        setAchievementsTitle(page.achievements_section_title || defaultAchievementsSectionTitle);

        if (Array.isArray(page.achievement_items) && page.achievement_items.length) {
          const normalizedAchievements = page.achievement_items
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((item) => ({
              iconKey: item.icon_key || 'programs',
              title: item.title || '',
              description: item.description || '',
            }))
            .filter((item) => item.title);

          if (normalizedAchievements.length) {
            setAchievementItems(normalizedAchievements);
          }
        }

        if (Array.isArray(page.hero_stats) && page.hero_stats.length) {
          const normalized = page.hero_stats
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((item) => ({
              value: item.value || '',
              label: item.label || '',
            }))
            .filter((item) => item.value && item.label);

          if (normalized.length) {
            setHeroStats(normalized);
          }
        }
      })
      .catch(() => undefined);

    getGraduates(locale)
      .then((items) => {
        if (!items.length) return;
        const mapped = items.map((item, idx) => ({
          id: Number(item.id ?? idx + 1),
          name: item.name || 'Випускник',
          program: item.program || item.position || 'Програма ЦНО',
          year: item.year || '2026',
          photo: item.photo?.url ? item.photo.url : 'https://i.pravatar.cc/200?img=30',
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
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            {hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            {hero.title}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Stats */}
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

      <div className="container mx-auto px-4 md:px-6 py-16 space-y-20">

        {/* Featured testimonial */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Відгуки випускників</h2>
          <p className="text-gray-600 mb-8">Що кажуть ті, хто вже пройшов навчання</p>

          {featured && (
            <div className="bg-white border-2 border-dnu-blue/20 rounded-3xl p-8 mb-8 flex flex-col sm:flex-row gap-8 items-start shadow-sm hover:shadow-md transition-shadow">
              <div className="shrink-0 text-center sm:w-32">
                <img
                  src={(featured as any).photo}
                  alt={(featured as any).name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                  <div className="font-bold text-gray-900 text-sm leading-tight">{(featured as any).name}</div>
                  <div className="text-xs text-dnu-blue mt-1">{(featured as any).program}</div>
                  <div className="text-xs text-gray-400">Випуск {(featured as any).year}</div>
              </div>
              <div className="flex-1">
                <Quote className="w-8 h-8 text-dnu-light mb-3" />
                <p className="text-lg text-gray-700 italic leading-relaxed mb-4">
                  {(featured as any).text}
                </p>
                <StarRating count={(featured as any).rating} />
                <p className="text-sm text-gray-500 mt-3">
                  <span className="font-semibold">Зараз:</span> {(featured as any).current}
                </p>
              </div>
            </div>
          )}

          {/* Testimonials grid */}
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

        {/* Where graduates work */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{employmentSection.title}</h2>
          <p className="text-gray-600 mb-10">{employmentSection.subtitle}</p>
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

        {/* Achievement highlights */}
        <section className="bg-dnu-light rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{achievementsTitle}</h2>
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
      </div>

      {/* CTA */}
      <section className="bg-dnu-dark text-white py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-4">{cta.title}</h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
            {cta.description}
          </p>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 bg-white text-dnu-dark font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Обрати програму <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
