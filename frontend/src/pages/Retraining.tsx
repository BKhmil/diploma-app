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
    admission_heading_retraining?: string;
    admission_heading_master?: string;
    documents_label?: string;
    dates_label?: string;
    empty_state_text?: string;
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageData?.page_title || ''}</h1>
          <p className="text-lg text-gray-600">{pageData?.page_intro || ''}</p>
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
            {activeTab === 'retraining'
              ? (pageData?.admission_heading_retraining || '')
              : (pageData?.admission_heading_master || '')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {pageData?.documents_label && (
                <h3 className="font-semibold text-lg mb-3">{pageData.documents_label}</h3>
              )}
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {(activeTab === 'retraining'
                  ? pageData?.admission_docs_retraining
                  : pageData?.admission_docs_master
                )?.length
                  ? [...(activeTab === 'retraining'
                      ? pageData!.admission_docs_retraining!
                      : pageData!.admission_docs_master!)
                    ].sort((a, b) => a.order - b.order).map((d) => <li key={d.text}>{d.text}</li>)
                  : null}
              </ul>
            </div>
            <div>
              {pageData?.dates_label && (
                <h3 className="font-semibold text-lg mb-3">{pageData.dates_label}</h3>
              )}
              <ul className="space-y-3 text-gray-600">
                {pageData?.important_dates?.length
                  ? [...pageData.important_dates].sort((a, b) => a.order - b.order).map((d) => (
                    <li key={d.label} className="flex justify-between border-b border-gray-100 pb-2">
                      <span>{d.label}</span>
                      <span className="font-medium text-dnu-dark">{d.value}</span>
                    </li>
                  ))
                  : null}
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

        {displayedPrograms.length === 0 && pageData?.empty_state_text && (
          <div className="text-center py-12 text-gray-500">
            {pageData.empty_state_text}
          </div>
        )}
      </div>
    </div>
  );
}
