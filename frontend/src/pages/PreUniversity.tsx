import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPreUniversityPage } from '../services/strapi';
import { usePrograms } from '../context/ProgramsContext';
import { formatPrice } from '../types';
import { useLanguage } from '../context/LanguageContext';

const NMT_DATE = new Date('2026-05-28T09:00:00');

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 60_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const weekDayKeys = ['day', 'mon', 'tue', 'wed', 'thu', 'fri'] as const;

export default function PreUniversity() {
  const { locale } = useLanguage();
  const { programs } = usePrograms();
  const [pageData, setPageData] = useState<null | {
    hero_title?: string;
    hero_subtitle?: string;
    hero_badge?: string;
    countdown_label?: string;
    nmt_exam_date?: string;
    subjects_section_title?: string;
    subjects_discount_intro?: string;
    bundle_price_label?: string;
    trial_lesson_text?: string;
    schedule_section_title?: string;
    schedule_section_subtitle?: string;
    schedule_rows?: { day: string; time: string; subject: string; format: string; order: number }[];
    schedule_footnote?: string;
    org_section_title?: string;
    org_items?: { title: string; description: string; icon_key: string; order: number }[];
    advantages?: { title: string; description: string; icon_key: string; order: number }[];
    steps?: { n: number; title: string; description: string; order: number }[];
    card_default_duration?: string;
    card_default_group_size?: string;
  }>(null);

  const nmtDate = pageData?.nmt_exam_date ? new Date(pageData.nmt_exam_date + 'T09:00:00') : NMT_DATE;
  const { days, hours, minutes } = useCountdown(nmtDate);

  // Pre-university subjects are programs filtered by category — single source of truth.
  const subjectsList = useMemo(
    () =>
      programs
        .filter((p) => p.category === 'pre-university')
        .map((p) => ({
          id: p.id,
          icon: p.icon_emoji || '📘',
          title: p.title,
          desc: p.description || '',
          price: p.price_hint || formatPrice(p.price),
          popular: p.is_featured ?? false,
        })),
    [programs]
  );

  useEffect(() => {
    getPreUniversityPage(locale).then(setPageData).catch(() => undefined);
  }, [locale]);

  const advantages = pageData?.advantages?.length
    ? [...pageData.advantages].sort((a, b) => a.order - b.order)
    : [];

  const scheduleRows = pageData?.schedule_rows?.length
    ? [...pageData.schedule_rows].sort((a, b) => a.order - b.order)
    : [];

  const orgItems = pageData?.org_items?.length
    ? [...pageData.org_items].sort((a, b) => a.order - b.order)
    : [];

  const steps = pageData?.steps?.length
    ? [...pageData.steps].sort((a, b) => a.order - b.order)
    : [];

  const orgIconMap: Record<string, React.ReactNode> = {
    calendar: <Calendar className="w-6 h-6 text-[#0056b3]" />,
    clock: <Clock className="w-6 h-6 text-[#0056b3]" />,
    users: <Users className="w-6 h-6 text-[#0056b3]" />,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-[#002f5e] to-[#0056b3] text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          {pageData?.hero_badge && (
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
              {pageData.hero_badge}
            </span>
          )}
          {pageData?.hero_title && (
            <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">{pageData.hero_title}</h1>
          )}
          {pageData?.hero_subtitle && (
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">{pageData.hero_subtitle}</p>
          )}
          <div className="flex gap-4 justify-center flex-wrap mb-10">
            <Link
              to="/apply"
              className="inline-block bg-[#ffcc00] text-[#003366] px-8 py-3 rounded-xl font-bold hover:bg-[#ffe680] transition-colors shadow-lg"
            >
              Записатися зараз →
            </Link>
            <a
              href="#schedule"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
            >
              Розклад занять
            </a>
          </div>

          {/* Countdown */}
          <div className="inline-flex items-center gap-5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl px-8 py-5">
            {[
              { value: days, label: 'Днів' },
              { value: hours, label: 'Год' },
              { value: minutes, label: 'Хв' },
            ].map(({ value, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="text-3xl font-black text-white/40">:</span>}
                <div className="text-center">
                  <div className="text-4xl font-black">{String(value).padStart(2, '0')}</div>
                  <div className="text-xs uppercase tracking-wider text-white/70 mt-1">{label}</div>
                </div>
              </React.Fragment>
            ))}
            {pageData?.countdown_label && (
              <div className="text-sm text-white/70 ml-2 max-w-28 leading-snug text-left">
                {pageData.countdown_label}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Advantages */}
      {advantages.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {advantages.map(({ title, description }) => (
              <div key={title} className="bg-blue-50/50 border border-blue-100 p-8 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#0056b3] mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 md:px-6 pb-16">
        {/* Subject cards */}
        {subjectsList.length > 0 && (
          <div id="subjects" className="mb-16">
            {pageData?.subjects_section_title && (
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{pageData.subjects_section_title}</h2>
            )}
            {pageData?.subjects_discount_intro && (
              <p className="text-gray-600 mb-8">{pageData.subjects_discount_intro}</p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {subjectsList.map((s) => (
                <div
                  key={s.id}
                  className={`bg-white rounded-2xl border-2 p-6 flex flex-col hover:shadow-lg transition-all ${s.popular ? 'border-[#0056b3] shadow-sm' : 'border-gray-200'}`}
                >
                  {s.popular && (
                    <span className="self-start text-xs font-bold bg-dnu-light text-[#0056b3] px-2.5 py-1 rounded-full mb-3">
                      Популярний
                    </span>
                  )}
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 flex-1 leading-relaxed mb-4">{s.desc}</p>
                  <hr className="border-gray-100 mb-4" />
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    {pageData?.card_default_duration && (
                      <><Clock className="w-3.5 h-3.5" /> {pageData.card_default_duration}</>
                    )}
                    {pageData?.card_default_group_size && (
                      <><Users className="w-3.5 h-3.5 ml-2" /> {pageData.card_default_group_size}</>
                    )}
                  </div>
                  <div className="font-bold text-[#0056b3] mb-4">{s.price}</div>
                  <Link
                    to={`/apply?subject=${s.id}`}
                    className="block w-full text-center bg-[#0056b3] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#003366] transition-colors"
                  >
                    Записатися
                  </Link>
                </div>
              ))}
            </div>

            {pageData?.bundle_price_label && (
              <div className="mt-8 p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <div className="font-bold text-gray-900">🎯 {pageData.bundle_price_label}</div>
                  {pageData?.trial_lesson_text && (
                    <div className="text-sm text-gray-600 mt-1">{pageData.trial_lesson_text}</div>
                  )}
                </div>
                <Link
                  to="/apply?bundle=math-ukr"
                  className="mt-2 inline-block bg-[#0056b3] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#003366] transition-colors shadow-md shrink-0"
                >
                  Обрати комплект
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Schedule */}
        {scheduleRows.length > 0 && (
          <div id="schedule" className="mb-16">
            {pageData?.schedule_section_title && (
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{pageData.schedule_section_title}</h2>
            )}
            {pageData?.schedule_section_subtitle && (
              <p className="text-gray-600 mb-8">{pageData.schedule_section_subtitle}</p>
            )}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    {weekDayKeys.map((d) => (
                      <th key={d} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-bold text-gray-500 text-xs whitespace-nowrap">{row.time}</td>
                      <td className="px-4 py-3">{row.day === 'mon' && row.subject && (
                        <span className="inline-block bg-dnu-light text-[#0056b3] text-xs font-semibold px-2.5 py-1 rounded-lg">{row.subject}</span>
                      )}</td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">{row.format && (
                        <span className="text-xs text-gray-400">{row.format}</span>
                      )}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pageData?.schedule_footnote && (
              <p className="text-xs text-gray-400 mt-3">{pageData.schedule_footnote}</p>
            )}
          </div>
        )}

        {/* Organisation info */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {steps.length > 0 && (
            <div>
              {pageData?.org_section_title && (
                <h2 className="text-3xl font-bold mb-6 text-gray-900">{pageData.org_section_title}</h2>
              )}
              <div className="grid grid-cols-3 gap-4">
                {steps.map(({ n, title, description }) => (
                  <div key={n} className="text-center p-5 border border-gray-200 rounded-2xl">
                    <div className="text-4xl font-black text-gray-200 mb-3">{n}</div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">{title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {orgItems.length > 0 && (
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              {pageData?.org_section_title && !steps.length && (
                <h2 className="text-2xl font-bold mb-6 text-gray-900">{pageData.org_section_title}</h2>
              )}
              <ul className="space-y-6">
                {orgItems.map(({ title, description, icon_key }) => (
                  <li key={title} className="flex items-start">
                    <span className="mr-4 shrink-0 mt-0.5">
                      {orgIconMap[icon_key] || <Calendar className="w-6 h-6 text-[#0056b3]" />}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900">{title}</h4>
                      <p className="text-gray-600">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Link to="/apply" className="block w-full text-center bg-[#0056b3] text-white py-3 rounded-xl font-bold hover:bg-[#003366] transition-colors shadow-md">
                  Записатися безкоштовно →
                </Link>
                {pageData?.trial_lesson_text && (
                  <p className="text-center text-xs text-gray-400 mt-2">{pageData.trial_lesson_text}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
