export default {
  async beforeCreate(event: any) {
    // Auto-increment num
    try {
      const last = await (strapi as any).db.query('api::application.application').findMany({
        orderBy: { num: 'desc' },
        limit: 1,
        select: ['num'],
      });
      const lastNum = last?.[0]?.num ?? 1000;
      event.params.data.num = lastNum + 1;
    } catch {
      event.params.data.num = Date.now() % 10000;
    }
  },

  async afterCreate(event: any) {
    const { result } = event;

    try {
      // Get notification email from contact-info or fall back to env
      let notifyEmail: string = process.env.ADMIN_NOTIFY_EMAIL || 'admin@cno.dnu.edu.ua';

      try {
        const contactInfo = await (strapi as any).db
          .query('api::contact-info.contact-info')
          .findOne({ where: { locale: 'uk' } });
        if (contactInfo?.email) notifyEmail = contactInfo.email;
      } catch {
        // ignore, use default
      }

      const isContact = result.app_type === 'contact';
      const subject = isContact
        ? `[ЦНО ДНУ] Нове повідомлення від ${result.full_name}`
        : `[ЦНО ДНУ] Нова заявка #${result.id} — ${result.full_name}`;

      const bodyLines: string[] = isContact
        ? [
            `<h2>Нове повідомлення з форми зворотного зв'язку</h2>`,
            `<p><strong>Від:</strong> ${result.full_name}</p>`,
            `<p><strong>Email:</strong> ${result.email}</p>`,
            result.phone ? `<p><strong>Телефон:</strong> ${result.phone}</p>` : '',
            result.message ? `<p><strong>Повідомлення:</strong><br/>${result.message}</p>` : '',
          ]
        : [
            `<h2>Нова заявка на навчання</h2>`,
            `<p><strong>Заявник:</strong> ${result.full_name}</p>`,
            `<p><strong>Email:</strong> ${result.email}</p>`,
            result.phone ? `<p><strong>Телефон:</strong> ${result.phone}</p>` : '',
            result.program_name ? `<p><strong>Програма:</strong> ${result.program_name}</p>` : '',
            result.organization ? `<p><strong>Місце роботи:</strong> ${result.organization}</p>` : '',
            result.city ? `<p><strong>Місто:</strong> ${result.city}</p>` : '',
            result.message ? `<p><strong>Побажання:</strong><br/>${result.message}</p>` : '',
            `<hr/>`,
            `<p style="color:#888;font-size:12px">Заявка #${result.id} · ${new Date().toLocaleString('uk-UA')}</p>`,
          ];

      await (strapi as any).plugins['email'].services.email.send({
        to: notifyEmail,
        replyTo: result.email,
        subject,
        html: bodyLines.filter(Boolean).join('\n'),
      });
    } catch (err) {
      (strapi as any).log.warn(`[email] Failed to send notification: ${String(err)}`);
    }
  },
};
