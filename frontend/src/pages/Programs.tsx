import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usePrograms } from '../context/ProgramsContext';
import { Search, SlidersHorizontal, Clock, Monitor, MapPin, LayoutGrid, List, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { Program, formatDuration, formatPrice } from '../types';
import { getProgramsPage } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

type Category = 'all' | 'qualification' | 'retraining' | 'master' | 'pre-university';
type Format = 'all' | 'online' | 'offline' | 'mixed';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'Усі',
  qualification: 'Підвищення кваліф.',
  retraining: 'Перепідготовка',
  master: 'Магістратура',
  'pre-university': 'НМТ-підготовка',
};

const FORMAT_ICON: Record<string, React.ReactNode> = {
  online: <Monitor className="w-3.5 h-3.5" />,
  offline: <MapPin className="w-3.5 h-3.5" />,
  mixed: <SlidersHorizontal className="w-3.5 h-3.5" />,
};

const FORMAT_LABEL: Record<string, string> = {
  online: 'Онлайн',
  offline: 'Офлайн',
  mixed: 'Змішаний',
};

const FORMAT_COLOR: Record<string, string> = {
  online: 'bg-green-50 text-green-700 border-green-200',
  offline: 'bg-blue-50 text-blue-700 border-blue-200',
  mixed: 'bg-purple-50 text-purple-700 border-purple-200',
};

function ProgramCardGrid({ program }: { program: Program }) {
  return (
    <Link
      to={`/programs/${program.id}`}
      className="flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-dnu-blue/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      <div className="flex justify-between items-center px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold">
        <span className={clsx('px-2.5 py-1 rounded-md border flex items-center gap-1.5', FORMAT_COLOR[program.format])}>
          {FORMAT_ICON[program.format]} {FORMAT_LABEL[program.format]}
        </span>
        <span className="text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-md">
          {CATEGORY_LABELS[program.category]}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug group-hover:text-dnu-blue transition-colors line-clamp-2">
          {program.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">{program.description}</p>
        <div className="flex gap-3 text-xs text-gray-500 mt-auto pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(program.duration, program.duration_unit)}</span>
          {program.certificate && <span className="truncate">{program.certificate}</span>}
        </div>
      </div>
      <div className="px-5 pb-5 flex items-center justify-between">
        <span className="font-bold text-dnu-dark text-base">{formatPrice(program.price)}</span>
        <span className="text-xs text-dnu-blue font-semibold flex items-center gap-1 group-hover:underline">
          Детальніше <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

function ProgramCardList({ program }: { program: Program }) {
  return (
    <Link
      to={`/programs/${program.id}`}
      className="flex items-center gap-5 bg-white rounded-xl border border-gray-200 hover:border-dnu-blue/40 hover:shadow-md transition-all px-5 py-4 group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 mb-1.5">
          <span className={clsx('text-xs px-2 py-0.5 rounded-full border flex items-center gap-1', FORMAT_COLOR[program.format])}>
            {FORMAT_ICON[program.format]} {FORMAT_LABEL[program.format]}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[program.category]}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-dnu-blue transition-colors mb-1 leading-tight">{program.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-1">{program.targetAudience}</p>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
        <span className="font-bold text-dnu-dark">{formatPrice(program.price)}</span>
        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(program.duration, program.duration_unit)}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-dnu-blue transition-colors shrink-0" />
    </Link>
  );
}

const AUDIENCE_TO_CATEGORY: Record<string, Category> = {
  teachers: 'qualification',
  civil: 'qualification',
  applicants: 'pre-university',
  specialists: 'retraining',
};

export default function Programs() {
  const { programs } = usePrograms();
  const { locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageData, setPageData] = useState<null | {
    page_title?: string;
    page_intro?: string;
    search_placeholder?: string;
    popular_tags_title?: string;
    popular_tags?: { text: string; query: string; order: number }[];
    empty_state_text?: string;
  }>(null);

  useEffect(() => {
    getProgramsPage(locale).then(setPageData).catch(() => undefined);
  }, [locale]);
  const initialSearch = searchParams.get('search') || '';
  const audienceParam = searchParams.get('audience') || '';
  const initialCategory = (searchParams.get('category') as Category)
    || AUDIENCE_TO_CATEGORY[audienceParam]
    || 'all';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState<Category>(initialCategory);
  const [format, setFormat] = useState<Format>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchCat = category === 'all' || p.category === category;
      const matchFmt = format === 'all' || p.format === format;
      const q = searchTerm.toLowerCase();
      const matchSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.targetAudience?.toLowerCase().includes(q) ?? false);
      return matchCat && matchFmt && matchSearch;
    });
  }, [searchTerm, category, format]);

  const categoryCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = { all: programs.length };
    programs.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { search: searchTerm } : {});
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-dnu-blue transition-colors">Головна</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">Каталог програм</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{pageData?.page_title || ''}</h1>
          <p className="text-gray-600 mb-6">{pageData?.page_intro || ''}</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={pageData?.search_placeholder || ''}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none"
              />
            </div>
            <button type="submit" className="bg-dnu-blue text-white px-6 py-2.5 rounded-xl font-medium hover:bg-dnu-dark transition-colors">
              Знайти
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex gap-1 mt-5 border-b border-gray-200 overflow-x-auto pb-0">
            {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={clsx(
                  'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
                  category === key
                    ? 'border-dnu-blue text-dnu-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                )}
              >
                {label} <span className="ml-1 text-xs text-gray-400">({categoryCounts[key] || 0})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Фільтри
              </h3>

              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Формат навчання</p>
                {(['all', 'online', 'offline', 'mixed'] as Format[]).map((f) => (
                  <label key={f} className="flex items-center gap-2.5 mb-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="format"
                      checked={format === f}
                      onChange={() => setFormat(f)}
                      className="accent-dnu-blue w-4 h-4"
                    />
                    <span className={clsx('text-sm group-hover:text-dnu-blue transition-colors', format === f ? 'font-semibold text-dnu-blue' : 'text-gray-700')}>
                      {f === 'all' ? 'Усі формати' : FORMAT_LABEL[f]}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => { setFormat('all'); setCategory('all'); setSearchTerm(''); }}
                className="text-xs text-gray-500 hover:text-dnu-blue underline"
              >
                Скинути фільтри
              </button>
            </div>
          </aside>

          {/* Programs List */}
          <div className="flex-1 min-w-0">
            {/* Sort / View row */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-600">
                Знайдено: <strong className="text-gray-900">{filtered.length} програм</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx('p-2 rounded-lg border transition-colors', viewMode === 'grid' ? 'bg-dnu-blue border-dnu-blue text-white' : 'border-gray-300 text-gray-500 hover:border-dnu-blue')}
                  title="Сітка"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={clsx('p-2 rounded-lg border transition-colors', viewMode === 'list' ? 'bg-dnu-blue border-dnu-blue text-white' : 'border-gray-300 text-gray-500 hover:border-dnu-blue')}
                  title="Список"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {filtered.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p) => (
                    <div key={p.id}>
                      <ProgramCardGrid program={p} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map((p) => (
                    <div key={p.id}>
                      <ProgramCardList program={p} />
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-600 font-medium">{pageData?.empty_state_text || ''}</p>
                <button
                  onClick={() => { setSearchTerm(''); setCategory('all'); setFormat('all'); }}
                  className="mt-3 text-dnu-blue hover:underline text-sm"
                >
                  Скинути фільтри
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
