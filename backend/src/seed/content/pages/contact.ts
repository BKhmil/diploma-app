import { localizeUk, localizeEn } from '../../locale';
import { contactPageEn } from '../../translate';

export const getContactUk = () => ({
  contacts_page_title: localizeUk('Контакти'),
  contacts_page_subtitle: localizeUk("Маєте запитання? Зв'яжіться з нами будь-яким зручним способом або заповніть форму зворотного зв'язку."),
  secondary_phone: '+38 (097) 123-45-67',
  room_note: localizeUk('Корпус 1, кімната 101'),
  weekend_hours_note: localizeUk('Сб-Нд: Вихідний'),
});

export const getContactEn = () => ({
  contacts_page_title: localizeEn(contactPageEn.contacts_page_title),
  contacts_page_subtitle: localizeEn(contactPageEn.contacts_page_subtitle),
  secondary_phone: '+38 (097) 123-45-67',
  room_note: localizeEn(contactPageEn.room_note),
  weekend_hours_note: localizeEn(contactPageEn.weekend_hours_note),
});
