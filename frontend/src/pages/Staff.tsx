import React, { useState, useMemo } from 'react';
import { Search, Mail, Award, Users, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { getStaffMembers } from '../services/strapi';
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

const staffData: StaffMember[] = [
  // Management
  {
    id: 1,
    name: 'Кравченко Валентина Олегівна',
    position: 'Директор ЦНО',
    degree: 'д-р пед. наук, проф.',
    experience: 25,
    email: 'direktor@dnu.dp.ua',
    programs: 8,
    tags: ['Освіта дорослих', 'Менеджмент'],
    role: 'management',
    photo: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 2,
    name: 'Білоус Іван Петрович',
    position: 'Заступник директора',
    degree: 'канд. пед. наук, доц.',
    experience: 18,
    email: 'zastupnyk@dnu.dp.ua',
    programs: 5,
    tags: ['Педагогіка', 'Адміністрування'],
    role: 'management',
    photo: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 3,
    name: 'Мороз Ольга Сергіївна',
    position: 'Завідувач відділу підвищення кваліфікації',
    degree: 'канд. пед. наук',
    experience: 12,
    email: 'pk@dnu.dp.ua',
    programs: 12,
    tags: ['ПК', 'Методологія'],
    role: 'management',
    photo: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 4,
    name: 'Ткаченко Руслан Миколайович',
    position: 'Завідувач відділу перепідготовки',
    degree: 'канд. юрид. наук',
    experience: 10,
    email: 'mags@dnu.dp.ua',
    programs: 6,
    tags: ['Перепідготовка', 'Право'],
    role: 'management',
    photo: 'https://i.pravatar.cc/150?img=15',
  },
  // Teachers
  {
    id: 5,
    name: 'Петренко Анна Василівна',
    position: 'канд. психол. наук, доцент',
    department: 'Кафедра психології',
    experience: 15,
    programs: 5,
    tags: ['Психологія', 'Педагогіка', 'Тренінги'],
    role: 'teachers',
    photo: 'https://i.pravatar.cc/150?img=49',
  },
  {
    id: 6,
    name: 'Гончаренко Дмитро Федорович',
    position: 'д-р екон. наук, проф.',
    department: 'Кафедра менеджменту',
    experience: 22,
    programs: 3,
    tags: ['Менеджмент', 'Фінанси', 'Бізнес'],
    role: 'teachers',
    photo: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 7,
    name: 'Коваль Світлана Іванівна',
    position: 'Вчитель математики вищої категорії',
    department: 'Ліцей №15 м. Дніпра',
    experience: 19,
    programs: 1,
    tags: ['НМТ Математика', 'Алгебра', 'Геометрія'],
    role: 'teachers',
    photo: 'https://i.pravatar.cc/150?img=38',
  },
  {
    id: 8,
    name: 'Назаренко Олексій Борисович',
    position: 'канд. філол. наук, доцент',
    department: 'Кафедра української мови',
    experience: 14,
    programs: 2,
    tags: ['Українська мова', 'НМТ Мова', 'Літературознавство'],
    role: 'teachers',
    photo: 'https://i.pravatar.cc/150?img=21',
  },
  {
    id: 9,
    name: 'Шевченко Марина Андріївна',
    position: 'канд. пед. наук',
    department: 'Кафедра педагогіки',
    experience: 11,
    programs: 4,
    tags: ['НУШ', 'Інклюзивна освіта', 'Дидактика'],
    role: 'teachers',
    photo: 'https://i.pravatar.cc/150?img=41',
  },
  {
    id: 10,
    name: 'Лисенко Ярослав Михайлович',
    position: 'канд. іст. наук, доцент',
    department: 'Кафедра історії',
    experience: 16,
    programs: 2,
    tags: ['Історія України', 'НМТ Історія'],
    role: 'teachers',
    photo: 'https://i.pravatar.cc/150?img=27',
  },
  // Administration
  {
    id: 11,
    name: 'Харченко Оксана Вікторівна',
    position: 'Головний бухгалтер',
    experience: 8,
    email: 'buh@dnu.dp.ua',
    tags: ['Фінанси', 'Бухгалтерія'],
    role: 'administration',
    photo: 'https://i.pravatar.cc/150?img=51',
  },
  {
    id: 12,
    name: 'Сидоренко Тетяна Григорівна',
    position: 'Менеджер з прийому',
    experience: 5,
    email: 'priem@dnu.dp.ua',
    tags: ['Прийом', 'Документи'],
    role: 'administration',
    photo: 'https://i.pravatar.cc/150?img=45',
  },
];

const FILTER_LABELS: Record<string, string> = {
  all: `Всі (${staffData.length})`,
  management: `Керівництво (${staffData.filter(s => s.role === 'management').length})`,
  teachers: `Викладачі (${staffData.filter(s => s.role === 'teachers').length})`,
  administration: `Адміністрація (${staffData.filter(s => s.role === 'administration').length})`,
};

export default function Staff() {
  const { locale } = useLanguage();
  const [staff, setStaff] = useState<StaffMember[]>(staffData);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTeachers, setShowAllTeachers] = useState(false);

  React.useEffect(() => {
    getStaffMembers(locale)
      .then((items) => {
        if (!items.length) return;
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
          photo: item.photo?.url ? item.photo.url : 'https://i.pravatar.cc/150?img=41',
        }));
        setStaff(mapped);
      })
      .catch(() => undefined);
  }, [locale]);

  const management = staff.filter(s => s.role === 'management');

  const filteredTeachers = useMemo(() => {
    const teachers = staff.filter(s => s.role === 'teachers');
    if (!searchQuery) return teachers;
    const q = searchQuery.toLowerCase();
    return teachers.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const displayedTeachers = showAllTeachers ? filteredTeachers : filteredTeachers.slice(0, 4);

  const administration = staff.filter(s => s.role === 'administration');

  const showManagement = activeFilter === 'all' || activeFilter === 'management';
  const showTeachers = activeFilter === 'all' || activeFilter === 'teachers';
  const showAdmin = activeFilter === 'all' || activeFilter === 'administration';

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-dnu-blue transition-colors">Головна</Link>
            <span className="mx-2">›</span>
            <Link to="/about" className="hover:text-dnu-blue transition-colors">Про центр</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">Персонал</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Персонал Центру</h1>
          <p className="text-gray-600">Команда досвідчених науковців та практиків</p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {Object.entries(FILTER_LABELS).map(([key, label]) => (
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

        {/* Management Section */}
        {showManagement && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-dnu-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Керівництво</h2>
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

        {/* Teachers Section */}
        {showTeachers && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-dnu-blue" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Викладацький склад</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {filteredTeachers.length} фахівців · кандидати та доктори наук, практикуючі спеціалісти
                  </p>
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
                    Показати всіх {filteredTeachers.length} викладачів →
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

        {/* Administration Section */}
        {showAdmin && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-dnu-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Адміністрація</h2>
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

        {/* CTA */}
        <section className="bg-dnu-dark rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Хочете викладати у нас?</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Запрошуємо досвідчених фахівців та науковців до співпраці. Залишіть заявку і ми зв'яжемося з вами.
          </p>
          <Link to="/contacts" className="inline-block bg-white text-dnu-dark font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            Зв'язатися з нами
          </Link>
        </section>
      </div>
    </div>
  );
}
