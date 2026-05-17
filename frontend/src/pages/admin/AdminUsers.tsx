import React, { useState } from 'react';
import { Search, UserPlus, Mail, Edit3, Trash2, X, Save, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  enrolled: string;
  status: 'active' | 'completed' | 'paused';
}

const INITIAL_STUDENTS: Student[] = [
  { id: 's-001', name: 'Сидоренко Ольга Василівна',    email: 'sidorenko@gmail.com',  phone: '+38 (067) 123-45-67', program: 'Педагогічна майстерність',  enrolled: '15 лют 2026', status: 'active' },
  { id: 's-002', name: 'Ковальчук Микола Іванович',    email: 'kovalchuk@ukr.net',    phone: '+38 (050) 234-56-78', program: 'Психологія (магістр)',       enrolled: '14 лют 2026', status: 'active' },
  { id: 's-003', name: 'Петренко Василь Олексійович',  email: 'petrenko@gmail.com',   phone: '+38 (063) 345-67-89', program: 'НМТ Математика',             enrolled: '14 лют 2026', status: 'active' },
  { id: 's-004', name: 'Іщенко Андрій Романович',      email: 'ischenko@meta.ua',     phone: '+38 (097) 456-78-90', program: 'Охорона праці в освіті',     enrolled: '13 лют 2026', status: 'completed' },
  { id: 's-005', name: 'Мороз Наталія Василівна',      email: 'moroz@ukr.net',        phone: '+38 (066) 567-89-01', program: 'Інклюзивна освіта',          enrolled: '11 лют 2026', status: 'active' },
  { id: 's-006', name: 'Захаренко Ірина Петрівна',     email: 'zaharenko@gmail.com',  phone: '+38 (073) 678-90-12', program: 'Право (магістр)',             enrolled: '10 лют 2026', status: 'completed' },
  { id: 's-007', name: 'Ткаченко Руслан Миколайович',  email: 'tkachenko@gmail.com',  phone: '+38 (095) 789-01-23', program: 'НМТ Українська мова',        enrolled: '09 лют 2026', status: 'paused' },
  { id: 's-008', name: 'Бондаренко Лариса Олегівна',   email: 'bondarenko@ukr.net',   phone: '+38 (067) 890-12-34', program: 'Менеджмент організацій',     enrolled: '08 лют 2026', status: 'active' },
];

const STATUS_LABELS: Record<string, string> = { active: 'Активний', completed: 'Завершив', paused: 'Призупинено' };
const STATUS_COLORS: Record<string, string> = {
  active:    'bg-green-100  text-green-700',
  completed: 'bg-blue-100   text-blue-700',
  paused:    'bg-yellow-100 text-yellow-700',
};

const PROGRAMS = [
  'Педагогічна майстерність', 'Психологія (магістр)', 'НМТ Математика',
  'Охорона праці в освіті', 'Інклюзивна освіта', 'Право (магістр)',
  'НМТ Українська мова', 'Менеджмент організацій', 'Менеджмент (магістр)',
];

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm shadow-xl z-50 flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400" /> {msg}
    </div>
  );
}

// ── Student Modal ─────────────────────────────────────────────────────────────
interface ModalProps {
  student: Partial<Student> | null;
  onClose: () => void;
  onSave: (s: Student) => void;
}
function StudentModal({ student, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState({
    name:     student?.name     ?? '',
    email:    student?.email    ?? '',
    phone:    student?.phone    ?? '',
    program:  student?.program  ?? PROGRAMS[0],
    enrolled: student?.enrolled ?? new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' }),
    status:   student?.status   ?? 'active' as Student['status'],
  });
  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    onSave({
      ...(student as Student),
      id:       student?.id ?? 's-' + Date.now(),
      name:     form.name,
      email:    form.email,
      phone:    form.phone,
      program:  form.program,
      enrolled: form.enrolled,
      status:   form.status as Student['status'],
    });
    onClose();
  };

  const isNew = !student?.id;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900">{isNew ? 'Новий слухач' : 'Редагувати слухача'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">ПІБ</label>
            <input required value={form.name} onChange={set('name')} placeholder="Прізвище Ім'я По-батькові"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input required type="email" value={form.email} onChange={set('email')} placeholder="email@example.com"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Телефон</label>
              <input value={form.phone} onChange={set('phone')} placeholder="+38 (0XX) XXX-XX-XX"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Програма</label>
            <select value={form.program} onChange={set('program')}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue bg-white">
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Дата зарахування</label>
              <input value={form.enrolled} onChange={set('enrolled')} placeholder="напр. 15 лют 2026"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Статус</label>
              <select value={form.status} onChange={set('status')}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-dnu-blue bg-white">
                <option value="active">Активний</option>
                <option value="completed">Завершив</option>
                <option value="paused">Призупинено</option>
              </select>
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
function DeleteConfirm({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-center">
        <div className="text-3xl mb-3">🗑</div>
        <h3 className="font-bold text-gray-900 mb-2">Видалити слухача?</h3>
        <p className="text-sm text-gray-500 mb-1 font-medium">«{name}»</p>
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
export default function AdminUsers() {
  const [students, setStudents]   = useState<Student[]>(INITIAL_STUDENTS);
  const [query, setQuery]         = useState('');
  const [modal, setModal]         = useState<'new' | Student | null>(null);
  const [toDelete, setToDelete]   = useState<Student | null>(null);
  const [toast, setToast]         = useState<string | null>(null);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const filtered = students.filter(s =>
    !query ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleSave = (s: Student) => {
    setStudents(prev => {
      const idx = prev.findIndex(x => x.id === s.id);
      return idx >= 0 ? prev.map(x => x.id === s.id ? s : x) : [s, ...prev];
    });
    notify(modal === 'new' ? '✅ Слухача додано' : '✅ Дані збережено');
  };

  const handleDelete = () => {
    if (!toDelete) return;
    setStudents(prev => prev.filter(s => s.id !== toDelete.id));
    notify('🗑 Слухача видалено');
    setToDelete(null);
  };

  return (
    <div className="space-y-5">
      {toast && <Toast msg={toast} />}
      {modal !== null && (
        <StudentModal
          student={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {toDelete && (
        <DeleteConfirm name={toDelete.name} onCancel={() => setToDelete(null)} onConfirm={handleDelete} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Слухачі</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Всього: {students.length} слухачів · Активних: {students.filter(s => s.status === 'active').length}
          </p>
        </div>
        <button onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2 bg-dnu-blue text-white text-sm font-semibold rounded-xl hover:bg-dnu-dark transition-colors">
          <UserPlus className="w-4 h-4" /> Додати слухача
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <h2 className="font-bold text-sm text-gray-800">Список слухачів ({filtered.length})</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Пошук за ім'ям або email..."
              className="pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-dnu-blue w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 font-semibold">Слухач</th>
                <th className="px-5 py-3 font-semibold">Програма</th>
                <th className="px-5 py-3 font-semibold">Зарахований</th>
                <th className="px-5 py-3 font-semibold">Статус</th>
                <th className="px-5 py-3 font-semibold">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-gray-900">{s.name}</div>
                    <div className="text-gray-400">{s.email}</div>
                    <div className="text-gray-400">{s.phone}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{s.program}</td>
                  <td className="px-5 py-3 text-gray-500">{s.enrolled}</td>
                  <td className="px-5 py-3">
                    <span className={clsx('px-2 py-0.5 rounded text-[10px] font-bold', STATUS_COLORS[s.status])}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setModal(s)} title="Редагувати"
                        className="text-gray-400 hover:text-dnu-blue transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => window.open(`mailto:${s.email}?subject=ЦНО ДНУ — Інформація для слухача`)}
                        title="Написати email"
                        className="text-gray-400 hover:text-blue-500 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button onClick={() => setToDelete(s)} title="Видалити"
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">Нічого не знайдено</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
          Показано {filtered.length} з {students.length} слухачів
        </div>
      </div>
    </div>
  );
}
