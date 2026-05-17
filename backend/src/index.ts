const PUBLIC_ACTIONS = [
  'api::program.program.find',
  'api::program.program.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
  'api::news.news.find',
  'api::news.news.findOne',
  'api::graduate.graduate.find',
  'api::graduate.graduate.findOne',
  'api::document.document.find',
  'api::document.document.findOne',
  'api::partner.partner.find',
  'api::partner.partner.findOne',
  'api::internship.internship.find',
  'api::internship.internship.findOne',
  'api::pre-university-group.pre-university-group.find',
  'api::pre-university-group.pre-university-group.findOne',
  'api::home-page.home-page.find',
  'api::home-page.home-page.findOne',
  'api::about-page.about-page.find',
  'api::about-page.about-page.findOne',
  'api::contact-info.contact-info.find',
  'api::contact-info.contact-info.findOne',
  'api::alumni-page.alumni-page.find',
  'api::alumni-page.alumni-page.findOne',
  'api::application.application.create',
];

const ensurePublicPermissions = async (strapi: any) => {
  try {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) return;

    const existing = await strapi.db.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id },
      select: ['id', 'action'],
    });

    for (const action of PUBLIC_ACTIONS) {
      const match = existing.find((perm: any) => perm.action === action);
      if (match) continue;

      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  } catch (error) {
    strapi.log.warn(`Failed to auto-configure public permissions: ${String(error)}`);
  }
};

const backfillI18nLocales = async (strapi: any) => {
  const localizedTables = [
    'programs',
    'news',
    'home_pages',
    'about_pages',
    'contact_infos',
    'documents',
    'partners',
    'staff_members',
    'graduates',
    'pre_university_groups',
    'alumni_pages',
  ];

  for (const table of localizedTables) {
    try {
      await strapi.db.connection.raw(
        `UPDATE "${table}" SET "locale" = 'uk' WHERE "locale" IS NULL OR "locale" = ''`
      );
    } catch (error) {
      strapi.log.warn(`Failed to backfill locale for table "${table}": ${String(error)}`);
    }
  }
};

const ensureLocaleSuffix = (value: unknown, locale: 'uk' | 'en') => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  const withoutSuffix = trimmed.replace(/\s+\((uk|en)\)$/i, '');
  return `${withoutSuffix} (${locale})`;
};

const pickString = (preferred: unknown, fallback: string) => {
  if (typeof preferred === 'string' && preferred.trim()) return preferred;
  return fallback;
};

const autoFillFooterLocales = async (strapi: any) => {
  const query = strapi.db.query('api::contact-info.contact-info');
  const fallbackUk = {
    address: 'пр. Науки, 72, м. Дніпро, 49010',
    phone: '+38 (056) 123-45-67',
    email: 'info@cno.dnu.edu.ua',
    footer_about_title: 'Центр неперервної освіти',
    footer_about_description:
      'Сучасна освітня платформа Дніпровського національного університету імені Олеся Гончара. Ми створюємо можливості для навчання протягом усього життя.',
    footer_nav_title: 'Навігація',
    footer_nav_about_label: 'Про Центр',
    footer_nav_qualification_label: 'Підвищення кваліфікації',
    footer_nav_retraining_label: 'Перепідготовка',
    footer_nav_pre_university_label: 'Вступникам',
    footer_nav_alumni_label: 'Випускники',
    footer_contacts_title: 'Контакти',
    footer_social_title: 'Ми в соцмережах',
    facebook_url: '#',
    instagram_url: '#',
  };

  const translatedEn = {
    address: '72 Nauky Ave, Dnipro, 49010',
    phone: '+38 (056) 123-45-67',
    email: 'info@cno.dnu.edu.ua',
    footer_about_title: 'Center for Lifelong Education',
    footer_about_description:
      'A modern educational platform of Oles Honchar Dnipro National University. We create opportunities for lifelong learning.',
    footer_nav_title: 'Navigation',
    footer_nav_about_label: 'About the Center',
    footer_nav_qualification_label: 'Professional Development',
    footer_nav_retraining_label: 'Retraining',
    footer_nav_pre_university_label: 'For Applicants',
    footer_nav_alumni_label: 'Alumni',
    footer_contacts_title: 'Contacts',
    footer_social_title: 'Follow Us',
    facebook_url: '#',
    instagram_url: '#',
  };

  const allRows = await query.findMany();
  const ukEntry = allRows.find((row: any) => row.locale === 'uk');
  const enEntry = allRows.find((row: any) => row.locale === 'en');
  const seedEntry = ukEntry || enEntry || allRows[0] || null;

  const ukData = {
    address: pickString(ukEntry?.address || enEntry?.address, fallbackUk.address),
    phone: pickString(ukEntry?.phone || enEntry?.phone, fallbackUk.phone),
    email: pickString(ukEntry?.email || enEntry?.email, fallbackUk.email),
    footer_about_title: ensureLocaleSuffix(
      pickString(ukEntry?.footer_about_title, fallbackUk.footer_about_title),
      'uk'
    ),
    footer_about_description: ensureLocaleSuffix(
      pickString(ukEntry?.footer_about_description, fallbackUk.footer_about_description),
      'uk'
    ),
    footer_nav_title: ensureLocaleSuffix(
      pickString(ukEntry?.footer_nav_title, fallbackUk.footer_nav_title),
      'uk'
    ),
    footer_nav_about_label: ensureLocaleSuffix(
      pickString(ukEntry?.footer_nav_about_label, fallbackUk.footer_nav_about_label),
      'uk'
    ),
    footer_nav_qualification_label: ensureLocaleSuffix(
      pickString(ukEntry?.footer_nav_qualification_label, fallbackUk.footer_nav_qualification_label),
      'uk'
    ),
    footer_nav_retraining_label: ensureLocaleSuffix(
      pickString(ukEntry?.footer_nav_retraining_label, fallbackUk.footer_nav_retraining_label),
      'uk'
    ),
    footer_nav_pre_university_label: ensureLocaleSuffix(
      pickString(ukEntry?.footer_nav_pre_university_label, fallbackUk.footer_nav_pre_university_label),
      'uk'
    ),
    footer_nav_alumni_label: ensureLocaleSuffix(
      pickString(ukEntry?.footer_nav_alumni_label, fallbackUk.footer_nav_alumni_label),
      'uk'
    ),
    footer_contacts_title: ensureLocaleSuffix(
      pickString(ukEntry?.footer_contacts_title, fallbackUk.footer_contacts_title),
      'uk'
    ),
    footer_social_title: ensureLocaleSuffix(
      pickString(ukEntry?.footer_social_title, fallbackUk.footer_social_title),
      'uk'
    ),
    facebook_url: pickString(ukEntry?.facebook_url || enEntry?.facebook_url, fallbackUk.facebook_url),
    instagram_url: pickString(ukEntry?.instagram_url || enEntry?.instagram_url, fallbackUk.instagram_url),
  };

  if (ukEntry) {
    await query.update({
      where: { id: ukEntry.id },
      data: ukData,
    });
  } else {
    await query.create({
      data: {
        ...ukData,
        locale: 'uk',
        publishedAt: seedEntry?.publishedAt || null,
      },
    });
  }

  const enData = {
    address: pickString(enEntry?.address, translatedEn.address),
    phone: pickString(enEntry?.phone, translatedEn.phone),
    email: pickString(enEntry?.email, translatedEn.email),
    footer_about_title: ensureLocaleSuffix(
      pickString(enEntry?.footer_about_title, translatedEn.footer_about_title),
      'en'
    ),
    footer_about_description: ensureLocaleSuffix(
      pickString(enEntry?.footer_about_description, translatedEn.footer_about_description),
      'en'
    ),
    footer_nav_title: ensureLocaleSuffix(
      pickString(enEntry?.footer_nav_title, translatedEn.footer_nav_title),
      'en'
    ),
    footer_nav_about_label: ensureLocaleSuffix(
      pickString(enEntry?.footer_nav_about_label, translatedEn.footer_nav_about_label),
      'en'
    ),
    footer_nav_qualification_label: ensureLocaleSuffix(
      pickString(enEntry?.footer_nav_qualification_label, translatedEn.footer_nav_qualification_label),
      'en'
    ),
    footer_nav_retraining_label: ensureLocaleSuffix(
      pickString(enEntry?.footer_nav_retraining_label, translatedEn.footer_nav_retraining_label),
      'en'
    ),
    footer_nav_pre_university_label: ensureLocaleSuffix(
      pickString(enEntry?.footer_nav_pre_university_label, translatedEn.footer_nav_pre_university_label),
      'en'
    ),
    footer_nav_alumni_label: ensureLocaleSuffix(
      pickString(enEntry?.footer_nav_alumni_label, translatedEn.footer_nav_alumni_label),
      'en'
    ),
    footer_contacts_title: ensureLocaleSuffix(
      pickString(enEntry?.footer_contacts_title, translatedEn.footer_contacts_title),
      'en'
    ),
    footer_social_title: ensureLocaleSuffix(
      pickString(enEntry?.footer_social_title, translatedEn.footer_social_title),
      'en'
    ),
    facebook_url: pickString(enEntry?.facebook_url, ukData.facebook_url),
    instagram_url: pickString(enEntry?.instagram_url, ukData.instagram_url),
  };

  if (enEntry) {
    await query.update({
      where: { id: enEntry.id },
      data: enData,
    });
    return;
  }

  await query.create({
    data: {
      ...enData,
      locale: 'en',
      publishedAt: seedEntry?.publishedAt || null,
    },
  });
};

const seedData = async (strapi: any) => {
  const categoriesCount = await strapi.db.query('api::category.category').count();
  if (categoriesCount === 0) {
    await strapi.db.query('api::category.category').createMany({
      data: [
        { name: 'Підвищення кваліфікації', slug: 'pidvyshchennia-kvalifikatsii' },
        { name: 'Перепідготовка', slug: 'perepidhotovka' },
        { name: 'Підготовка до НМТ', slug: 'pidhotovka-do-nmt' },
      ],
    });
  }

  const programsCount = await strapi.db.query('api::program.program').count();
  if (programsCount === 0) {
    await strapi.db.query('api::program.program').createMany({
      data: [
        {
          title: 'Педагогічна майстерність',
          category: 'qualification',
          duration: '1 місяць',
          format: 'online',
          description: 'Сучасні методи навчання та цифрові інструменти.',
          target_audience: 'Вчителі, викладачі, тренери',
          price: '1 800 грн',
          status: 'active',
        },
        {
          title: 'Цифрова грамотність для освітян',
          category: 'qualification',
          duration: '1 місяць',
          format: 'mixed',
          description: 'Google Workspace, Canva, AI інструменти для освітян.',
          target_audience: 'Педагоги, викладачі',
          price: '2 000 грн',
          status: 'active',
        },
        {
          title: 'Психологія стресу та кризових станів',
          category: 'qualification',
          duration: '2 місяці',
          format: 'online',
          description: 'Робота з ПТСР та кризовими станами.',
          target_audience: 'Психологи, соціальні працівники',
          price: '3 500 грн',
          status: 'active',
        },
        {
          title: 'Публічне управління та адміністрування',
          category: 'master',
          duration: '1,5 роки',
          format: 'mixed',
          description: 'Магістерська програма з публічного управління.',
          target_audience: 'Держслужбовці, управлінці',
          price: '28 000 грн/рік',
          status: 'active',
        },
        {
          title: 'Підготовка до НМТ: Математика',
          category: 'pre-university',
          duration: '8 місяців',
          format: 'offline',
          description: 'Поглиблена підготовка до НМТ з математики.',
          target_audience: 'Учні 10-11 класів',
          price: '800 грн/міс',
          status: 'active',
        },
      ],
    });
  }

  const newsCount = await strapi.db.query('api::news.news').count();
  if (newsCount === 0) {
    await strapi.db.query('api::news.news').createMany({
      data: [
        {
          title: 'Відкрито набір на курси підвищення кваліфікації',
          excerpt: 'Запрошуємо педагогічних працівників на нові програми.',
          category: 'announcement',
          is_pinned: true,
        },
        {
          title: 'День відкритих дверей у Центрі неперервної освіти',
          excerpt: 'Запрошуємо ознайомитись з програмами та викладачами.',
          category: 'event',
          is_pinned: false,
        },
        {
          title: 'Нова програма: Штучний інтелект у бізнесі',
          excerpt: 'Стартує новий курс для підприємців.',
          category: 'news',
          is_pinned: false,
        },
      ],
    });
  }

  const partnersCount = await strapi.db.query('api::partner.partner').count();
  if (partnersCount === 0) {
    await strapi.db.query('api::partner.partner').createMany({
      data: [
        {
          name: 'Дніпровська міська рада',
          type: 'organization',
          description: 'Партнерські освітні ініціативи.',
        },
        {
          name: 'Obrii IT Cluster',
          type: 'employer',
          description: 'Спільні програми для розвитку цифрових навичок.',
        },
      ],
    });
  }

  const preUniCount = await strapi.db.query('api::pre-university-group.pre-university-group').count();
  if (preUniCount === 0) {
    await strapi.db.query('api::pre-university-group.pre-university-group').create({
      data: {
        name: 'НМТ-математика (вечірня група)',
        subject: 'Математика',
        format: 'onsite',
        teacher: 'Коваль Світлана Іванівна',
        description: 'Поглиблена підготовка до НМТ у малих групах.',
      },
    });
  }

  const homePageCount = await strapi.db.query('api::home-page.home-page').count();
  if (homePageCount === 0) {
    await strapi.db.query('api::home-page.home-page').create({
      data: {
        hero_title: 'Навчання протягом життя',
        hero_subtitle: 'Центр неперервної освіти ДНУ',
        mission: 'Якісна післядипломна освіта для професійного розвитку.',
        stats_graduates: 50000,
        stats_programs: 120,
        stats_years: 30,
        seo_title: 'Центр післядипломної освіти ДНУ',
        seo_description: 'Програми підвищення кваліфікації, перепідготовки та НМТ.',
      },
    });
  }

  const contactInfoCount = await strapi.db.query('api::contact-info.contact-info').count();
  if (contactInfoCount === 0) {
    await strapi.db.query('api::contact-info.contact-info').create({
      data: {
        address: 'пр. Науки, 72, м. Дніпро, 49010',
        phone: '+38 (056) 123-45-67',
        email: 'info@cno.dnu.edu.ua',
        working_hours: 'Пн-Пт: 9:00-17:00',
        map_embed_url:
          'https://maps.google.com/maps?width=100%25&height=600&hl=uk&q=48.434606,35.034614+(ДНУ%20ім.%20Олеся%20Гончара)&t=&z=16&ie=UTF8&iwloc=&output=embed',
        footer_about_title: 'Центр неперервної освіти',
        footer_about_description:
          'Сучасна освітня платформа Дніпровського національного університету імені Олеся Гончара. Ми створюємо можливості для навчання протягом усього життя.',
        footer_nav_title: 'Навігація',
        footer_nav_about_label: 'Про Центр',
        footer_nav_qualification_label: 'Підвищення кваліфікації',
        footer_nav_retraining_label: 'Перепідготовка',
        footer_nav_pre_university_label: 'Вступникам',
        footer_nav_alumni_label: 'Випускники',
        footer_contacts_title: 'Контакти',
        footer_social_title: 'Ми в соцмережах',
        facebook_url: '#',
        instagram_url: '#',
      },
    });
  }

  const alumniPageCount = await strapi.db.query('api::alumni-page.alumni-page').count();
  if (alumniPageCount === 0) {
    await strapi.db.query('api::alumni-page.alumni-page').create({
      data: {
        hero_badge_text: 'Більше 50 000 випускників з 1995 року',
        hero_title: 'Наші випускники по всій Україні та за кордоном',
        hero_subtitle: "Дізнайтесь, як навчання в ЦНО ДНУ змінило кар'єру і життя наших слухачів.",
        cta_title: 'Станьте нашим випускником',
        cta_description: 'Приєднайтесь до спільноти 50 000+ фахівців, що обрали ЦНО ДНУ для свого розвитку.',
        employment_section_title: 'Де працюють наші випускники',
        employment_section_subtitle: 'Карта працевлаштування',
        employment_items: [
          {
            icon_key: 'education',
            value: '62%',
            label: 'Заклади освіти',
            sub: 'школи, ЗВО, ліцеї',
            order: 1,
          },
          {
            icon_key: 'business',
            value: '25%',
            label: 'Підприємства та бізнес',
            sub: 'після перепідготовки',
            order: 2,
          },
          {
            icon_key: 'government',
            value: '13%',
            label: 'Держструктури',
            sub: 'та громадські організації',
            order: 3,
          },
        ],
        achievements_section_title: 'Наші досягнення',
        achievement_items: [
          {
            icon_key: 'programs',
            title: '120+ програм',
            description: 'Від короткострокових курсів до магістерських програм',
            order: 1,
          },
          {
            icon_key: 'budget',
            title: '90% бюджет',
            description: 'Наших НМТ-випускників вступають на бюджетну форму',
            order: 2,
          },
          {
            icon_key: 'partners',
            title: '200+ партнерів',
            description: 'Роботодавці та організації співпрацюють з центром',
            order: 3,
          },
        ],
      },
    });
  }
};

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: any }) {
    await ensurePublicPermissions(strapi);
    await seedData(strapi);
    await backfillI18nLocales(strapi);
    await autoFillFooterLocales(strapi);
  },
};
