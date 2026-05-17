import { localizeUk, localizeEn } from '../../locale';
import { partnersPageEn } from '../../translate';

export const getPartnersPageUk = () => ({
  page_title: localizeUk('Партнери'),
  page_intro: localizeUk('Ми співпрацюємо з провідними навчальними закладами, підприємствами та громадськими організаціями Дніпропетровщини.'),
  cta_title: localizeUk('Станьте нашим партнером'),
  cta_text: localizeUk('Ми пропонуємо корпоративне навчання, спільні програми та взаємовигідну співпрацю.'),
  stats: [
    { value: '45+', label: localizeUk('Організацій-партнерів'), icon_key: 'handshake', order: 1 },
    { value: '12', label: localizeUk('Підприємств-замовників'), icon_key: 'building', order: 2 },
    { value: '8', label: localizeUk('ЗВО-партнерів'), icon_key: 'graduation', order: 3 },
    { value: '15+', label: localizeUk('Шкіл та ліцеїв'), icon_key: 'school', order: 4 },
  ],
  benefits: [
    { title: localizeUk('Корпоративне навчання'), description: localizeUk('Розробляємо індивідуальні навчальні програми для вашого персоналу.'), order: 1 },
    { title: localizeUk('Документи державного зразка'), description: localizeUk('Видаємо офіційно визнані свідоцтва та дипломи.'), order: 2 },
    { title: localizeUk('Гнучкі умови'), description: localizeUk('Онлайн, офлайн та змішані формати навчання на ваш вибір.'), order: 3 },
  ],
});

export const getPartnersPageEn = () => ({
  page_title: localizeEn(partnersPageEn.page_title),
  page_intro: localizeEn(partnersPageEn.page_intro),
  cta_title: localizeEn(partnersPageEn.cta_title),
  cta_text: localizeEn(partnersPageEn.cta_text),
  stats: [
    { value: '45+', label: localizeEn('Partner Organizations'), icon_key: 'handshake', order: 1 },
    { value: '12', label: localizeEn('Employer Partners'), icon_key: 'building', order: 2 },
    { value: '8', label: localizeEn('University Partners'), icon_key: 'graduation', order: 3 },
    { value: '15+', label: localizeEn('Schools and Lyceums'), icon_key: 'school', order: 4 },
  ],
  benefits: [
    { title: localizeEn('Corporate Training'), description: localizeEn('We develop individual training programs for your staff.'), order: 1 },
    { title: localizeEn('State-Recognized Documents'), description: localizeEn('We issue officially recognized certificates and diplomas.'), order: 2 },
    { title: localizeEn('Flexible Terms'), description: localizeEn('Online, offline, and blended learning formats of your choice.'), order: 3 },
  ],
});
