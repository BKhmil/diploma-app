import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'uk',
      locales: ['uk', 'en'],
    },
  },
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.office365.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USER', ''),
          pass: env('SMTP_PASS', ''),
        },
        secure: false,
        requireTLS: true,
      },
      settings: {
        defaultFrom: env('SMTP_FROM', env('SMTP_USER', 'no-reply@cno.dnu.edu.ua')),
        defaultReplyTo: env('SMTP_FROM', env('SMTP_USER', 'no-reply@cno.dnu.edu.ua')),
      },
    },
  },
});

export default config;
