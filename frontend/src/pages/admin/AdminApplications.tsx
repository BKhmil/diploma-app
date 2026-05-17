import React, { useState } from 'react';
import { Download, Search, X, Check, Mail, Trash2, Eye } from 'lucide-react';
import { clsx } from 'clsx';

type AppStatus = 'new' | 'processing' | 'accepted' | 'rejected';

interface Application {
  id: string;
  num: number;
  name: string;
  email: string;
  program: string;
  category: string;
  date: string;
  financing: string;
  status: AppStatus;
}

const INITIAL: Application[] = [
  { id: 'app-1045', num: 1045, name: 'Сидоренко Ольга Василівна',   email: 'sidorenko@gmail.com',    program: 'Педагогічна майстерність', category: 'ПК',        date: '15 лют 2026', financing: 'Контракт',     status: 'new' },
  { id: 'app-1044', num: 1044, name: 'Ковальчук Микола Іванович',    email: 'kovalchuk@ukr.net',       program: 'Психологія',               category: 'Перепідг.', date: '14 лют 2026', financing: 'Бюджет',       status: 'processing' },
  { id: 'app-1043', num: 1043, name: 'Петренко Василь Олексійович',  email: 'petrenko@gmail.com',      program: 'НМТ Математика',           category: 'НМТ',       date: '14 лют 2026', financing: 'Контракт',     status: 'accepted' },
  { id: 'app-1042', num: 1042, name: 'Іщенко Андрій Романович',      email: 'ischenko@meta.ua',        program: 'Охорона праці в освіті',   category: 'ПК',        date: '13 лют 2026', financing: 'Роботодавець', status: 'accepted' },
  { id: 'app-1041', num: 1041, name: 'Бондаренко Руслан Сергійович', email: 'bondarenko@dnu.dp.ua',   program: 'Менеджмент організацій',   category: 'Перепідг.', date: '12 лют 2026', financing: 'Контракт',     status: 'rejected' },
  { id: 'app-1040', num: 1040, name: 'Мороз Наталія Василівна',      email: 'moroz@ukr.net',           program: 'Інклюзивна освіта',        category: 'ПК',        date: '11 лют 2026', financing: 'Бюджет',       status: 'new' },
  { id: 'app-1039', num: 1039, name: 'Захаренко Ірина Петрівна',     email: 'zaharenko@gmail.com',     program: 'Право',                    category: 'Перепідг.', date: '10 лют 2026', financing: 'Контракт',     status: 'accepted' },
  { id: 'app-1038', num: 1038, name: 'Ткаченко Руслан Миколайович',  email: 'tkachenko@gmail.com',     program: 'НМТ Українська мова',      category: 'НМТ',       date: '09 лют 2026', financing: 'Контракт',     status: 'processing' },
];

const STATUS_LABELS: Record<AppStatus, string> = { new: 'Нова', processing: 'Обробка', accepted: 'Прийнята', rejected: 'Відмова' };
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

// ── New Application Modal ────────────────────────────────────────────────────
function NewAppModal({ onClose, onSave }: { onClose: () => void; onSave: (a: Application) => void }) {
  const [form, setForm] = useState({ name: '', email: '', program: '', financing: 'Контракт' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.program) return;
    onSave({
      id: 'app-' + Date.now(),
      num: Math.floor(1000 + Math.random() * 9000),
      name: form.name,
      email: form.email,
      program: form.program,
      category: 'ПК',
      date: new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' }),
      financing: form.financing,
      status: 'new',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">Нова заявка</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {([
            { label: "Повне ім'я", key: 'name', placeholder: 'Прізвище Ім\'я По-батькові' },
            { label: 'Email',     key: 'email', placeholder: 'email@example.com' },
            { label: 'Програма',  key: 'program', placeholder: 'Назва програми' },
          ] as const).map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
              <input
                required
                value={form[key]}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Фінансування</label>
            <select value={form.financing} onChange={set('financing')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue bg-white">
              <option>Контракт</option><option>Бюджет</option><option>Роботодавець</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Скасувати</button>
            <button type="submit" className="flex-1 py-2.5 bg-dnu-blue text-white rounded-xl text-sm font-bold hover:bg-dnu-dark transition-colors">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400" /> {msg}
    </div>
  );
}

// ── CSV export helper ────────────────────────────────────────────────────────
function exportCSV(apps: Application[]) {
  const header = '#,Ім\'я,Email,Програма,Дата,Фінансування,Статус';
  const rows = apps.map(a => `${a.num},"${a.name}","${a.email}","${a.program}","${a.date}","${a.financing}","${STATUS_LABELS[a.status]}"`);
  const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'applications.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminApplications() {
  const [apps, setApps]           = useState<Application[]>(INITIAL);
  const [tab, setTab]             = useState<TabFilter>('all');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [drawerApp, setDrawerApp] = useState<Application | null>(INITIAL[0]);
  const [comment, setComment]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = apps.filter(a => {
    const matchTab    = tab === 'all' || a.status === tab;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const toggleSelect = (id: string) => {
    const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s);
  };
  const toggleAll = () => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(a => a.id)));

  const updateStatus = (ids: string[], status: AppStatus) => {
    setApps(prev => prev.map(a => ids.includes(a.id) ? { ...a, status } : a));
    if (drawerApp && ids.includes(drawerApp.id)) setDrawerApp(prev => prev ? { ...prev, status } : null);
    setSelected(new Set());
    notify(status === 'accepted' ? `✅ Прийнято: ${ids.length} заявок` : `❌ Відхилено: ${ids.length} заявок`);
  };

  const deleteSelected = () => {
    const ids = [...selected];
    setApps(prev => prev.filter(a => !ids.includes(a.id)));
    if (drawerApp && ids.includes(drawerApp.id)) setDrawerApp(null);
    setSelected(new Set());
    setDeleteConfirm(false);
    notify(`🗑 Видалено: ${ids.length} заявок`);
  };

  const tabCount = (t: TabFilter) => t === 'all' ? apps.length : apps.filter(a => a.status === t).length;

  return (
    <div className="flex gap-0 h-full min-h-0">
      {showModal && (
        <NewAppModal
          onClose={() => setShowModal(false)}
          onSave={a => { setApps(prev => [a, ...prev]); notify('✅ Заявку додано'); }}
        />
      )}
      {toast && <Toast msg={toast} />}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-center">
            <div className="text-3xl mb-3">🗑</div>
            <h3 className="font-bold text-gray-900 mb-2">Видалити {selected.size} заявок?</h3>
            <p className="text-sm text-gray-500 mb-5">Цю дію не можна скасувати.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">Скасувати</button>
              <button onClick={deleteSelected} className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600">Видалити</button>
            </div>
          </div>
        </div>
      )}

      {/* Main table */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Заявки на навчання</h1>
            <p className="text-xs text-gray-500 mt-1">Всього: {apps.length} заявок · Нових: {apps.filter(a => a.status === 'new').length}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportCSV(filtered)} className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" /> Експорт CSV
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs bg-dnu-blue text-white rounded-lg hover:bg-dnu-dark transition-colors font-semibold">
              + Нова заявка
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
          <select onChange={e => setTab(e.target.value as TabFilter)} value={tab}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-dnu-blue">
            <option value="all">Всі статуси</option>
            <option value="new">Нова</option><option value="processing">Обробка</option>
            <option value="accepted">Прийнята</option><option value="rejected">Відмова</option>
          </select>
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
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="w-9 px-3 py-3">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
                </th>
                {['#', 'Заявник', 'Програма', 'Категорія', 'Дата', 'Фінансування', 'Статус', 'Дії'].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(app => (
                <tr key={app.id} onClick={() => setDrawerApp(app)}
                  className={clsx('hover:bg-gray-50 transition-colors cursor-pointer',
                    selected.has(app.id) && 'bg-yellow-50',
                    drawerApp?.id === app.id && 'bg-blue-50')}>
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(app.id)} onChange={() => toggleSelect(app.id)} className="rounded" />
                  </td>
                  <td className="px-3 py-3 text-gray-400">#{app.num}</td>
                  <td className="px-3 py-3">
                    <div className="font-semibold text-gray-900">{app.name}</div>
                    <div className="text-gray-400">{app.email}</div>
                  </td>
                  <td className="px-3 py-3 text-gray-700">{app.program}</td>
                  <td className="px-3 py-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{app.category}</span></td>
                  <td className="px-3 py-3 text-gray-500">{app.date}</td>
                  <td className="px-3 py-3 text-gray-700">{app.financing}</td>
                  <td className="px-3 py-3">
                    <span className={clsx('px-2 py-0.5 rounded border text-xs font-bold', STATUS_COLORS[app.status])}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={e => { e.stopPropagation(); setDrawerApp(app); }}
                      className="flex items-center gap-1 px-2.5 py-1 border border-gray-200 rounded bg-white hover:border-dnu-blue hover:text-dnu-blue transition-colors text-xs">
                      <Eye className="w-3 h-3" /> Перегляд
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-10 text-center text-gray-400 text-sm">Заявок не знайдено</td></tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <span>Показано {filtered.length} з {apps.length}</span>
            <div className="flex gap-1">
              {['‹', '1', '2', '3', '›'].map((p, i) => (
                <button key={i} disabled={p === '1' || p === '...' }
                  onClick={() => p !== '1' && notify('📄 Сторінка ' + p)}
                  className={clsx('w-7 h-7 border rounded text-xs transition-colors',
                    p === '1' ? 'border-gray-900 bg-gray-900 text-white font-bold' : 'border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40')}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerApp && (
        <aside className="w-80 shrink-0 ml-5 bg-white border border-gray-200 rounded-xl overflow-hidden self-start sticky top-0">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900">Заявка #{drawerApp.num}</h2>
            <button onClick={() => setDrawerApp(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-5 space-y-4 text-xs">
            <span className={clsx('px-2.5 py-1 rounded border text-xs font-bold', STATUS_COLORS[drawerApp.status])}>
              {STATUS_LABELS[drawerApp.status]}
            </span>
            {([
              { label: 'Заявник',        value: drawerApp.name },
              { label: 'Email',          value: drawerApp.email },
              { label: 'Програма',       value: drawerApp.program },
              { label: 'Фінансування',   value: drawerApp.financing },
              { label: 'Дата подачі',    value: drawerApp.date },
            ] as const).map(({ label, value }) => (
              <div key={label}>
                <div className="text-gray-400 uppercase tracking-wider font-bold text-[10px] mb-0.5">{label}</div>
                <div className="text-gray-900">{value}</div>
              </div>
            ))}
            <hr className="border-gray-100" />
            <div>
              <div className="text-gray-400 uppercase tracking-wider font-bold text-[10px] mb-2">Документи</div>
              {['📄 Диплом.pdf', '🪪 Паспорт.jpg', '🔢 ІПН.pdf'].map(doc => (
                <div key={doc} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded px-3 py-2 mb-1.5">
                  <span className="text-gray-700">{doc}</span>
                  <button onClick={() => notify('📥 Завантаження: ' + doc.split(' ')[1])} className="text-dnu-blue text-[10px] underline hover:no-underline">Завантажити</button>
                </div>
              ))}
            </div>
            <hr className="border-gray-100" />
            <div>
              <div className="text-gray-400 uppercase tracking-wider font-bold text-[10px] mb-2">Коментар менеджера</div>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Залишити коментар..."
                className="w-full h-16 text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-dnu-blue" />
            </div>
            <div className="space-y-2 pt-1">
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
