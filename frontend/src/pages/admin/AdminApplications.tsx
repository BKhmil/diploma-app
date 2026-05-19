import React, { useState, useEffect, useCallback } from 'react';
import { Download, Search, X, Check, Mail, Trash2, Eye, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import {
  getApplications,
  updateApplication,
  deleteApplication,
  type StrapiApplication,
  type AppStatus,
} from '../../services/strapi';

const STATUS_LABELS: Record<AppStatus, string> = {
  new: 'Нова',
  processing: 'Обробка',
  accepted: 'Прийнята',
  rejected: 'Відмова',
};
const STATUS_COLORS: Record<AppStatus, string> = {
  new:        'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100   text-blue-800   border-blue-200',
  accepted:   'bg-green-100  text-green-800  border-green-200',
  rejected:   'bg-red-100    text-red-800    border-red-200',
};

type TabFilter = 'all' | AppStatus;
const TABS: { id: TabFilter; label: string }[] = [
  { id: 'all',        label: 'Всі' },
  { id: 'new',        label: 'Нові' },
  { id: 'processing', label: 'В обробці' },
  { id: 'accepted',   label: 'Прийняті' },
  { id: 'rejected',   label: 'Відмови' },
];

function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400" /> {msg}
    </div>
  );
}

function exportCSV(apps: StrapiApplication[]) {
  const header = '#,Ім\'я,Email,Програма,Дата,Фінансування,Статус';
  const rows = apps.map(a =>
    `${a.num},"${a.full_name}","${a.email}","${a.program_name ?? ''}","${new Date(a.createdAt).toLocaleDateString('uk-UA')}","${a.financing ?? ''}","${STATUS_LABELS[a.status]}"`
  );
  const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'applications.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminApplications() {
  const [apps, setApps]           = useState<StrapiApplication[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<TabFilter>('all');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<Set<number>>(new Set());
  const [drawerApp, setDrawerApp] = useState<StrapiApplication | null>(null);
  const [comment, setComment]     = useState('');
  const [toast, setToast]         = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [savingComment, setSavingComment] = useState(false);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getApplications({ status: tab, search, pageSize: 100 });
      setApps(result.data);
      setTotal(result.total);
      if (drawerApp) {
        const fresh = result.data.find(a => a.id === drawerApp.id);
        if (fresh) setDrawerApp(fresh);
      }
    } catch {
      notify('❌ Помилка завантаження заявок');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (ids: number[], status: AppStatus) => {
    try {
      await Promise.all(ids.map(id => updateApplication(id, { status })));
      setApps(prev => prev.map(a => ids.includes(a.id) ? { ...a, status } : a));
      if (drawerApp && ids.includes(drawerApp.id)) setDrawerApp(prev => prev ? { ...prev, status } : null);
      setSelected(new Set());
      notify(status === 'accepted' ? `✅ Прийнято: ${ids.length}` : `❌ Відхилено: ${ids.length}`);
    } catch {
      notify('❌ Помилка оновлення статусу');
    }
  };

  const handleSaveComment = async () => {
    if (!drawerApp) return;
    setSavingComment(true);
    try {
      await updateApplication(drawerApp.id, { manager_comment: comment });
      setApps(prev => prev.map(a => a.id === drawerApp.id ? { ...a, manager_comment: comment } : a));
      setDrawerApp(prev => prev ? { ...prev, manager_comment: comment } : null);
      notify('✅ Коментар збережено');
    } catch {
      notify('❌ Помилка збереження коментаря');
    } finally {
      setSavingComment(false);
    }
  };

  const handleDeleteSelected = async () => {
    const ids = [...selected];
    try {
      await Promise.all(ids.map(id => deleteApplication(id)));
      setApps(prev => prev.filter(a => !ids.includes(a.id)));
      if (drawerApp && ids.includes(drawerApp.id)) setDrawerApp(null);
      setSelected(new Set());
      setDeleteConfirm(false);
      notify(`🗑 Видалено: ${ids.length} заявок`);
    } catch {
      notify('❌ Помилка видалення');
    }
  };

  const openDrawer = (app: StrapiApplication) => {
    setDrawerApp(app);
    setComment(app.manager_comment ?? '');
  };

  const toggleSelect = (id: number) => {
    const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s);
  };
  const toggleAll = () =>
    selected.size === apps.length && apps.length > 0
      ? setSelected(new Set())
      : setSelected(new Set(apps.map(a => a.id)));

  const tabCount = (t: TabFilter) => t === 'all' ? total : apps.filter(a => a.status === t).length;
  const newCount = apps.filter(a => a.status === 'new').length;

  return (
    <div className="flex gap-0 h-full min-h-0">
      {toast && <Toast msg={toast} />}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-center">
            <div className="text-3xl mb-3">🗑</div>
            <h3 className="font-bold text-gray-900 mb-2">Видалити {selected.size} заявок?</h3>
            <p className="text-sm text-gray-500 mb-5">Цю дію не можна скасувати.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">Скасувати</button>
              <button onClick={handleDeleteSelected} className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">Видалити</button>
            </div>
          </div>
        </div>
      )}

      {/* Main table */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Заявки на навчання</h1>
            <p className="text-xs text-gray-500 mt-1">Всього: {total} заявок · Нових: {newCount}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Оновити
            </button>
            <button onClick={() => exportCSV(apps)} className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Експорт CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 mb-4 flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Пошук за ім'ям або email..."
              className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-dnu-blue w-56" />
          </div>
          <button onClick={() => { setSearch(''); setTab('all'); }}
            className="ml-auto px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            Скинути
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={clsx('px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors',
                tab === id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800')}>
              {label} ({tabCount(id)})
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 mb-3 text-xs bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
            <span className="text-gray-600">Вибрано: <strong>{selected.size}</strong></span>
            <button onClick={() => updateStatus([...selected], 'accepted')} className="flex items-center gap-1 px-2.5 py-1 border border-gray-300 bg-white rounded hover:bg-green-50 hover:border-green-300">
              <Check className="w-3 h-3 text-green-600" /> Прийняти
            </button>
            <button onClick={() => updateStatus([...selected], 'rejected')} className="flex items-center gap-1 px-2.5 py-1 border border-gray-300 bg-white rounded hover:bg-red-50 hover:border-red-300">
              <X className="w-3 h-3 text-red-500" /> Відхилити
            </button>
            <button onClick={() => {
              const emails = apps.filter(a => selected.has(a.id)).map(a => a.email).join(',');
              window.open(`mailto:${emails}?subject=ЦНО ДНУ — Ваша заявка`);
            }} className="flex items-center gap-1 px-2.5 py-1 border border-gray-300 bg-white rounded hover:bg-blue-50 hover:border-blue-300">
              <Mail className="w-3 h-3 text-blue-500" /> Email
            </button>
            <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-1 px-2.5 py-1 border border-red-200 text-red-600 bg-white rounded hover:bg-red-50 ml-auto">
              <Trash2 className="w-3 h-3" /> Видалити
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">Завантаження...</div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="w-9 px-3 py-3">
                    <input type="checkbox" title="Вибрати всі" checked={selected.size === apps.length && apps.length > 0} onChange={toggleAll} className="rounded" />
                  </th>
                  {['#', 'Заявник', 'Програма', 'Категорія', 'Дата', 'Фінансування', 'Статус', 'Дії'].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {apps.map(app => (
                  <tr key={app.id} onClick={() => openDrawer(app)}
                    className={clsx('hover:bg-gray-50 transition-colors cursor-pointer',
                      selected.has(app.id) && 'bg-yellow-50',
                      drawerApp?.id === app.id && 'bg-blue-50')}>
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" title="Вибрати" checked={selected.has(app.id)} onChange={() => toggleSelect(app.id)} className="rounded" />
                    </td>
                    <td className="px-3 py-3 text-gray-400">#{app.num ?? app.id}</td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-gray-900">{app.full_name}</div>
                      <div className="text-gray-400">{app.email}</div>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{app.program_name ?? '—'}</td>
                    <td className="px-3 py-3">
                      {app.category && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{app.category}</span>}
                    </td>
                    <td className="px-3 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-3 py-3 text-gray-700">{app.financing ?? '—'}</td>
                    <td className="px-3 py-3">
                      <span className={clsx('px-2 py-0.5 rounded border text-xs font-bold', STATUS_COLORS[app.status])}>
                        {STATUS_LABELS[app.status]}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={e => { e.stopPropagation(); openDrawer(app); }}
                        className="flex items-center gap-1 px-2.5 py-1 border border-gray-200 rounded bg-white hover:border-dnu-blue hover:text-dnu-blue transition-colors text-xs">
                        <Eye className="w-3 h-3" /> Перегляд
                      </button>
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && (
                  <tr><td colSpan={9} className="px-5 py-10 text-center text-gray-400 text-sm">Заявок не знайдено</td></tr>
                )}
              </tbody>
            </table>
          )}

          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <span>Показано {apps.length} з {total}</span>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerApp && (
        <aside className="w-80 shrink-0 ml-5 bg-white border border-gray-200 rounded-xl overflow-hidden self-start sticky top-0">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900">Заявка #{drawerApp.num ?? drawerApp.id}</h2>
            <button onClick={() => setDrawerApp(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <span className={clsx('px-2.5 py-1 rounded border text-xs font-bold', STATUS_COLORS[drawerApp.status])}>
              {STATUS_LABELS[drawerApp.status]}
            </span>
            {([
              { label: 'Заявник',      value: drawerApp.full_name },
              { label: 'Email',        value: drawerApp.email },
              { label: 'Телефон',      value: drawerApp.phone },
              { label: 'Програма',     value: drawerApp.program_name },
              { label: 'Організація',  value: drawerApp.organization },
              { label: 'Місто',        value: drawerApp.city },
              { label: 'Фінансування', value: drawerApp.financing },
              { label: 'Дата подачі',  value: new Date(drawerApp.createdAt).toLocaleString('uk-UA') },
            ] as const).filter(r => r.value).map(({ label, value }) => (
              <div key={label}>
                <div className="text-gray-400 uppercase tracking-wider font-bold text-[10px] mb-0.5">{label}</div>
                <div className="text-gray-900">{value}</div>
              </div>
            ))}
            <hr className="border-gray-100" />
            <div>
              <div className="text-gray-400 uppercase tracking-wider font-bold text-[10px] mb-2">Коментар менеджера</div>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Залишити коментар..."
                className="w-full h-16 text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-dnu-blue" />
              <button onClick={handleSaveComment} disabled={savingComment}
                className="mt-1 w-full py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                {savingComment ? 'Збереження...' : 'Зберегти коментар'}
              </button>
            </div>
            <div className="space-y-2 pt-1">
              <button onClick={() => updateStatus([drawerApp.id], 'processing')}
                disabled={drawerApp.status === 'processing' || drawerApp.status === 'accepted'}
                className="w-full py-2.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                В обробку
              </button>
              <button onClick={() => updateStatus([drawerApp.id], 'accepted')}
                disabled={drawerApp.status === 'accepted'}
                className="w-full py-2.5 bg-dnu-blue text-white text-xs font-bold rounded-lg hover:bg-dnu-dark transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                <Check className="w-3.5 h-3.5" /> Прийняти заявку
              </button>
              <button onClick={() => window.open(`mailto:${drawerApp.email}?subject=ЦНО ДНУ — Ваша заявка #${drawerApp.num}`)}
                className="w-full py-2.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:border-dnu-blue hover:text-dnu-blue transition-colors flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Відповісти email
              </button>
              <button onClick={() => updateStatus([drawerApp.id], 'rejected')}
                disabled={drawerApp.status === 'rejected'}
                className="w-full py-2.5 border-2 border-red-300 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                <X className="w-3.5 h-3.5" /> Відхилити
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
