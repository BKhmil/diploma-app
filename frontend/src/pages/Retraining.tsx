import React, { useState } from 'react';
import { usePrograms } from '../context/ProgramsContext';
import { ProgramCard } from '../components/ui/ProgramCard';
import { BookOpen, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { getRetrainingPage } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

export default function Retraining() {
  const { programs } = usePrograms();
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'retraining' | 'master'>('retraining');
  const [pageData, setPageData] = useState<null | {
    page_title?: string;
    page_intro?: string;
    admission_docs_retraining?: { text: string; order: number }[];
    admission_docs_master?: { text: string; order: number }[];
    important_dates?: { label: string; value: string; order: number }[];
  }>(null);

  React.useEffect(() => {
    getRetrainingPage(locale).then(setPageData).catch(() => undefined);
  }, [locale]);

  const displayedPrograms = programs.filter(p => p.category === activeTab);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageData?.page_title || 'Перепідготовка та Магістратура'}</h1>
          <p className="text-lg text-gray-600">
            {pageData?.page_intro || "Здобудьте нову спеціальність або підвищте свій освітній рівень. Ми пропонуємо програми перепідготовки та магістерські програми для вашого кар'єрного зростання."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveTab('retraining')}
              className={clsx(
                'px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
                activeTab === 'retraining'
                  ? 'bg-dnu-blue text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <BookOpen className="w-4 h-4" />
              Перепідготовка
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className={clsx(
                'px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all',
                activeTab === 'master'
                  ? 'bg-dnu-blue text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <GraduationCap className="w-4 h-4" />
              Магістратура
            </button>
          </div>
        </div>

        {/* Info Block */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">
            {activeTab === 'retraining' ? 'Умови вступу на перепідготовку' : 'Умови вступу до магістратури'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Необхідні документи:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {activeTab === 'retraining'
                  ? (pageData?.admission_docs_retraining?.length
                      ? [...pageData.admission_docs_retraining].sort((a, b) => a.order - b.order).map((d) => <li key={d.text}>{d.text}</li>)
                      : [<li key="1">Заява на ім'я ректора</li>, <li key="2">Копія паспорта та ІПН</li>, <li key="3">Копія диплома про вищу освіту</li>, <li key="4">4 фотокартки 3х4</li>]
                    )
                  : (pageData?.admission_docs_master?.length
                      ? [...pageData.admission_docs_master].sort((a, b) => a.order - b.order).map((d) => <li key={d.text}>{d.text}</li>)
                      : [<li key="1">Заява на ім'я ректора</li>, <li key="2">Копія паспорта та ІПН</li>, <li key="3">Копія диплома про вищу освіту</li>, <li key="4">4 фотокартки 3х4</li>, <li key="5">Результати ЄВІ/ЄФВВ</li>]
                    )
                }
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Важливі дати:</h3>
              <ul className="space-y-3 text-gray-600">
                {(pageData?.important_dates?.length
                  ? [...pageData.important_dates].sort((a, b) => a.order - b.order)
                  : [
                      { label: 'Початок прийому документів:', value: '1 липня 2026' },
                      { label: 'Вступні випробування:', value: 'серпень 2026' },
                      { label: 'Початок навчання:', value: '1 вересня 2026' },
                    ]
                ).map((d) => (
                  <li key={d.label} className="flex justify-between border-b border-gray-100 pb-2">
                    <span>{d.label}</span>
                    <span className="font-medium text-dnu-dark">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>

        {displayedPrograms.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Наразі немає активних програм у цій категорії.
          </div>
        )}
      </div>
    </div>
  );
}
