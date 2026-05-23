import { localizeUk, localizeEn } from '../../locale';

export const getSiteSettingsUk = () => ({
  logo_line_1: localizeUk('Академія майбутнього ЦНО'),
  logo_line_2: localizeUk('ДНУ · демо-контент seed v2'),
  footer_copyright_template: localizeUk('© {year} Академія майбутнього ЦНО — демо-рядок зі Strapi'),
});

export const getSiteSettingsEn = () => ({
  logo_line_1: localizeEn('Future Academy CLE'),
  logo_line_2: localizeEn('DNU · seed demo content v2'),
  footer_copyright_template: localizeEn('© {year} Future Academy CLE — demo line from Strapi'),
});
