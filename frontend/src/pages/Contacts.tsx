import React from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { clsx } from 'clsx';
import { createApplication, getContactInfo } from '../services/strapi';
import { useLanguage } from '../context/LanguageContext';

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  program?: string;
};

export default function Contacts() {
  const { locale } = useLanguage();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();
  const [contactInfo, setContactInfo] = React.useState<null | {
    address?: string;
    phone?: string;
    secondary_phone?: string;
    email?: string;
    working_hours?: string;
    weekend_hours_note?: string;
    room_note?: string;
    map_embed_url?: string;
    contacts_page_title?: string;
    contacts_page_subtitle?: string;
  }>(null);

  React.useEffect(() => {
    getContactInfo(locale).then(setContactInfo).catch(() => undefined);
  }, [locale]);

  const onSubmit = async (data: FormData) => {
    await createApplication({
      full_name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      program_name: data.program,
      app_type: 'contact',
    });
    alert('Дякуємо! Ваше повідомлення надіслано.');
    reset();
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{contactInfo?.contacts_page_title || ''}</h1>
          <p className="text-lg text-gray-600">{contactInfo?.contacts_page_subtitle || ''}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Наші координати</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-dnu-light rounded-full flex items-center justify-center text-dnu-blue shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Адреса</h3>
                    <p className="text-gray-600">{contactInfo?.address || ''}</p>
                    {contactInfo?.room_note && <p className="text-sm text-gray-500 mt-1">{contactInfo.room_note}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-dnu-light rounded-full flex items-center justify-center text-dnu-blue shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Телефони</h3>
                    <p className="text-gray-600">{contactInfo?.phone || ''}</p>
                    {contactInfo?.secondary_phone && <p className="text-gray-600">{contactInfo.secondary_phone}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-dnu-light rounded-full flex items-center justify-center text-dnu-blue shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{contactInfo?.email || ''}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-dnu-light rounded-full flex items-center justify-center text-dnu-blue shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Графік роботи</h3>
                    <p className="text-gray-600">{contactInfo?.working_hours || ''}</p>
                    {contactInfo?.weekend_hours_note && <p className="text-gray-600">{contactInfo.weekend_hours_note}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-gray-200 rounded-2xl h-64 w-full overflow-hidden relative shadow-inner">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src={contactInfo?.map_embed_url || 'https://maps.google.com/maps?width=100%25&height=600&hl=uk&q=48.434606,35.034614+(ДНУ%20ім.%20Олеся%20Гончара)&t=&z=16&ie=UTF8&iwloc=&output=embed'}
                title="Google Maps Location"
                className="w-full h-full border-0"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Напишіть нам</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ваше ім'я
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: "Ім'я обов'язкове" })}
                  className={clsx(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none transition-all",
                    errors.name ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="Іван Іванов"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: "Email обов'язковий",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Невірний формат email"
                      }
                    })}
                    className={clsx(
                      "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none transition-all",
                      errors.email ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="example@mail.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone', { required: "Телефон обов'язковий" })}
                    className={clsx(
                      "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none transition-all",
                      errors.phone ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="+38 (0XX) XXX-XX-XX"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Повідомлення
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register('message', { required: "Повідомлення обов'язкове" })}
                  className={clsx(
                    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-dnu-blue focus:border-transparent outline-none transition-all",
                    errors.message ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="Я хочу дізнатися більше про..."
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-dnu-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Відправка...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Надіслати повідомлення
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
