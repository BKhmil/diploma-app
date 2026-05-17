import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { clsx } from 'clsx';
import { createApplication } from '../../services/strapi';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
}

export function ContactForm({ type = 'contact' }: { type?: 'contact' | 'apply' }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    await createApplication({
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      program_name: data.subject,
      message: data.message,
    });
    alert('Дякуємо! Ваше повідомлення відправлено.');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Ім'я та Прізвище</label>
          <input
            id="name"
            {...register('name', { required: "Це поле обов'язкове" })}
            className={clsx(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-dnu-blue outline-none transition-all",
              errors.name ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-dnu-blue"
            )}
            placeholder="Іван Петренко"
          />
          {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
          <input
            id="phone"
            type="tel"
            {...register('phone', { required: "Це поле обов'язкове" })}
            className={clsx(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-dnu-blue outline-none transition-all",
              errors.phone ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-dnu-blue"
            )}
            placeholder="+38 (0XX) XXX-XX-XX"
          />
          {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { 
            required: "Це поле обов'язкове",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Невірний формат email"
            }
          })}
          className={clsx(
            "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-dnu-blue outline-none transition-all",
            errors.email ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-dnu-blue"
          )}
          placeholder="example@email.com"
        />
        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
      </div>

      {type === 'apply' && (
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Програма, що вас цікавить</label>
          <select
            id="subject"
            {...register('subject')}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-dnu-blue outline-none transition-all bg-white"
          >
            <option value="">Оберіть програму...</option>
            <option value="qualification">Підвищення кваліфікації</option>
            <option value="retraining">Перепідготовка</option>
            <option value="nmt">Підготовка до НМТ</option>
            <option value="other">Інше</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
          {type === 'apply' ? 'Додаткові питання або коментарі' : 'Ваше повідомлення'}
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message', { required: type === 'contact' ? "Це поле обов'язкове" : false })}
          className={clsx(
            "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-dnu-blue outline-none transition-all resize-none",
            errors.message ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-dnu-blue"
          )}
          placeholder={type === 'apply' ? "Напишіть ваші питання тут..." : "Текст вашого повідомлення..."}
        />
        {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-dnu-blue text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Відправка...' : (
          <>
            {type === 'apply' ? 'Подати заявку' : 'Надіслати повідомлення'} <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}
