import React, { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPreUniversityGroups, getPreUniversityPage } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

const subjects = [
  { id: 'math', icon: '📐', title: 'Математика', desc: 'Алгебра, геометрія, елементи аналізу. Поглиблений курс.', price: 'від 2 800 грн', popular: true },
  { id: 'ukr', icon: '📖', title: 'Українська мова', desc: 'Орфографія, синтаксис, текст. Підготовка до завдань тесту.', price: 'від 2 500 грн', popular: true },
  { id: 'chem', icon: '🧪', title: 'Хімія', desc: 'Неорганічна та органічна хімія. Задачі та теорія.', price: 'від 2 500 грн' },
  { id: 'bio', icon: '🔬', title: 'Біологія', desc: 'Ботаніка, зоологія, анатомія людини, генетика.', price: 'від 2 500 грн' },
  { id: 'phys', icon: '⚛️', title: 'Фізика', desc: 'Механіка, електрика, термодинаміка, оптика.', price: 'від 2 500 грн' },
  { id: 'geo', icon: '🌍', title: 'Географія', desc: 'Фізична і соціальна географія України та світу.', price: 'від 2 200 грн' },
  { id: 'hist', icon: '🏛', title: 'Історія України', desc: 'Від давніх часів до сьогодення. Аналіз документів.', price: 'від 2 200 грн' },
  { id: 'eng', icon: '🌐', title: 'Англійська мова', desc: 'Граматика, читання, говоріння. Рівень B1–B2.', price: 'від 3 000 грн' },
];

const schedule = [
  { time: '09:00–11:00', mon: 'Математика', tue: '', wed: 'Математика', thu: '', fri: 'Математика' },
  { time: '11:00–13:00', mon: '', tue: 'Укр. мова', wed: '', thu: 'Укр. мова', fri: '' },
  { time: '15:00–17:00', mon: 'Фізика', tue: 'Хімія', wed: '', thu: 'Фізика', fri: 'Хімія' },
  { time: '18:00–20:00', mon: 'Англ. мова', tue: '', wed: 'Англ. мова', thu: '', fri: '' },
];

const weekDays = ['Час', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

const STEPS = [
  { n: 1, title: 'Записуєтесь', desc: 'Заповнюєте заявку на сайті або телефонуєте до центру' },
  { n: 2, title: 'Пробне заняття', desc: 'Перше заняття безкоштовне — переконайтесь особисто' },
  { n: 3, title: 'Складаєте НМТ', desc: 'Маєте знання та впевненість для успішного результату' },
];

// Countdown to NMT exam date (approximate)
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

export default function PreUniversity() {
  const { locale } = useLanguage();
  const [pageData, setPageData] = useState<null | {
    hero_title?: string;
    hero_subtitle?: string;
    nmt_exam_date?: string;
    bundle_title?: string;
    bundle_description?: string;
    steps?: { n: number; title: string; description: string; order: number }[];
  }>(null);
  const nmtDate = pageData?.nmt_exam_date ? new Date(pageData.nmt_exam_date + 'T09:00:00') : NMT_DATE;
  const { days, hours, minutes } = useCountdown(nmtDate);
  const [subjectsList, setSubjectsList] = useState(subjects);

  useEffect(() => {
    getPreUniversityPage(locale).then(setPageData).catch(() => undefined);
  }, [locale]);

  useEffect(() => {
    getPreUniversityGroups(locale)
      .then((items) => {
        if (!items.length) return;
        setSubjectsList(
          items.map((item, idx) => ({
            id: String(item.subject_key ?? item.id ?? idx + 1),
            icon: item.icon_emoji || '📘',
            title: item.name || item.subject || 'Підготовча група',
            desc: item.description || item.schedule || 'Підготовча програма до НМТ.',
            price: item.price_hint || 'за запитом',
            popular: item.is_popular ?? idx < 2,
          }))
        );
      })
      .catch(() => undefined);
  }, [locale]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-[#002f5e] to-[#0056b3] text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
            Підготовчі курси ДНУ · Набір відкрито
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            {pageData?.hero_title || (<>Підготовка до НМТ 2026<br />разом з ДНУ</>)}
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {pageData?.hero_subtitle || 'Досвідчені викладачі університету. Малі групи. Гарантований результат.'}
          </p>
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
            <div className="text-sm text-white/70 ml-2 max-w-28 leading-snug text-left">
              до початку НМТ 2026
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: <Users className="w-6 h-6" />, title: 'Досвідчені викладачі', desc: 'Заняття проводять викладачі ДНУ, які мають багаторічний досвід підготовки до ЗНО/НМТ.' },
            { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Актуальна програма', desc: 'Навчальні матеріали повністю відповідають чинним програмам НМТ 2026 року.' },
            { icon: <ArrowRight className="w-6 h-6" />, title: 'Високі результати', desc: '90% наших слухачів вступають на бюджетну форму навчання.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-blue-50/50 border border-blue-100 p-8 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#0056b3] mb-4">
                {icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        {/* Subject cards */}
        <div id="subjects" className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Предмети підготовки</h2>
          <p className="text-gray-600 mb-8">Обирайте один або кілька предметів — діє знижка на комплект</p>
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
                  <Clock className="w-3.5 h-3.5" /> 3 міс.
                  <Users className="w-3.5 h-3.5 ml-2" /> до 8 осіб
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

          {/* Bundle promo */}
          <div className="mt-8 p-6 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <div className="font-bold text-gray-900">🎯 Комплект «Математика + Українська мова»</div>
              <div className="text-sm text-gray-600 mt-1">Найпопулярніша комбінація. Економія 800 грн при записі разом.</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm text-gray-400 line-through">5 300 грн</div>
              <div className="text-2xl font-extrabold text-[#0056b3]">4 500 грн</div>
              <Link
                to="/apply?bundle=math-ukr"
                className="mt-2 inline-block bg-[#0056b3] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#003366] transition-colors shadow-md"
              >
                Обрати комплект
              </Link>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div id="schedule" className="mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Розклад занять</h2>
          <p className="text-gray-600 mb-8">Весняний семестр · Заняття проводяться в корпусі ДНУ та онлайн</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  {weekDays.map((d) => (
                    <th key={d} className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, i) => (
                  <tr key={row.time} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-bold text-gray-500 text-xs whitespace-nowrap">{row.time}</td>
                    {[row.mon, row.tue, row.wed, row.thu, row.fri].map((cell, ci) => (
                      <td key={ci} className="px-4 py-3">
                        {cell && (
                          <span className="inline-block bg-dnu-light text-[#0056b3] text-xs font-semibold px-2.5 py-1 rounded-lg">
                            {cell}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Розклад може змінюватись. Актуальний розклад надається після запису.</p>
        </div>

        {/* Organisation info */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Як проходить навчання</h2>
            <div className="grid grid-cols-3 gap-4">
              {(pageData?.steps?.length
                ? [...pageData.steps].sort((a, b) => a.order - b.order)
                : STEPS.map((s) => ({ n: s.n, title: s.title, description: s.desc, order: s.n }))
              ).map(({ n, title, description }) => (
                <div key={n} className="text-center p-5 border border-gray-200 rounded-2xl">
                  <div className="text-4xl font-black text-gray-200 mb-3">{n}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Організація навчання</h2>
            <ul className="space-y-6">
              <li className="flex items-start">
                <Calendar className="w-6 h-6 text-[#0056b3] mr-4 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">Тривалість курсів</h4>
                  <p className="text-gray-600">3 місяці (інтенсив) або 5 місяців (стандарт)</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="w-6 h-6 text-[#0056b3] mr-4 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">Графік занять</h4>
                  <p className="text-gray-600">Ранкові, денні або вечірні групи на вибір</p>
                </div>
              </li>
              <li className="flex items-start">
                <Users className="w-6 h-6 text-[#0056b3] mr-4 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">Формат</h4>
                  <p className="text-gray-600">Офлайн в аудиторіях університету або онлайн через Zoom</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Вартість одного предмета:</span>
                <span className="text-2xl font-bold text-[#0056b3]">від 800 грн/міс</span>
              </div>
              <Link to="/apply" className="block w-full text-center bg-[#0056b3] text-white py-3 rounded-xl font-bold hover:bg-[#003366] transition-colors shadow-md">
                Записатися безкоштовно →
              </Link>
              <p className="text-center text-xs text-gray-400 mt-2">Перше заняття — пробне, без оплати</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
