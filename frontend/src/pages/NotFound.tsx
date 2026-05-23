import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Phone, Search } from 'lucide-react';
import { getNotFoundPage } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

export default function NotFound() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { locale } = useLanguage();
  const [cmsData, setCmsData] = useState<null | {
    title?: string;
    description?: string;
    search_label?: string;
    search_placeholder?: string;
    popular_links_title?: string;
    popular_links?: { label: string; path: string; order: number }[];
  }>(null);

  useEffect(() => {
    getNotFoundPage(locale).then(setCmsData).catch(() => undefined);
  }, [locale]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/programs?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const popularLinks = cmsData?.popular_links?.length
    ? [...cmsData.popular_links].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-white">
      <div className="text-[120px] md:text-[160px] font-black text-gray-100 leading-none select-none">
        404
      </div>
      <div className="w-20 h-1 bg-dnu-dark mx-auto mb-6 -mt-2" />

      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
        {cmsData?.title || ''}
      </h1>
      <p className="text-gray-500 max-w-md leading-relaxed mb-10">
        {cmsData?.description || ''}
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 w-full max-w-md mb-10">
        {cmsData?.search_label && (
          <p className="text-sm font-bold text-gray-700 mb-3">{cmsData.search_label}</p>
        )}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={cmsData?.search_placeholder || ''}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-dnu-blue text-white rounded-xl text-sm font-semibold hover:bg-dnu-dark transition-colors whitespace-nowrap"
          >
            Знайти
          </button>
        </form>
      </div>

      <div className="flex gap-3 flex-wrap justify-center mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-dnu-dark text-white px-5 py-2.5 rounded-xl font-medium hover:bg-black transition-colors text-sm"
        >
          <Home className="w-4 h-4" /> На головну
        </Link>
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:border-dnu-blue hover:text-dnu-blue transition-colors text-sm"
        >
          <BookOpen className="w-4 h-4" /> Всі програми
        </Link>
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:border-dnu-blue hover:text-dnu-blue transition-colors text-sm"
        >
          <Phone className="w-4 h-4" /> Контакти
        </Link>
      </div>

      {popularLinks.length > 0 && (
        <div className="text-sm text-gray-500">
          <span className="mr-2">{cmsData?.popular_links_title || ''}</span>
          {popularLinks.map(({ path, label }, i, arr) => (
            <span key={path}>
              <Link to={path} className="text-dnu-dark hover:underline font-medium">{label}</Link>
              {i < arr.length - 1 && <span className="mx-2 text-gray-300">·</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
