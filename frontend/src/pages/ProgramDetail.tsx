import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePrograms } from '../context/ProgramsContext';
import {
  Clock, Users, Award, Monitor, MapPin, SlidersHorizontal,
  CheckCircle2, ChevronDown, ChevronUp, ChevronRight,
  Calendar, Share2, Copy, ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';

const FORMAT_LABEL: Record<string, string> = {
  online: 'Онлайн',
  offline: 'Офлайн',
  mixed: 'Змішаний формат',
};

const FORMAT_ICON: Record<string, React.ReactNode> = {
  online: <Monitor className="w-4 h-4" />,
  offline: <MapPin className="w-4 h-4" />,
  mixed: <SlidersHorizontal className="w-4 h-4" />,
};

const CATEGORY_LABEL: Record<string, string> = {
  qualification: 'Підвищення кваліфікації',
  retraining: 'Перепідготовка',
  master: 'Магістратура',
  'pre-university': 'НМТ-підготовка',
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </div>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function ProgramDetail() {
  const { programs } = usePrograms();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const program = programs.find((p) => p.id === id);
  const [copied, setCopied] = useState(false);

  if (!program) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-xl font-bold text-gray-700 mb-4">Програму не знайдено</p>
        <Link to="/programs" className="text-dnu-blue hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> До каталогу програм
        </Link>
      </div>
    );
  }

  const related = programs
    .filter((p) => p.id !== program.id && p.category === program.category)
    .slice(0, 3);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startDateFormatted = program.startDate
    ? new Date(program.startDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Уточнюйте';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-dnu-blue transition-colors">Головна</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/programs" className="hover:text-dnu-blue transition-colors">Програми</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium line-clamp-1">{program.title}</span>
          </nav>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-semibold bg-dnu-light text-dnu-dark px-3 py-1 rounded-full">
              {CATEGORY_LABEL[program.category]}
            </span>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1.5">
              {FORMAT_ICON[program.format]} {FORMAT_LABEL[program.format]}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            {program.title}
          </h1>

          <div className="flex flex-wrap gap-5 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-dnu-blue" /><strong>Тривалість:</strong>&nbsp;{program.duration}</span>
            {program.certificate && <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-dnu-blue" /><strong>Документ:</strong>&nbsp;{program.certificate}</span>}
            {program.targetAudience && <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-dnu-blue" /><strong>Для:</strong>&nbsp;{program.targetAudience}</span>}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* Left: Main content */}
          <div className="space-y-8">

            {/* About */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Про програму</h2>
              <p className="text-gray-600 leading-relaxed">{program.description}</p>
            </div>

            {/* Outcomes */}
            {program.outcomes && program.outcomes.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Чому ви навчитесь</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {program.outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modules */}
            {program.modules && program.modules.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Структура програми</h2>
                <div className="divide-y divide-gray-100">
                  {program.modules.map((mod, i) => (
                    <div key={i} className="flex items-center justify-between py-3.5">
                      <span className="text-sm text-gray-800">
                        <span className="font-semibold text-gray-500 mr-2">Модуль {i + 1}.</span>
                        {mod.title}
                      </span>
                      <span className="text-sm text-gray-500 font-medium shrink-0 ml-4">{mod.hours} год.</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-sm font-bold text-gray-900">Загалом:</span>
                    <span className="text-sm font-bold text-dnu-dark">
                      {program.modules.reduce((sum, m) => sum + m.hours, 0)} год.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ */}
            {program.faq && program.faq.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Часті запитання</h2>
                <div className="space-y-3">
                  {program.faq.map((item, i) => (
                    <div key={i}>
                      <FaqItem q={item.q} a={item.a} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-5">
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Поділитися програмою:
              </p>
              <div className="flex gap-2 flex-wrap">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(program.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  TG
                </a>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-dnu-blue hover:bg-dnu-light transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Скопійовано!' : 'Копіювати посилання'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Sticky enrollment card */}
          <aside className="sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-dnu-dark text-white text-center py-5 px-6">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Вартість навчання</p>
                <p className="text-3xl font-extrabold">{program.price || 'Безкоштовно'}</p>
                {program.category === 'qualification' && (
                  <p className="text-xs text-gray-400 mt-1">або бюджетне місце (безкоштовно)</p>
                )}
              </div>

              <div className="p-5 space-y-3">
                {[
                  { icon: <Clock className="w-4 h-4" />, label: 'Тривалість', val: program.duration },
                  { icon: FORMAT_ICON[program.format], label: 'Формат', val: FORMAT_LABEL[program.format] },
                  { icon: <Calendar className="w-4 h-4" />, label: 'Початок набору', val: startDateFormatted },
                  ...(program.groupSize ? [{ icon: <Users className="w-4 h-4" />, label: 'Розмір групи', val: `до ${program.groupSize} осіб` }] : []),
                  ...(program.certificate ? [{ icon: <Award className="w-4 h-4" />, label: 'Документ', val: program.certificate }] : []),
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-dnu-light rounded-lg flex items-center justify-center text-dnu-blue shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-semibold text-gray-900">{val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-5 space-y-3">
                <Link
                  to={`/apply?program=${program.id}`}
                  className="block w-full text-center bg-dnu-blue text-white font-bold py-3 rounded-xl hover:bg-dnu-dark transition-colors shadow-sm"
                >
                  Записатись на програму
                </Link>
                <Link
                  to="/contacts"
                  className="block w-full text-center border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:border-dnu-blue hover:text-dnu-blue transition-colors text-sm"
                >
                  Безкоштовна консультація
                </Link>
                {program.groupSize && (
                  <p className="text-center text-xs text-orange-600 font-medium">
                    Залишилось обмежена кількість місць
                  </p>
                )}
              </div>
            </div>

            <Link
              to="/programs"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-dnu-blue transition-colors px-1"
            >
              <ArrowLeft className="w-4 h-4" /> Назад до каталогу
            </Link>
          </aside>
        </div>

        {/* Related Programs */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Схожі програми</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/programs/${p.id}`}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-dnu-blue/40 hover:shadow-md transition-all group"
                >
                  <span className="text-xs bg-dnu-light text-dnu-dark px-2 py-0.5 rounded-full font-medium mb-3 inline-block">
                    {CATEGORY_LABEL[p.category]}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-dnu-blue transition-colors leading-snug">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.duration} · {FORMAT_LABEL[p.format]}</p>
                  <p className="text-sm font-bold text-dnu-dark mt-2">{p.price || 'Безкоштовно'}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
