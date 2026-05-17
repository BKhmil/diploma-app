import { useState } from 'react';
import { Program } from '../../types';
import { ProgramCard } from './ProgramCard';
import { Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';

interface ProgramListProps {
  programs: Program[];
  title: string;
  description?: string;
}

export function ProgramList({ programs, title, description }: ProgramListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'online' | 'offline' | 'mixed'>('all');

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || program.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-dnu-blue mb-4">{title}</h1>
          {description && <p className="text-slate-600">{description}</p>}
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Пошук програми..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter size={20} className="text-slate-400 mr-2 hidden md:block" />
            {['all', 'online', 'offline', 'mixed'].map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format as any)}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  selectedFormat === format
                    ? "bg-dnu-blue text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {format === 'all' ? 'Всі формати' :
                 format === 'online' ? 'Онлайн' :
                 format === 'offline' ? 'Офлайн' : 'Змішаний'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div key={program.id}>
                <ProgramCard program={program} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">За вашим запитом нічого не знайдено.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedFormat('all');}}
              className="mt-4 text-dnu-blue font-medium hover:underline"
            >
              Скинути фільтри
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
