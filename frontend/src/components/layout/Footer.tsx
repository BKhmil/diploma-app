import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { getContactInfo } from '../../services/strapi';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { locale } = useLanguage();
  const [footerData, setFooterData] = React.useState<null | {
    address?: string;
    phone?: string;
    email?: string;
    footer_about_title?: string;
    footer_about_description?: string;
    footer_nav_title?: string;
    footer_nav_about_label?: string;
    footer_nav_qualification_label?: string;
    footer_nav_retraining_label?: string;
    footer_nav_pre_university_label?: string;
    footer_nav_alumni_label?: string;
    footer_contacts_title?: string;
    footer_social_title?: string;
    facebook_url?: string;
    instagram_url?: string;
  }>(null);

  React.useEffect(() => {
    getContactInfo(locale).then(setFooterData).catch(() => undefined);
  }, [locale]);

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">
              {footerData?.footer_about_title || 'Центр неперервної освіти'}
            </h3>
            <p className="text-sm leading-relaxed">
              {footerData?.footer_about_description ||
                'Сучасна освітня платформа Дніпровського національного університету імені Олеся Гончара. Ми створюємо можливості для навчання протягом усього життя.'}
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">{footerData?.footer_nav_title || 'Навігація'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">{footerData?.footer_nav_about_label || 'Про Центр'}</Link></li>
              <li><Link to="/qualification" className="hover:text-white transition-colors">{footerData?.footer_nav_qualification_label || 'Підвищення кваліфікації'}</Link></li>
              <li><Link to="/retraining" className="hover:text-white transition-colors">{footerData?.footer_nav_retraining_label || 'Перепідготовка'}</Link></li>
              <li><Link to="/pre-university" className="hover:text-white transition-colors">{footerData?.footer_nav_pre_university_label || 'Вступникам'}</Link></li>
              <li><Link to="/alumni" className="hover:text-white transition-colors">{footerData?.footer_nav_alumni_label || 'Випускники'}</Link></li>
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">{footerData?.footer_contacts_title || 'Контакти'}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-dnu-blue shrink-0" />
                <span>{footerData?.address || 'пр. Науки, 72, м. Дніпро, 49010'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-dnu-blue shrink-0" />
                <a href={`tel:${(footerData?.phone || '+38 (056) 123-45-67').replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                  {footerData?.phone || '+38 (056) 123-45-67'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-dnu-blue shrink-0" />
                <a href={`mailto:${footerData?.email || 'info@cno.dnu.edu.ua'}`} className="hover:text-white transition-colors">
                  {footerData?.email || 'info@cno.dnu.edu.ua'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">{footerData?.footer_social_title || 'Ми в соцмережах'}</h3>
            <div className="flex gap-4">
              <a
                href={footerData?.facebook_url || '#'}
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="bg-slate-800 p-2 rounded-full hover:bg-dnu-blue hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={footerData?.instagram_url || '#'}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                className="bg-slate-800 p-2 rounded-full hover:bg-dnu-blue hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="pt-4">
              <Link 
                to="/contacts" 
                className="inline-block bg-dnu-blue text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Написати нам
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Центр неперервної освіти ДНУ ім. О. Гончара. Всі права захищено.</p>
        </div>
      </div>
    </footer>
  );
}
