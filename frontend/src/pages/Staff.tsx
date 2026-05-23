import React, { useState, useMemo, useEffect } from 'react';
import { Search, Mail, Award, Users, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { getStaffMembers, getStaffPage, mediaUrl } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

type StaffRole = 'management' | 'teachers' | 'administration';

interface StaffMember {
  id: number;
  name: string;
  position: string;
  degree?: string;
  department?: string;
  experience: number;
  email?: string;
  programs?: number;
  tags: string[];
  role: StaffRole;
  photo: string;
}

export default function Staff() {
  const { locale } = useLanguage();
  const [staffLoading, setStaffLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTeachers, setShowAllTeachers] = useState(false);
  const [pageData, setPageData] = useState<null | {
    page_title?: string;
    page_subtitle?: string;
    leadership_section_title?: string;
    teachers_section_title?: string;
    teachers_section_subtitle_template?: string;
    administration_section_title?: string;
    cta_title?: string;
    cta_text?: string;
  }>(null);

  useEffect(() => {
    getStaffPage(locale).then(setPageData).catch(() => undefined);
  }, [locale]);

  useEffect(() => {
    getStaffMembers(locale)
      .then((items) => {
        if (!items.length) {
          setStaff([]);
          return;
        }
        const mapped: StaffMember[] = items.map((item, idx) => ({
          id: Number(item.id ?? idx + 1),
          name: item.name || 'Працівник',
          position: item.position || '',
          degree: item.degree,
          department: item.department,
          experience: item.experience || 0,
          email: item.email,
          programs: item.programs_count,
          tags: Array.isArray(item.tags) ? item.tags : [],
          role: (item.role || 'teachers') as StaffRole,
          photo: mediaUrl(item.photo) ?? 'https://i.pravatar.cc/150?img=41',
        }));
        setStaff(mapped);
      })
      .catch(() => setStaff([]))
      .finally(() => setStaffLoading(false));
  }, [locale]);

  const management = staff.filter(s => s.role === 'management');
  const administration = staff.filter(s => s.role === 'administration');

  const filteredTeachers = useMemo(() => {
    const teachers = staff.filter(s => s.role === 'teachers');
    if (!searchQuery) return teachers;
    const q = searchQuery.toLowerCase();
    return teachers.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [staff, searchQuery]);

  const displayedTeachers = showAllTeachers ? filteredTeachers : filteredTeachers.slice(0, 4);

  const showManagement = activeFilter === 'all' || activeFilter === 'management';
  const showTeachers = activeFilter === 'all' || activeFilter === 'teachers';
  const showAdmin = activeFilter === 'all' || activeFilter === 'administration';

  const filterLabels: Record<string, string> = {
    all: `Всі (${staff.length})`,
    management: `${pageData?.leadership_section_title || 'Керівництво'} (${management.length})`,
    teachers: `${pageData?.teachers_section_title || 'Викладачі'} (${filteredTeachers.length})`,
    administration: `${pageData?.administration_section_title || 'Адміністрація'} (${administration.length})`,
  };

  const teachersSubtitle = pageData?.teachers_section_subtitle_template
    ? pageData.teachers_section_subtitle_template.replace('{count}', String(filteredTeachers.length))
    : '';

  if (staffLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-dnu-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-dnu-blue transition-colors">Головна</Link>
            <span className="mx-2">›</span>
            <Link to="/about" className="hover:text-dnu-blue transition-colors">Про центр</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">{pageData?.page_title || ''}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageData?.page_title || ''}</h1>
          <p className="text-gray-600">{pageData?.page_subtitle || ''}</p>

          <div className="flex flex-wrap gap-2 mt-6">
            {Object.entries(filterLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeFilter === key
                    ? 'bg-dnu-dark text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-dnu-blue hover:text-dnu-blue'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 space-y-16">
        {showManagement && management.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-dnu-blue" />
              <h2 className="text-2xl font-bold text-gray-900">{pageData?.leadership_section_title || ''}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {management.map((person) => (
                <div key={person.id} className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-dnu-light">
                    <img src={person.photo} alt={person.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{person.name}</h3>
                  <p className="text-dnu-blue text-xs font-semibold mb-1">{person.position}</p>
                  {person.degree && (
                    <p className="text-gray-500 text-xs mb-3 leading-relaxed">{person.degree}<br />Стаж: {person.experience} р.</p>
                  )}
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    {person.email && (
                      <a href={`mailto:${person.email}`} className="text-xs text-gray-500 hover:text-dnu-blue transition-colors flex items-center justify-center gap-1">
                        <Mail className="w-3 h-3" /> {person.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {showTeachers && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-dnu-blue" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{pageData?.teachers_section_title || ''}</h2>
                  {teachersSubtitle && (
                    <p className="text-sm text-gray-500 mt-0.5">{teachersSubtitle}</p>
                  )}
                </div>
              </div>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пошук за ім'ям..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              {displayedTeachers.map((person) => (
                <div key={person.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-dnu-blue hover:shadow-sm transition-all">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{person.name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{person.position}{person.department ? ` · ${person.department}` : ''}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {person.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500 shrink-0 hidden sm:block">
                    {person.programs !== undefined && <p className="font-medium">{person.programs} програм</p>}
                    <p>Стаж: {person.experience} р.</p>
                  </div>
                </div>
              ))}

              {!showAllTeachers && filteredTeachers.length > 4 && (
                <div className="text-center pt-3">
                  <button
                    onClick={() => setShowAllTeachers(true)}
                    className="border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl hover:border-dnu-blue hover:text-dnu-blue transition-colors text-sm"
                  >
                    Показати всіх {filteredTeachers.length} →
                  </button>
                </div>
              )}

              {filteredTeachers.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p>Викладачів за запитом не знайдено</p>
                </div>
              )}
            </div>
          </section>
        )}

        {showAdmin && administration.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-dnu-blue" />
              <h2 className="text-2xl font-bold text-gray-900">{pageData?.administration_section_title || ''}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {administration.map((person) => (
                <div key={person.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-all">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{person.name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{person.position}</p>
                    {person.email && (
                      <a href={`mailto:${person.email}`} className="text-xs text-dnu-blue hover:underline mt-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" />{person.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(pageData?.cta_title || pageData?.cta_text) && (
          <section className="bg-dnu-dark rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">{pageData.cta_title}</h2>
            {pageData.cta_text && (
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">{pageData.cta_text}</p>
            )}
            <Link to="/contacts" className="inline-block bg-white text-dnu-dark font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Зв'язатися з нами
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
