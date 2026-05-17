import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, GraduationCap, School, Handshake, Download, ArrowRight, ExternalLink } from 'lucide-react';
import { getPartners, getPartnersPage } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

interface Partner {
  id: number;
  name: string;
  city: string;
  type: string;
  tag: string;
  agreement: string;
}

const educationalPartners: Partner[] = [
  { id: 1, name: 'Університет митної справи та фінансів', city: 'Дніпро', type: 'Університет', tag: 'ЗВО', agreement: 'Меморандум про співпрацю' },
  { id: 2, name: 'Дніпровський державний технічний університет', city: 'Кам\'янське', type: 'Університет', tag: 'ЗВО', agreement: 'Договір про співпрацю' },
  { id: 3, name: 'Запорізький національний університет', city: 'Запоріжжя', type: 'Університет', tag: 'ЗВО', agreement: 'Меморандум про співпрацю' },
  { id: 4, name: 'Ліцей №100 м. Дніпра', city: 'Дніпро', type: 'Ліцей', tag: 'Ліцей', agreement: 'Підготовчі курси НМТ' },
  { id: 5, name: 'Криворізький державний педагогічний університет', city: 'Кривий Ріг', type: 'Університет', tag: 'ЗВО', agreement: 'Договір про співпрацю' },
  { id: 6, name: 'Навчально-науковий інститут неперервної освіти НПУ', city: 'Київ', type: 'Інститут', tag: 'ЗВО', agreement: 'Меморандум' },
];

const enterprisePartners = [
  { id: 1, name: 'ДТЕК Дніпровські електромережі', type: 'Корпоративне навчання' },
  { id: 2, name: 'Придніпровська залізниця', type: 'Підвищення кваліфікації' },
  { id: 3, name: 'Міська рада м. Дніпра', type: 'Підготовка держслужбовців' },
  { id: 4, name: 'Дніпропетровська ОДА', type: 'Підвищення кваліфікації' },
  { id: 5, name: 'Obrii IT Cluster', type: 'Корпоративне навчання' },
  { id: 6, name: 'МРІЯ Агрохолдинг', type: 'Перепідготовка кадрів' },
  { id: 7, name: 'АТ «Мотор Січ»', type: 'Корпоративне навчання' },
  { id: 8, name: 'Центр занятості м. Дніпра', type: 'Перенавчання безробітних' },
];

const stats = [
  { value: '45+', label: 'Організацій-партнерів', icon: Handshake },
  { value: '12', label: 'Підприємств-замовників', icon: Building2 },
  { value: '8', label: 'ЗВО-партнерів', icon: GraduationCap },
  { value: '15+', label: 'Шкіл та ліцеїв', icon: School },
];

export default function Partners() {
  const { locale } = useLanguage();
  const [eduPartners, setEduPartners] = React.useState<Partner[]>(educationalPartners);
  const [businessPartners, setBusinessPartners] = React.useState(enterprisePartners);
  const [pageData, setPageData] = React.useState<null | {
    page_title?: string;
    page_intro?: string;
    cta_title?: string;
    cta_text?: string;
    stats?: { value: string; label: string; icon_key: string; order: number }[];
    benefits?: { title: string; description: string; order: number }[];
  }>(null);

  React.useEffect(() => {
    getPartnersPage(locale).then(setPageData).catch(() => undefined);
  }, [locale]);

  React.useEffect(() => {
    getPartners(locale)
      .then((items) => {
        if (!items.length) return;
        const mapped = items.map((item, idx) => ({
          id: Number(item.id ?? idx + 1),
          name: item.name || 'Партнер',
          city: item.city || 'Дніпро',
          type: item.type || 'Організація',
          tag: item.type === 'university' ? 'ЗВО' : 'Партнер',
          agreement: item.agreement || 'Договір про співпрацю',
        }));
        setEduPartners(mapped.filter((p) => p.type === 'university' || p.tag === 'ЗВО'));
        setBusinessPartners(
          mapped.map((p) => ({
            id: p.id,
            name: p.name,
            type: p.type,
          }))
        );
      })
      .catch(() => undefined);
  }, [locale]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <nav className="text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-dnu-blue transition-colors">Головна</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">Партнери</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageData?.page_title || 'Партнери та співробітники'}</h1>
          <p className="text-gray-600 max-w-2xl">
            {pageData?.page_intro || 'Організації та установи, з якими ЦНО ДНУ здійснює спільну освітню та наукову діяльність'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="border-b border-gray-100 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {(pageData?.stats?.length
              ? [...pageData.stats].sort((a, b) => a.order - b.order)
              : stats.map((s) => ({ value: s.value, label: s.label, icon_key: '', order: 0 }))
            ).map(({ value, label }) => (
              <div key={label} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <Handshake className="w-8 h-8 text-dnu-blue mx-auto mb-3" />
                <div className="text-3xl font-extrabold text-dnu-dark mb-1">{value}</div>
                <div className="text-sm text-gray-600 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Partners */}
      <section className="py-14 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-6 h-6 text-dnu-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Освітні заклади-партнери</h2>
            </div>
            <p className="text-gray-600 text-sm">Університети, інститути та школи, з якими налагоджено офіційну співпрацю</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {eduPartners.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md hover:border-dnu-blue/30 transition-all">
                <div className="w-16 h-16 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-7 h-7 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{p.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">м. {p.city} · {p.agreement}</p>
                  <span className="text-xs bg-blue-50 text-dnu-blue px-2.5 py-0.5 rounded-full border border-blue-100 font-medium">
                    {p.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Partners */}
      <section className="py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-dnu-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Підприємства та організації</h2>
            </div>
            <p className="text-gray-600 text-sm">Підприємства, що направляють працівників на підвищення кваліфікації та перепідготовку</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessPartners.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-xl p-5 bg-white text-center hover:shadow-md hover:border-dnu-blue/30 transition-all">
                <div className="w-16 h-12 border border-dashed border-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-900 text-xs mb-1 leading-tight">{p.name}</h3>
                <p className="text-xs text-gray-500">{p.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits of Partnership */}
      <section className="py-14 bg-dnu-light border-t border-dnu-blue/10">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Переваги партнерства</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎓',
                title: 'Корпоративне навчання',
                desc: 'Розробимо індивідуальну програму підвищення кваліфікації спеціально для ваших співробітників.',
              },
              {
                icon: '📜',
                title: 'Документи держзразка',
                desc: 'Після завершення навчання слухачі отримують офіційні документи державного зразка ДНУ.',
              },
              {
                icon: '💼',
                title: 'Гнучкий формат',
                desc: 'Навчання в зручний для підприємства час — виїзні заняття, онлайн або змішаний формат.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-dnu-blue/10 shadow-sm">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-16 bg-dnu-dark text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Стати партнером ЦНО ДНУ</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Запрошуємо підприємства, установи та організації до співпраці. Ми розробимо
            індивідуальну програму корпоративного навчання для ваших співробітників.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contacts"
              className="inline-flex items-center justify-center gap-2 bg-white text-dnu-dark font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Зв'язатися з нами <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              <Download className="w-4 h-4" /> Завантажити презентацію
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
