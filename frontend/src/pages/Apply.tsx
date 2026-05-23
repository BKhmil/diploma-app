import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User, BookOpen, ListChecks, Upload, CheckCircle2,
  ChevronRight, ChevronLeft, Phone, Mail, Clock, FileText,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';
import { createApplication, getPrograms, type StrapiProgram } from '../services/strapi';

type Step1Data = {
  lastName: string;
  firstName: string;
  patronymic?: string;
  birthDate: string;
  phone: string;
  email: string;
  city: string;
};

type Step2Data = {
  educationLevel: string;
  diplomaSpecialty?: string;
  workplace?: string;
};

type Step3Data = {
  programCategory: 'qualification' | 'retraining' | 'pre-university' | 'master';
  program: string;
  financing: 'budget' | 'contract' | 'employer';
  wishes?: string;
};

type Step4Data = {
  diploma?: FileList;
  passport?: FileList;
  ipn?: FileList;
  photo?: FileList;
};

type Step5Data = {
  consentPersonal: boolean;
  consentNews?: boolean;
};

type FormData = Step1Data & Step2Data & Step3Data & Step4Data & Step5Data;

const STEPS = [
  { label: 'Особисті дані', icon: User },
  { label: 'Освіта та досвід', icon: BookOpen },
  { label: 'Вибір програми', icon: ListChecks },
  { label: 'Документи', icon: Upload },
  { label: 'Підтвердження', icon: CheckCircle2 },
];


function UploadZone({ label, required, name, register }: {
  label: string;
  required?: boolean;
  name: keyof Step4Data;
  register: ReturnType<typeof useForm<FormData>>['register'];
}) {
  const [fileName, setFileName] = useState<string>('');
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <label className={clsx(
        'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors',
        fileName ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-dnu-blue hover:bg-blue-50'
      )}>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          {...register(name)}
          onChange={(e) => {
            if (e.target.files?.[0]) setFileName(e.target.files[0].name);
          }}
        />
        {fileName ? (
          <>
            <Check className="w-6 h-6 text-green-500" />
            <span className="text-sm text-green-700 font-medium text-center break-all">{fileName}</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500 text-center">
              Перетягніть або <span className="text-dnu-blue underline">оберіть файл</span>
            </span>
            <span className="text-xs text-gray-400">PDF, JPG, PNG · до 5 МБ</span>
          </>
        )}
      </label>
    </div>
  );
}

export function Apply() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState<Partial<FormData>>({});
  const [strapiPrograms, setStrapiPrograms] = useState<StrapiProgram[]>([]);

  useEffect(() => {
    getPrograms().then(setStrapiPrograms).catch(() => {});
  }, []);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<FormData>({
    defaultValues: {
      ...formState,
      program: searchParams.get('program') || formState.program,
    },
  });

  const programCategory = watch('programCategory', 'qualification');
  const allValues = watch();

  const handleNext = async () => {
    const fieldsPerStep: (keyof FormData)[][] = [
      ['lastName', 'firstName', 'birthDate', 'phone', 'email', 'city'],
      ['educationLevel'],
      ['programCategory', 'program', 'financing'],
      [],
      ['consentPersonal'],
    ];
    const valid = await trigger(fieldsPerStep[step] as any);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (submitting) return;
    setSubmitting(true);
    setFormState(data);
    try {
      const financingMap: Record<string, string> = {
        budget: 'Бюджет', contract: 'Контракт', employer: 'Роботодавець',
      };
      const files = {
        diploma:  data.diploma?.[0],
        passport: data.passport?.[0],
        ipn:      data.ipn?.[0],
        photo:    data.photo?.[0],
      };
      await createApplication(
        {
          full_name: `${data.lastName} ${data.firstName} ${data.patronymic || ''}`.trim(),
          email: data.email,
          phone: data.phone,
          city: data.city,
          organization: data.workplace,
          program_name: data.program,
          message: data.wishes,
          financing: financingMap[data.financing] ?? data.financing,
          birth_date: data.birthDate,
          education_level: data.educationLevel,
          diploma_specialty: data.diplomaSpecialty,
          app_type: 'application',
        },
        files
      );
    } catch (err: any) {
      const msg = err?.message?.includes('409')
        ? 'Ви вже подавали заявку на цю програму. Повторна заявка неможлива.'
        : 'Не вдалося надіслати заявку. Спробуйте пізніше.';
      alert(msg);
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Заявку прийнято!</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Дякуємо! Ваша заявка успішно надіслана. Наш менеджер зв'яжеться з вами протягом <strong>1 робочого дня</strong>.
          </p>
          <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-8 text-sm text-gray-700">
            <p className="font-semibold text-gray-800">Що далі:</p>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-dnu-blue text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Менеджер зв'яжеться з вами для підтвердження</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-dnu-blue text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Підпишете договір про надання освітніх послуг</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-dnu-blue text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>Отримаєте доступ до навчання</span>
            </div>
          </div>
          <Link to="/" className="inline-block bg-dnu-blue text-white font-bold py-3 px-8 rounded-xl hover:bg-dnu-dark transition-colors">
            На головну
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 pb-8 mb-8">
        <div className="container mx-auto px-4 md:px-6 pt-6">
          <nav className="text-sm text-gray-500 mb-4 flex gap-2 items-center">
            <Link to="/" className="hover:text-dnu-blue transition-colors">Головна</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 font-medium">Подати заявку</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Подати заявку на навчання</h1>
          <p className="text-gray-600">Заповніть форму — менеджер зв'яжеться з вами протягом 1 робочого дня</p>

          {/* Step Indicators */}
          <div className="flex items-center gap-0 mt-8 max-w-2xl">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <div className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-sm',
                      done ? 'bg-dnu-blue border-dnu-blue text-white' :
                      active ? 'bg-white border-dnu-blue text-dnu-blue' :
                      'bg-white border-gray-300 text-gray-400'
                    )}>
                      {done ? <Check className="w-5 h-5" /> : <span>{i + 1}</span>}
                    </div>
                    <span className={clsx(
                      'text-xs mt-1 font-medium text-center hidden sm:block max-w-[80px] leading-tight',
                      active ? 'text-dnu-blue' : done ? 'text-gray-600' : 'text-gray-400'
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={clsx(
                      'flex-1 h-0.5 mx-1 mb-5 transition-colors',
                      i < step ? 'bg-dnu-blue' : 'bg-gray-200'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

              {/* STEP 1 — Personal Data */}
              {step === 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                    Крок 1. Особисті дані
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Прізвище <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('lastName', { required: "Прізвище обов'язкове" })}
                        className={clsx('w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all', errors.lastName ? 'border-red-400' : 'border-gray-300')}
                        placeholder="Іванченко"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ім'я <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('firstName', { required: "Ім'я обов'язкове" })}
                        className={clsx('w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all', errors.firstName ? 'border-red-400' : 'border-gray-300')}
                        placeholder="Олена"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">По батькові</label>
                      <input
                        {...register('patronymic')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all"
                        placeholder="Василівна"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата народження <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register('birthDate', { required: "Дата народження обов'язкова" })}
                        className={clsx('w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all', errors.birthDate ? 'border-red-400' : 'border-gray-300')}
                      />
                      {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: "Телефон обов'язковий" })}
                        className={clsx('w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all', errors.phone ? 'border-red-400' : 'border-gray-300')}
                        placeholder="+38 (0XX) XXX-XX-XX"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('email', {
                          required: "Email обов'язковий",
                          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Невірний формат email' }
                        })}
                        className={clsx('w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all', errors.email ? 'border-red-400' : 'border-gray-300')}
                        placeholder="example@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Місто проживання <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('city', { required: "Місто обов'язкове" })}
                        className={clsx('w-full md:max-w-xs px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all', errors.city ? 'border-red-400' : 'border-gray-300')}
                        placeholder="Дніпро"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Education */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                    Крок 2. Освіта та досвід
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Рівень освіти <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('educationLevel', { required: 'Оберіть рівень освіти' })}
                        className={clsx('w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none appearance-none bg-white', errors.educationLevel ? 'border-red-400' : 'border-gray-300')}
                      >
                        <option value="">— Оберіть —</option>
                        <option>Повна загальна середня</option>
                        <option>Бакалавр</option>
                        <option>Магістр / Спеціаліст</option>
                        <option>Аспірант / Доктор наук</option>
                      </select>
                      {errors.educationLevel && <p className="text-red-500 text-xs mt-1">{errors.educationLevel.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Спеціальність за дипломом</label>
                      <input
                        {...register('diplomaSpecialty')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all"
                        placeholder="Математика"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Місце роботи та посада</label>
                      <input
                        {...register('workplace')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all"
                        placeholder="Школа №15, вчитель математики"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Program Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                    Крок 3. Вибір програми
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Категорія програми <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {([
                        { value: 'qualification', label: 'Підвищення кваліфікації' },
                        { value: 'retraining', label: 'Перепідготовка' },
                        { value: 'master', label: 'Магістратура' },
                        { value: 'pre-university', label: 'НМТ-підготовка' },
                      ] as const).map(({ value, label }) => (
                        <label key={value} className={clsx(
                          'flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl cursor-pointer transition-all font-medium text-sm',
                          programCategory === value ? 'border-dnu-blue bg-dnu-light text-dnu-dark' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        )}>
                          <input type="radio" value={value} {...register('programCategory')} className="hidden" />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Оберіть програму <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('program', { required: 'Оберіть програму' })}
                      className={clsx('w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none appearance-none bg-white', errors.program ? 'border-red-400' : 'border-gray-300')}
                    >
                      <option value="">— Оберіть зі списку —</option>
                      {strapiPrograms
                        .filter(p => p.category === programCategory)
                        .map(p => (
                          <option key={p.id} value={p.title}>{p.title}</option>
                        ))
                      }
                    </select>
                    {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Форма фінансування <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {([
                        { value: 'budget', label: 'Бюджет (безкоштовно)' },
                        { value: 'contract', label: 'Контракт (самостійна оплата)' },
                        { value: 'employer', label: 'Від роботодавця' },
                      ] as const).map(({ value, label }) => (
                        <label key={value} className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
                          <input type="radio" value={value} {...register('financing', { required: 'Оберіть форму фінансування' })} />
                          {label}
                        </label>
                      ))}
                    </div>
                    {errors.financing && <p className="text-red-500 text-xs mt-1">{errors.financing.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Додаткові побажання</label>
                    <textarea
                      {...register('wishes')}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dnu-blue outline-none transition-all resize-none"
                      placeholder="Наприклад: зручний час занять, особливі умови, запитання..."
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 — Documents */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                    Крок 4. Завантаження документів
                  </h2>
                  <p className="text-sm text-gray-500">
                    Завантажте скан-копії або фото документів. Формати: PDF, JPG, PNG. Максимальний розмір: 5 МБ.
                  </p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <UploadZone label="Диплом про вищу освіту" required name="diploma" register={register} />
                    <UploadZone label="Паспорт (1 та 2 сторінки)" required name="passport" register={register} />
                    <UploadZone label="РНОКПП (ІПН)" name="ipn" register={register} />
                    <UploadZone label="Фото 3×4 (jpg або png)" name="photo" register={register} />
                  </div>
                  <p className="text-xs text-gray-400 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                    * Для НМТ-підготовки замість диплома надайте шкільний атестат.
                  </p>
                </div>
              )}

              {/* STEP 5 — Confirmation */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                    Крок 5. Підтвердження заявки
                  </h2>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {[
                      { key: "Ім'я", val: `${allValues.lastName || ''} ${allValues.firstName || ''} ${allValues.patronymic || ''}`.trim() || '—' },
                      { key: 'Дата народження', val: allValues.birthDate || '—' },
                      { key: 'Телефон', val: allValues.phone || '—' },
                      { key: 'Email', val: allValues.email || '—' },
                      { key: 'Місто', val: allValues.city || '—' },
                      { key: 'Рівень освіти', val: allValues.educationLevel || '—' },
                      { key: 'Місце роботи', val: allValues.workplace || '—' },
                      { key: 'Програма', val: allValues.program || '—' },
                      { key: 'Фінансування', val: { budget: 'Бюджет', contract: 'Контракт', employer: 'Від роботодавця' }[allValues.financing ?? ''] || allValues.financing || '—' },
                    ].map(({ key, val }) => (
                      <div key={key} className="flex justify-between px-5 py-3 text-sm">
                        <span className="text-gray-500">{key}</span>
                        <span className="font-medium text-gray-900 text-right max-w-[60%]">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 bg-gray-50 rounded-xl border border-gray-200 p-5">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register('consentPersonal', { required: 'Необхідна ваша згода' })}
                        className="mt-0.5 w-4 h-4 accent-dnu-blue"
                      />
                      <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                        Я погоджуюся з <span className="text-dnu-blue underline cursor-pointer">обробкою персональних даних</span> відповідно до Закону України "Про захист персональних даних" і підтверджую достовірність наданої інформації.
                      </span>
                    </label>
                    {errors.consentPersonal && <p className="text-red-500 text-xs">{errors.consentPersonal.message}</p>}

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register('consentNews')}
                        className="mt-0.5 w-4 h-4 accent-dnu-blue"
                      />
                      <span className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                        Я хочу отримувати новини та повідомлення про нові програми на вказаний email.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Назад
                    </button>
                  )}
                  {step === 0 && (
                    <Link to="/qualification" className="text-sm text-gray-500 hover:text-dnu-blue transition-colors">
                      ← До програм
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-7 py-2.5 bg-dnu-blue text-white font-bold rounded-xl hover:bg-dnu-dark transition-colors shadow-sm"
                    >
                      Далі
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Надсилання...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Надіслати заявку
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="space-y-5 sticky top-24">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-dnu-blue" />
                Необхідні документи
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2"><span>📄</span> Диплом про вищу освіту (скан)</li>
                <li className="flex items-start gap-2"><span>🪪</span> Паспорт (стор. 1 і 2)</li>
                <li className="flex items-start gap-2"><span>🔢</span> РНОКПП (ІПН)</li>
                <li className="flex items-start gap-2"><span>📸</span> Фото 3×4 (jpg або png)</li>
              </ul>
              <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                * Для НМТ-підготовки: замість диплома — атестат
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Що далі?</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                {['Заповніть форму', 'Менеджер зв\'яжеться з вами', 'Підпишете договір', 'Отримаєте доступ до навчання'].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-dnu-light text-dnu-blue rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-dnu-dark rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-3">Маєте запитання?</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <a href="tel:+380561234567" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" /> +38 (056) 123-45-67
                </a>
                <a href="mailto:info@cno.dnu.edu.ua" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" /> info@cno.dnu.edu.ua
                </a>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Пн–Пт: 9:00–17:00
                </div>
              </div>
              <Link to="/contacts" className="mt-4 block w-full text-center border border-white/40 text-white text-sm font-medium py-2 rounded-lg hover:bg-white/10 transition-colors">
                Написати нам
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
