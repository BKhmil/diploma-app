import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ClipboardList, BookOpen, ArrowRight, Check, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { getApplicationsStats, getApplications, getStudents, type StrapiApplication, type AppStatus } from '../../services/strapi';

const STATUS_LABELS: Record<AppStatus, string> = { new: 'Нова', processing: 'Обробка', accepted: 'Прийнята', rejected: 'Відмова' };
const STATUS_COLORS: Record<AppStatus, string> = {
  new:        'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100   text-blue-800',
  accepted:   'bg-green-100  text-green-800',
  rejected:   'bg-red-100    text-red-800',
};

function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400" /> {msg}
    </div>
  );
}

function downloadReport(stats: Record<string, number>, studentCount: number) {
  const rows = [
    'Звіт ЦНО ДНУ — ' + new Date().toLocaleDateString('uk-UA'),
    '',
    'Метрика,Значення',
    `Активних слухачів,${studentCount}`,
    `Всього заявок,${stats.total ?? 0}`,
    `Нових заявок,${stats.new ?? 0}`,
    `В обробці,${stats.processing ?? 0}`,
    `Прийнятих,${stats.accepted ?? 0}`,
    `Відмов,${stats.rejected ?? 0}`,
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'report.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [toast, setToast]           = useState<string | null>(null);
  const [stats, setStats]           = useState<Record<string, number>>({});
  const [studentCount, setStudentCount] = useState(0);
  const [recentApps, setRecentApps] = useState<StrapiApplication[]>([]);
  const [loading, setLoading]       = useState(true);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const load = async () => {
    setLoading(true);
    try {
      const [s, recent, students] = await Promise.all([
        getApplicationsStats(),
        getApplications({ pageSize: 5 }),
        getStudents(),
      ]);
      setStats(s);
      setRecentApps(recent.data);
      setStudentCount(students.filter(s => s.status === 'active').length);
    } catch {
      notify('❌ Помилка завантаження даних');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = [
    {
      label: 'Активних слухачів',
      value: loading ? '...' : String(studentCount),
      delta: 'зараз активних',
      up: true,
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Нових заявок',
      value: loading ? '...' : String(stats.new ?? 0),
      delta: `всього: ${stats.total ?? 0}`,
      up: (stats.new ?? 0) > 0,
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Прийнятих',
      value: loading ? '...' : String(stats.accepted ?? 0),
      delta: `відмов: ${stats.rejected ?? 0}`,
      up: null,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'В обробці',
      value: loading ? '...' : String(stats.processing ?? 0),
      delta: 'очікують рішення',
      up: null,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-orange-600 bg-orange-50',
    },
  ];

  const quickActions: { icon: string; label: string; action: () => void }[] = [
    { icon: '📋', label: 'Нова програма',   action: () => navigate('/admin/programs') },
    { icon: '👤', label: 'Додати слухача',  action: () => navigate('/admin/users') },
    { icon: '📋', label: 'Всі заявки',      action: () => navigate('/admin/applications') },
    { icon: '📤', label: 'Генерувати звіт', action: () => { downloadReport(stats, studentCount); notify('📥 Звіт завантажується...'); } },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} />}

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Панель управління</h1>
          <p className="text-xs text-gray-500 mt-0.5">Дані в реальному часі</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Оновити
          </button>
          <button onClick={() => { downloadReport(stats, studentCount); notify('📥 Звіт завантажується...'); }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
            📤 Звіт
          </button>
          <Link to="/admin/applications"
            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-dnu-blue text-white rounded-lg hover:bg-dnu-dark transition-colors font-semibold">
            Всі заявки
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, up, icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', color)}>{icon}</div>
              {up !== null && <TrendingUp className={clsx('w-4 h-4', up ? 'text-green-500' : 'text-gray-300')} />}
            </div>
            <div className="text-2xl font-extrabold text-gray-900 mb-1">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-xs mt-2 font-medium text-gray-400">{delta}</div>
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
          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">Завантаження...</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">Заявок немає</div>
              )}
              {recentApps.map(app => (
                <Link key={app.id} to="/admin/applications"
                  className="grid grid-cols-[1fr_1.4fr_60px_70px] items-center px-5 py-3 text-xs hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 truncate">{app.full_name}</span>
                  <span className="text-gray-500 truncate">{app.program_name ?? '—'}</span>
                  <span className="text-gray-400">{new Date(app.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}</span>
                  <span><span className={clsx('px-2 py-0.5 rounded text-[10px] font-bold', STATUS_COLORS[app.status])}>{STATUS_LABELS[app.status]}</span></span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Статуси заявок</h3>
          </div>
          <div className="px-5 py-4 space-y-3">
            {([
              { label: 'Нові',       key: 'new',        color: 'bg-yellow-400' },
              { label: 'В обробці',  key: 'processing', color: 'bg-blue-400' },
              { label: 'Прийняті',   key: 'accepted',   color: 'bg-green-400' },
              { label: 'Відмови',    key: 'rejected',   color: 'bg-red-400' },
            ] as const).map(({ label, key, color }) => {
              const count = stats[key] ?? 0;
              const total = stats.total || 1;
              return (
                <div key={key} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-gray-700 shrink-0">{label}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={clsx('h-full rounded-full', color)} style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right font-semibold text-gray-700 shrink-0">{count}</span>
                </div>
              );
            })}
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
