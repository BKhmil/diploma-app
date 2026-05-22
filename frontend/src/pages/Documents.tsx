import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Eye, Search, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { getDocuments, getContactInfo } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

const STRAPI_BASE = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');

interface Document {
  id: number;
  title: string;
  meta: string;
  type: 'PDF' | 'DOC' | 'DOCX';
  category: 'licenses' | 'regulations' | 'programs' | 'samples';
  action: 'download' | 'view';
  fileUrl?: string;
}

const DOCS: Document[] = [
  // Licenses
  { id: 1, title: 'Ліцензія МОН України на провадження освітньої діяльності', meta: 'Серія АА №123456 · Дійсна до 2028 · Оновлено: 15.06.2023', type: 'PDF', category: 'licenses', action: 'download' },
  { id: 2, title: 'Свідоцтво про акредитацію', meta: 'Серія НД №789012 · Оновлено: 22.03.2022', type: 'PDF', category: 'licenses', action: 'download' },
  { id: 3, title: 'Ліцензія на програми перепідготовки', meta: 'Серія АА №654321 · Оновлено: 10.01.2024', type: 'PDF', category: 'licenses', action: 'download' },
  { id: 4, title: 'Висновок НАЗЯВО щодо якості освіти', meta: 'Оновлено: 05.09.2023', type: 'PDF', category: 'licenses', action: 'download' },
  // Regulations
  { id: 5, title: 'Положення про Центр неперервної освіти ДНУ', meta: 'Затверджено вченою радою ДНУ · 2022', type: 'DOC', category: 'regulations', action: 'download' },
  { id: 6, title: 'Статут ДНУ ім. Олеся Гончара', meta: 'Зареєстровано МОН України · Редакція 2021', type: 'PDF', category: 'regulations', action: 'download' },
  { id: 7, title: 'Порядок зарахування слухачів на навчання', meta: 'Затверджено директором ЦНО · 2023', type: 'PDF', category: 'regulations', action: 'download' },
  { id: 8, title: 'Правила внутрішнього розпорядку', meta: 'Редакція 2024', type: 'PDF', category: 'regulations', action: 'download' },
  { id: 9, title: 'Антикорупційна програма ЦНО', meta: 'Затверджено 2023', type: 'PDF', category: 'regulations', action: 'download' },
  { id: 10, title: 'Положення про атестацію слухачів', meta: 'Оновлено 2024', type: 'DOC', category: 'regulations', action: 'download' },
  // Learning programs
  { id: 11, title: 'Навч. програма: Педагогічна майстерність (120 год.)', meta: 'ПК · Затверджено 2024', type: 'PDF', category: 'programs', action: 'download' },
  { id: 12, title: 'Навч. програма: Охорона праці в освіті', meta: 'ПК · Затверджено 2024', type: 'PDF', category: 'programs', action: 'download' },
  { id: 13, title: 'Навч. програма: Психологія (перепідготовка)', meta: '1,5 роки · Затверджено 2023', type: 'PDF', category: 'programs', action: 'download' },
  { id: 14, title: 'Навч. програма: Менеджмент організацій', meta: '1 рік · Затверджено 2023', type: 'PDF', category: 'programs', action: 'download' },
  { id: 15, title: 'Навч. програма: НМТ Математика (90 год.)', meta: 'Підготовчий курс · 2024', type: 'PDF', category: 'programs', action: 'download' },
  { id: 16, title: 'Навч. програма: НМТ Українська мова', meta: 'Підготовчий курс · 2024', type: 'PDF', category: 'programs', action: 'download' },
  // Samples
  { id: 17, title: 'Заява на вступ — форма для підвищення кваліфікації', meta: 'Форма для заповнення', type: 'DOCX', category: 'samples', action: 'download' },
  { id: 18, title: 'Заява на перепідготовку (вступ до магістратури)', meta: 'Форма для заповнення', type: 'DOCX', category: 'samples', action: 'download' },
  { id: 19, title: 'Договір про надання освітніх послуг', meta: 'Зразок договору (контракт)', type: 'PDF', category: 'samples', action: 'view' },
  { id: 20, title: 'Особова картка слухача', meta: 'Анкета для особової справи', type: 'DOCX', category: 'samples', action: 'download' },
  { id: 21, title: 'Зразок посвідчення про підвищення кваліфікації', meta: 'Документ після навчання', type: 'PDF', category: 'samples', action: 'view' },
  { id: 22, title: 'Зразок диплома магістра (перепідготовка)', meta: 'Документ після перепідготовки', type: 'PDF', category: 'samples', action: 'view' },
];

const TYPE_COLORS: Record<string, string> = {
  PDF: 'bg-red-50 text-red-600 border-red-100',
  DOC: 'bg-blue-50 text-blue-600 border-blue-100',
  DOCX: 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function Documents() {
  const { locale } = useLanguage();
  const [docs, setDocs] = useState<Document[]>(DOCS);
  const [activeTab, setActiveTab] = useState<'all' | 'licenses' | 'regulations' | 'programs' | 'samples'>('all');
  const [query, setQuery] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');

  React.useEffect(() => {
    getContactInfo(locale)
      .then((info: any) => {
        if (info?.documents_page_title) setPageTitle(info.documents_page_title);
        if (info?.documents_page_subtitle) setPageSubtitle(info.documents_page_subtitle);
      })
      .catch(() => undefined);
  }, [locale]);

  React.useEffect(() => {
    getDocuments(locale)
      .then((items) => {
        if (!items.length) return;
        const mapped: Document[] = items.map((item, idx) => {
          const fileObj = item.file;
          const fileUrl = fileObj?.url ? `${STRAPI_BASE}${fileObj.url}` : undefined;
          const mime: string = fileObj?.mime ?? '';
          let type: Document['type'] = 'PDF';
          if (mime.includes('wordprocessingml') || mime.includes('msword')) {
            type = mime.includes('openxmlformats') ? 'DOCX' : 'DOC';
          } else if (fileObj?.name) {
            const ext = fileObj.name.split('.').pop()?.toUpperCase();
            if (ext === 'DOC') type = 'DOC';
            else if (ext === 'DOCX') type = 'DOCX';
          }
          return {
            id: Number(item.id ?? idx + 1),
            title: item.title || 'Документ',
            meta: item.meta || item.description || '',
            type,
            category: (item.doc_category || 'regulations') as Document['category'],
            action: (item.action || 'download') as Document['action'],
            fileUrl,
          };
        });
        setDocs(mapped);
      })
      .catch(() => undefined);
  }, [locale]);

  const TABS = [
    { id: 'all', label: 'Всі', count: docs.length },
    { id: 'licenses', label: 'Ліцензії', count: docs.filter((d) => d.category === 'licenses').length },
    { id: 'regulations', label: 'Положення', count: docs.filter((d) => d.category === 'regulations').length },
    { id: 'programs', label: 'Навч. програми', count: docs.filter((d) => d.category === 'programs').length },
    { id: 'samples', label: 'Зразки', count: docs.filter((d) => d.category === 'samples').length },
  ] as const;

  const filtered = docs.filter((d) => {
    const matchesTab = activeTab === 'all' || d.category === activeTab;
    const matchesQuery = query === '' || d.title.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const groupedByCategory = (cat: Document['category']) =>
    filtered.filter((d) => d.category === cat);

  const CATEGORY_LABELS: Record<string, string> = {
    licenses: 'Ліцензії та акредитація',
    regulations: 'Положення та регламенти',
    programs: 'Навчальні програми',
    samples: 'Зразки документів для вступу',
  };

  const categoriesToShow: Document['category'][] =
    activeTab === 'all'
      ? ['licenses', 'regulations', 'programs', 'samples']
      : [activeTab as Document['category']];

  return (
    <div className="bg-white min-h-screen">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 pt-8 pb-0">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-dnu-blue transition-colors">Головна</Link>
            <span className="mx-2">›</span>
            <Link to="/about" className="hover:text-dnu-blue transition-colors">Про центр</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">Документи</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{pageTitle || 'Нормативні документи'}</h1>
          <p className="text-gray-600 text-sm mb-6">{pageSubtitle || 'Правові підстави діяльності, програми навчання та зразки документів'}</p>

          {/* Tabs */}
          <div className="flex gap-0 overflow-x-auto border-b-2 border-gray-200 -mx-4 px-4 md:mx-0 md:px-0">
            {TABS.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={clsx(
                  'px-5 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-0.5 transition-colors',
                  activeTab === id
                    ? 'border-dnu-dark text-dnu-dark bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                )}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10">
        {/* Search */}
        <div className="flex gap-3 mb-10 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Пошук документа..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none text-sm"
            />
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Скинути
            </button>
          )}
        </div>

        {/* Samples warning banner */}
        {(activeTab === 'samples' || activeTab === 'all') && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              Завантажте та заповніть зразки перед подачею заявки. Документи приймаються в паперовому вигляді або скан-копіями.
            </p>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Документів не знайдено</p>
            <p className="text-sm mt-1">Спробуйте змінити запит</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categoriesToShow.map((cat) => {
              const docs = groupedByCategory(cat);
              if (docs.length === 0) return null;
              return (
                <section key={cat}>
                  <h2 className="text-lg font-extrabold text-gray-900 mb-4 pb-3 border-b-2 border-gray-900">
                    {CATEGORY_LABELS[cat]}
                  </h2>

                  {cat === 'samples' ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {docs.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 rounded-xl p-5 bg-white flex items-start gap-4 hover:border-dnu-blue/40 hover:shadow-sm transition-all group">
                          <div className={clsx('w-10 h-12 rounded border flex items-center justify-center text-xs font-bold shrink-0', TYPE_COLORS[doc.type])}>
                            {doc.type}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-gray-900 leading-snug mb-1 group-hover:text-dnu-blue transition-colors">{doc.title}</div>
                            <div className="text-xs text-gray-500 mb-3">{doc.meta}</div>
                            {doc.fileUrl ? (
                              <a
                                href={doc.fileUrl}
                                target={doc.action === 'view' ? '_blank' : undefined}
                                download={doc.action === 'download' ? true : undefined}
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium text-dnu-blue hover:underline"
                              >
                                {doc.action === 'download' ? (
                                  <><Download className="w-3.5 h-3.5" /> Завантажити .{doc.type.toLowerCase()}</>
                                ) : (
                                  <><Eye className="w-3.5 h-3.5" /> Переглянути</>
                                )}
                              </a>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs text-gray-300 cursor-not-allowed">
                                <Download className="w-3.5 h-3.5" /> Файл не додано
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {docs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-5 border border-gray-200 rounded-xl bg-white hover:border-dnu-blue/40 hover:shadow-sm transition-all group">
                          <div className="flex items-center gap-4">
                            <div className={clsx('w-10 h-12 rounded border flex items-center justify-center text-xs font-bold shrink-0', TYPE_COLORS[doc.type])}>
                              {doc.type}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900 group-hover:text-dnu-blue transition-colors">{doc.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{doc.meta}</div>
                            </div>
                          </div>
                          {doc.fileUrl ? (
                            <a
                              href={doc.fileUrl}
                              target={doc.action === 'view' ? '_blank' : undefined}
                              download={doc.action === 'download' ? true : undefined}
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-dnu-blue text-white text-xs font-bold rounded-lg hover:bg-dnu-dark transition-colors shrink-0 ml-4"
                            >
                              {doc.action === 'view' ? (
                                <><Eye className="w-3.5 h-3.5" /> Переглянути</>
                              ) : (
                                <><Download className="w-3.5 h-3.5" /> Завантажити</>
                              )}
                            </a>
                          ) : (
                            <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg shrink-0 ml-4 cursor-not-allowed">
                              <Download className="w-3.5 h-3.5" /> Файл не додано
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
