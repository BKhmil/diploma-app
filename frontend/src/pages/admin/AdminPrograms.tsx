import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, X, Check, Save } from 'lucide-react';
import { usePrograms } from '../../context/ProgramsContext';
import { Program } from '../../types';
import { clsx } from 'clsx';

const CATEGORY_LABELS: Record<string, string> = {
  qualification:   'Підвищення кваліфікації',
  retraining:      'Перепідготовка',
  master:          'Магістратура',
  'pre-university':'НМТ-підготовка',
};
const FORMAT_LABELS: Record<string, string> = { online: 'Онлайн', offline: 'Офлайн', mixed: 'Змішаний' };
const CATEGORY_COLORS: Record<string, string> = {
  qualification:    'bg-blue-100   text-blue-700',
  retraining:       'bg-purple-100 text-purple-700',
  master:           'bg-indigo-100 text-indigo-700',
  'pre-university': 'bg-orange-100 text-orange-700',
};

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400" /> {msg}
    </div>
  );
}

// ── Edit / New Modal ──────────────────────────────────────────────────────────
interface ModalProps {
  program: Partial<Program> | null;
  onClose: () => void;
  onSave: (p: Program) => void;
}
function ProgramModal({ program, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState({
    title:    program?.title    ?? '',
    category: program?.category ?? 'qualification',
    format:   program?.format   ?? 'online',
    duration: program?.duration ?? '',
    price:    program?.price    ?? '',
  });
  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.duration) return;
    onSave({
      ...(program as Program),
      id:          program?.id ?? 'prog-' + Date.now(),
      title:       form.title,
      category:    form.category as Program['category'],
      format:      form.format   as Program['format'],
      duration:    form.duration,
      price:       form.price || undefined,
      description: program?.description ?? 'Опис програми.',
      targetAudience: program?.targetAudience ?? 'Для всіх бажаючих',
    });
    onClose();
  };

  const isNew = !program?.id;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">{isNew ? 'Нова програма' : 'Редагувати програму'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Назва програми</label>
            <input required value={form.title} onChange={set('title')} placeholder="Введіть назву..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Категорія</label>
              <select value={form.category} onChange={set('category')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue bg-white">
                <option value="qualification">Підвищення кваліфікації</option>
                <option value="retraining">Перепідготовка</option>
                <option value="master">Магістратура</option>
                <option value="pre-university">НМТ-підготовка</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Формат</label>
              <select value={form.format} onChange={set('format')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue bg-white">
                <option value="online">Онлайн</option>
                <option value="offline">Офлайн</option>
                <option value="mixed">Змішаний</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Тривалість</label>
              <input required value={form.duration} onChange={set('duration')} placeholder="напр. 3 місяці"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ціна</label>
              <input value={form.price} onChange={set('price')} placeholder="напр. 4 500 грн"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              Скасувати
            </button>
            <button type="submit"
              className="flex-1 py-2.5 bg-dnu-blue text-white rounded-xl text-sm font-bold hover:bg-dnu-dark transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ title, onCancel, onConfirm }: { title: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-center">
        <div className="text-3xl mb-3">🗑</div>
        <h3 className="font-bold text-gray-900 mb-2">Видалити програму?</h3>
        <p className="text-sm text-gray-500 mb-1 font-medium">«{title}»</p>
        <p className="text-xs text-gray-400 mb-5">Цю дію не можна скасувати.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors">Скасувати</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">Видалити</button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPrograms() {
  const { programs: progs, setPrograms: setProgs } = usePrograms();
  const [query, setQuery]       = useState('');
  const [modal, setModal]       = useState<'new' | Program | null>(null);
  const [toDelete, setToDelete] = useState<Program | null>(null);
  const [toast, setToast]       = useState<string | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = progs.filter(p =>
    !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.id.includes(query)
  );

  const handleSave = (p: Program) => {
    setProgs(prev => {
      const idx = prev.findIndex(x => x.id === p.id);
      return idx >= 0 ? prev.map(x => x.id === p.id ? p : x) : [p, ...prev];
    });
    notify(modal === 'new' ? '✅ Програму додано' : '✅ Програму збережено');
  };

  const handleDelete = () => {
    if (!toDelete) return;
    setProgs(prev => prev.filter(p => p.id !== toDelete.id));
    notify('🗑 Програму видалено');
    setToDelete(null);
  };

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast} />}
      {modal !== null && (
        <ProgramModal
          program={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {toDelete && (
        <DeleteConfirm title={toDelete.title} onCancel={() => setToDelete(null)} onConfirm={handleDelete} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Програми навчання</h1>
          <p className="text-xs text-gray-500 mt-0.5">Всього: {progs.length} програм</p>
        </div>
        <button onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2 bg-dnu-blue text-white text-sm font-semibold rounded-xl hover:bg-dnu-dark transition-colors">
          <Plus className="w-4 h-4" /> Нова програма
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <h2 className="font-bold text-sm text-gray-800">Список програм ({filtered.length})</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Пошук..."
              className="pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-dnu-blue w-52" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 font-semibold min-w-72">Назва програми</th>
                <th className="px-5 py-3 font-semibold">Категорія</th>
                <th className="px-5 py-3 font-semibold">Формат</th>
                <th className="px-5 py-3 font-semibold">Тривалість</th>
                <th className="px-5 py-3 font-semibold">Ціна</th>
                <th className="px-5 py-3 font-semibold">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{p.title}</div>
                    <div className="text-gray-400 mt-0.5">{p.id}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={clsx('px-2 py-0.5 rounded text-[10px] font-bold', CATEGORY_COLORS[p.category])}>
                      {CATEGORY_LABELS[p.category]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{FORMAT_LABELS[p.format]}</td>
                  <td className="px-5 py-3 text-gray-600">{p.duration}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{p.price || 'Безкоштовно'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setModal(p)} title="Редагувати"
                        className="text-gray-400 hover:text-dnu-blue transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setToDelete(p)} title="Видалити"
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">Нічого не знайдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
          Показано {filtered.length} з {progs.length} програм
        </div>
      </div>
    </div>
  );
}
