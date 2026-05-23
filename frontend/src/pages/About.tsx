import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import { getAboutPage } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

const timeline = [
  { year: '1995', title: 'Заснування центру', desc: 'Рішенням вченої ради університету створено підрозділ перепідготовки та підвищення кваліфікації фахівців.' },
  { year: '2005', title: 'Перший диплом магістра', desc: 'Розпочато видачу дипломів магістра за програмами перепідготовки. Перший випуск — 48 магістрів.' },
  { year: '2012', title: 'Програми НМТ-підготовки', desc: 'Запущені перші підготовчі курси для абітурієнтів. Понад 200 учнів у першому наборі.' },
  { year: '2018', title: 'Запуск онлайн-навчання', desc: 'Впроваджено дистанційну форму навчання через сучасну LMS-платформу. Перший повністю онлайн-курс.' },
  { year: '2024', title: 'Цифрова трансформація', desc: 'Запущено оновлений сайт, система онлайн-подачі заявок та цифровий кабінет слухача.' },
];

const leadership = [
  { name: 'Кравченко Валентина Олегівна', role: 'Директор ЦНО', degree: 'д-р пед. наук, проф.', photo: 'https://i.pravatar.cc/200?img=47' },
  { name: 'Білоус Іван Петрович', role: 'Заступник директора', degree: 'канд. пед. наук, доц.', photo: 'https://i.pravatar.cc/200?img=12' },
  { name: 'Мороз Ольга Сергіївна', role: 'Зав. відділу підвищення кваліфікації', degree: 'канд. пед. наук', photo: 'https://i.pravatar.cc/200?img=44' },
  { name: 'Ткаченко Руслан Миколайович', role: 'Зав. відділу перепідготовки', degree: 'канд. юрид. наук', photo: 'https://i.pravatar.cc/200?img=15' },
];

const documents = [
  { icon: '📄', title: 'Ліцензія МОН України', meta: 'Серія АА №123456 від 15.06.2020' },
  { icon: '📋', title: 'Статут ДНУ ім. Олеся Гончара', meta: 'Зареєстровано МОН України' },
  { icon: '📜', title: 'Положення про ЦНО', meta: 'Затверджено вченою радою ДНУ' },
  { icon: '📑', title: 'Правила прийому 2026', meta: 'Актуальна редакція' },
  { icon: '📝', title: 'Зразок договору про освітні послуги', meta: 'Форма для підвищення кваліфікації' },
  { icon: '💳', title: 'Реквізити для оплати', meta: 'Бухгалтерські реквізити ДНУ' },
];

const partnerNames = [
  'Університет митної справи та фінансів',
  'ДТЕК Дніпровські електромережі',
  'Дніпровська міська рада',
  'Obrii IT Cluster',
  'Придніпровська залізниця',
  'Запорізький НУ',
];

export default function About() {
  const { locale } = useLanguage();
  const [aboutData, setAboutData] = React.useState<null | {
    page_title?: string;
    page_subtitle?: string;
    mission_heading?: string;
    history?: string;
    structure_description?: string;
    team_description?: string;
    mission_checklist?: { text: string }[];
    timeline_items?: { year: string; title: string; description: string; order: number }[];
    leadership_items?: { name: string; role: string; degree: string; photo_url: string; order: number }[];
  }>(null);

  React.useEffect(() => {
    getAboutPage(locale).then(setAboutData).catch(() => undefined);
  }, [locale]);

  const activeTimeline = aboutData?.timeline_items?.length
    ? [...aboutData.timeline_items].sort((a, b) => a.order - b.order)
    : timeline.map((t) => ({ year: t.year, title: t.title, description: t.desc, order: 0 }));

  const activeLeadership = aboutData?.leadership_items?.length
    ? [...aboutData.leadership_items].sort((a, b) => a.order - b.order)
    : leadership.map((l) => ({ name: l.name, role: l.role, degree: l.degree, photo_url: l.photo, order: 0 }));

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-dnu-blue transition-colors">Головна</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">Про центр</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{aboutData?.page_title || 'Про Центр неперервної освіти'}</h1>
          <p className="text-gray-600">{aboutData?.page_subtitle || 'Дніпровський національний університет ім. Олеся Гончара'}</p>
          {/* Sub-nav tabs */}
          <div className="flex gap-1 mt-6 overflow-x-auto pb-1">
            {[
              { label: 'Про нас', href: '/about' },
              { label: 'Персонал', href: '/staff' },
              { label: 'Документи', href: '/documents' },
              { label: 'Партнери', href: '/partners' },
              { label: 'Випускники', href: '/alumni' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  href === '/about'
                    ? 'bg-dnu-dark text-white'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-14 space-y-20">

        {/* Mission Section */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-bold text-dnu-blue uppercase tracking-wider mb-3">{aboutData?.mission_heading || 'Наша місія'}</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
                Якісна неперервна освіта протягом усього професійного шляху
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {aboutData?.structure_description ||
                  'Центр неперервної освіти ДНУ ім. Олеся Гончара — структурний підрозділ університету, що здійснює підвищення кваліфікації, перепідготовку фахівців та підготовку до вступу у заклади вищої освіти.'}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {aboutData?.history ||
                  'Заснований у 1995 році, центр щорічно здійснює підготовку понад 2 500 слухачів за 120+ програмами. Усі документи — державного зразка.'}
              </p>
              <ul className="space-y-3 mb-8">
                {(aboutData?.mission_checklist?.length
                  ? aboutData.mission_checklist.map((c) => c.text)
                  : [
                      'Ліцензована освітня діяльність МОН України',
                      'Документи про освіту державного зразка',
                      'Більше 30 досвідчених викладачів та науковців',
                      'Гнучкий графік: онлайн, офлайн, змішаний',
                    ]
                ).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 flex-wrap">
                {[
                  { value: '30+', label: 'Років діяльності' },
                  { value: '2500+', label: 'Слухачів/рік' },
                  { value: '120+', label: 'Програм' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center px-5 py-4 border-2 border-dnu-blue/20 bg-dnu-light rounded-xl">
                    <div className="text-3xl font-extrabold text-dnu-dark">{value}</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/3 bg-linear-to-br from-dnu-blue to-dnu-dark rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
                  alt="Університет ДНУ"
                  className="w-full h-full object-cover opacity-70 mix-blend-luminosity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-end p-8">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 w-full">
                    <p className="text-dnu-dark font-bold text-sm">ДНУ ім. Олеся Гончара</p>
                    <p className="text-gray-600 text-xs mt-1">пр. Науки, 72 · м. Дніпро</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Історія центру</h2>
          <p className="text-gray-600 mb-10">Ключові етапи розвитку</p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-30 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />
            <div className="space-y-8">
              {activeTimeline.map(({ year, title, description }, i) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className="hidden md:flex items-center justify-end w-27.5 shrink-0">
                    <span className="text-sm font-bold text-dnu-dark">{year}</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-10 shrink-0 relative z-10">
                    <div className={`w-4 h-4 rounded-full border-2 border-dnu-blue ${i === activeTimeline.length - 1 ? 'bg-dnu-blue' : 'bg-white'}`} />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex-1 hover:border-dnu-blue/30 transition-colors">
                    <div className="md:hidden text-xs font-bold text-dnu-blue mb-1">{year}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Керівництво</h2>
              <p className="text-gray-600 text-sm">Команда, що забезпечує якість навчання</p>
            </div>
            <Link to="/staff" className="hidden sm:flex items-center gap-1 text-dnu-blue font-medium text-sm hover:underline">
              Весь персонал <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeLeadership.map((person) => (
              <div key={person.name} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md transition-all">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-sm">
                  <img src={person.photo_url} alt={person.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{person.name}</h3>
                <p className="text-dnu-blue text-xs font-semibold mb-1">{person.role}</p>
                <p className="text-gray-400 text-xs">{person.degree}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center sm:hidden">
            <Link to="/staff" className="inline-flex items-center gap-1 text-dnu-blue font-medium text-sm">
              Весь персонал <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Documents */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Документи та ліцензії</h2>
            <p className="text-gray-600 text-sm">Правові підстави діяльності центру</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(({ icon, title, meta }) => (
              <Link key={title} to="/documents" className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:border-dnu-blue/40 hover:shadow-sm transition-all group">
                <span className="text-2xl shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-dnu-blue transition-colors">{title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{meta}</p>
                  <span className="flex items-center gap-1.5 text-xs text-dnu-blue font-medium">
                    <FileText className="w-3.5 h-3.5" /> Переглянути в розділі документів
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/documents" className="inline-flex items-center gap-1 text-dnu-blue font-medium text-sm hover:underline">
              Всі документи <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Partner Logos */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Партнери</h2>
              <p className="text-gray-600 text-sm">Організації та установи, з якими ми співпрацюємо</p>
            </div>
            <Link to="/partners" className="hidden sm:flex items-center gap-1 text-dnu-blue font-medium text-sm hover:underline">
              Всі партнери <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {partnerNames.map((name) => (
              <div key={name} className="flex items-center justify-center h-16 px-5 border border-gray-200 rounded-xl bg-gray-50 text-xs text-gray-500 font-medium text-center hover:border-dnu-blue/40 hover:bg-white transition-colors min-w-35">
                <Building2 className="w-4 h-4 mr-2 text-gray-300 shrink-0" />
                <span className="leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
