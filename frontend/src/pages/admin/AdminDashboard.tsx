import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, ClipboardList, BookOpen, DollarSign, ArrowRight, Check } from 'lucide-react';
import { clsx } from 'clsx';

type AppStatus = 'new' | 'processing' | 'accepted' | 'rejected';

const STATUS_LABELS: Record<AppStatus, string> = { new: 'Нова', processing: 'Обробка', accepted: 'Прийнята', rejected: 'Відмова' };
const STATUS_COLORS: Record<AppStatus, string> = {
  new:        'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100   text-blue-800',
  accepted:   'bg-green-100  text-green-800',
  rejected:   'bg-red-100    text-red-800',
};

const kpis = [
  { label: 'Активних слухачів', value: '234', delta: '+18 цього тижня', up: true,  icon: <Users       className="w-5 h-5" />, color: 'text-blue-600   bg-blue-50' },
  { label: 'Нових заявок',      value: '12',  delta: '+4 сьогодні',     up: true,  icon: <ClipboardList className="w-5 h-5" />, color: 'text-green-600  bg-green-50' },
  { label: 'Активних програм',  value: '47',  delta: 'без змін',        up: null,  icon: <BookOpen     className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50' },
  { label: 'Доходів (місяць)',  value: '₴124к', delta: '–8% vs минулий', up: false, icon: <DollarSign  className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50' },
];

const recentApps: { name: string; program: string; date: string; status: AppStatus }[] = [
  { name: 'Сидоренко О.В.',  program: 'Педагогічна майстерність', date: '15 лют', status: 'new' },
  { name: 'Ковальчук М.І.',  program: 'Психологія (магістр)',      date: '14 лют', status: 'processing' },
  { name: 'Петренко В.О.',   program: 'НМТ Математика',           date: '14 лют', status: 'accepted' },
  { name: 'Іщенко А.Р.',     program: 'Охорона праці',            date: '13 лют', status: 'accepted' },
  { name: 'Бондаренко Р.С.', program: 'Менеджмент (магістр)',     date: '12 лют', status: 'rejected' },
];

const popularity = [
  { name: 'Педагог. майстерність', count: 40 },
  { name: 'Психологія',            count: 30 },
  { name: 'НМТ Математика',        count: 27 },
  { name: 'Менеджмент',            count: 23 },
  { name: 'Охорона праці',         count: 19 },
  { name: 'НМТ Укр. мова',         count: 15 },
  { name: 'Інклюзивна освіта',     count: 11 },
];

const events: { date: string; title: string; status: 'soon' | 'new' | 'ready' }[] = [
  { date: '20 лют', title: 'Початок групи «Педагогічна майстерність» (весна)', status: 'soon' },
  { date: '22 лют', title: 'Дедлайн прийому документів — НМТ курси',          status: 'new' },
  { date: '1 бер',  title: 'Випуск групи «Менеджмент», вручення дипломів',    status: 'ready' },
];
const EVENT_COLORS  = { soon: 'bg-blue-100 text-blue-700',   new: 'bg-yellow-100 text-yellow-700', ready: 'bg-green-100 text-green-700' };
const EVENT_LABELS  = { soon: 'Скоро',                        new: 'Новий',                         ready: 'Готово' };

function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400" /> {msg}
    </div>
  );
}

// Dummy CSV report download
function downloadReport() {
  const rows = ['Звіт ЦНО ДНУ — ' + new Date().toLocaleDateString('uk-UA'), '', 'Метрика,Значення',
    'Активних слухачів,234', 'Нових заявок,12', 'Активних програм,47', 'Доходів (місяць),₴124 000'];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'report.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const quickActions: { icon: string; label: string; action: () => void }[] = [
    { icon: '📋', label: 'Нова програма',    action: () => navigate('/admin/programs') },
    { icon: '👤', label: 'Додати слухача',   action: () => navigate('/admin/users') },
    { icon: '📰', label: 'Нова новина',      action: () => notify('📰 Редактор новин відкривається...') },
    { icon: '📤', label: 'Генерувати звіт',  action: () => { downloadReport(); notify('📥 Звіт завантажується...'); } },
    { icon: '📅', label: 'Новий розклад',    action: () => navigate('/admin/programs') },
    { icon: '📁', label: 'Завантажити doc',  action: () => notify('📁 Документ завантажується...') },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} />}

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Панель управління</h1>
          <p className="text-xs text-gray-500 mt-0.5">Весна 2026 · Оновлено щойно</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { downloadReport(); notify('📥 Звіт завантажується...'); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            📤 Звіт
          </button>
          <Link to="/admin/applications"
            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-dnu-blue text-white rounded-lg hover:bg-dnu-dark transition-colors font-semibold">
            + Нова заявка
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, up, icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', color)}>{icon}</div>
              {up !== null && (up ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-400" />)}
            </div>
            <div className="text-2xl font-extrabold text-gray-900 mb-1">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className={clsx('text-xs mt-2 font-medium', up === true ? 'text-green-600' : up === false ? 'text-red-500' : 'text-gray-400')}>
              {up === true && '↑ '}{up === false && '↓ '}{delta}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent applications */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Останні заявки</h3>
            <Link to="/admin/applications" className="text-xs text-dnu-blue hover:underline flex items-center gap-1">
              Всі заявки <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApps.map(({ name, program, date, status }) => (
              <Link key={name} to="/admin/applications"
                className="grid grid-cols-[1fr_1.4fr_60px_70px] items-center px-5 py-3 text-xs hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900 truncate">{name}</span>
                <span className="text-gray-500 truncate">{program}</span>
                <span className="text-gray-400">{date}</span>
                <span><span className={clsx('px-2 py-0.5 rounded text-[10px] font-bold', STATUS_COLORS[status])}>{STATUS_LABELS[status]}</span></span>
              </Link>
            ))}
          </div>
        </div>

        {/* Program popularity */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Популярність програм</h3>
            <Link to="/admin/programs" className="text-xs text-dnu-blue hover:underline">Всі програми →</Link>
          </div>
          <div className="px-5 py-4 space-y-3">
            {popularity.map(({ name, count }) => (
              <div key={name} className="flex items-center gap-3 text-xs">
                <span className="w-36 text-gray-700 truncate shrink-0">{name}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-dnu-dark rounded-full" style={{ width: `${(count / 40) * 100}%` }} />
                </div>
                <span className="w-6 text-right font-semibold text-gray-700 shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming events */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Найближчі події</h3>
            <Link to="/admin/programs" className="text-xs text-dnu-blue hover:underline">Розклад →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {events.map(({ date, title, status }) => (
              <div key={title} className="grid grid-cols-[60px_1fr_70px] items-center px-5 py-3 text-xs gap-2">
                <span className="text-gray-400 font-medium">{date}</span>
                <span className="text-gray-800">{title}</span>
                <span><span className={clsx('px-2 py-0.5 rounded text-[10px] font-bold', EVENT_COLORS[status])}>{EVENT_LABELS[status]}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Швидкі дії</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {quickActions.map(({ icon, label, action }) => (
              <button key={label} onClick={action}
                className="flex items-center gap-2 p-3.5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-dnu-blue hover:bg-dnu-light text-xs font-bold text-gray-700 hover:text-dnu-dark transition-all text-left">
                <span className="text-lg">{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
