import React, { useState, useMemo } from 'react';
import { usePrograms } from '../context/ProgramsContext';
import { ProgramCard } from '../components/ui/ProgramCard';
import { Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { getQualificationPage } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

export default function Qualification() {
  const { programs } = usePrograms();
  const { locale } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [pageData, setPageData] = useState<null | { page_title?: string; page_intro?: string }>(null);

  React.useEffect(() => {
    getQualificationPage(locale).then(setPageData).catch(() => undefined);
  }, [locale]);

  // Filter only qualification programs
  const qualificationPrograms = useMemo(() => {
    return programs.filter(p => p.category === 'qualification');
  }, []);

  // Apply search and format filters
  const filteredPrograms = useMemo(() => {
    return qualificationPrograms.filter(program => {
      const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          program.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFormat = selectedFormat === 'all' || program.format === selectedFormat;
      
      return matchesSearch && matchesFormat;
    });
  }, [qualificationPrograms, searchTerm, selectedFormat]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageData?.page_title || ''}</h1>
          <p className="text-lg text-gray-600">{pageData?.page_intro || ''}</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук програми..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Format Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Filter className="h-5 w-5 text-gray-500 mr-2 hidden md:block" />
              {['all', 'online', 'offline', 'mixed'].map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                    selectedFormat === format
                      ? 'bg-dnu-blue text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {format === 'all' ? 'Всі формати' : 
                   format === 'online' ? 'Онлайн' : 
                   format === 'offline' ? 'Офлайн' : 'Змішаний'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">За вашим запитом програм не знайдено.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedFormat('all');}}
              className="mt-4 text-dnu-blue hover:underline"
            >
              Скинути фільтри
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
