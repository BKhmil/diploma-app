import { errors } from '@strapi/utils';

async function handleApproval(applicationId: number) {
  // Load full application with program relation
  const app = await (strapi as any).db.query('api::application.application').findOne({
    where: { id: applicationId },
    populate: ['program'],
  });
  if (!app || !app.email) return;

  // Split full_name into parts (Last First Middle)
  const nameParts = (app.full_name ?? '').trim().split(/\s+/);
  const last_name   = nameParts[0] ?? app.full_name ?? '';
  const first_name  = nameParts[1] ?? '';
  const middle_name = nameParts[2] ?? '';

  // Find or create Student by email
  let student = await (strapi as any).db.query('api::student.student').findOne({
    where: { email: app.email },
  });

  if (!student) {
    student = await (strapi as any).db.query('api::student.student').create({
      data: {
        last_name,
        first_name,
        middle_name: middle_name || null,
        email: app.email,
        phone: app.phone ?? null,
        program_name: app.program_name ?? null,
        enrolled: new Date().toISOString().slice(0, 10),
        status: 'active',
      },
    });
    (strapi as any).log.info(`[enrollment] Created student ${app.email}`);
  } else {
    (strapi as any).log.info(`[enrollment] Found existing student ${app.email}`);
  }

  // Check if enrollment for this application already exists
  const existingEnrollment = await (strapi as any).db.query('api::enrollment.enrollment').findOne({
    where: { application: applicationId },
  });
  if (existingEnrollment) {
    (strapi as any).log.info(`[enrollment] Enrollment already exists for application #${applicationId}`);
    return;
  }

  // Create Enrollment
  await (strapi as any).db.query('api::enrollment.enrollment').create({
    data: {
      student:     student.id,
      program:     app.program?.id ?? null,
      application: applicationId,
      enrolled_at: new Date().toISOString().slice(0, 10),
      status:      'active',
    },
  });
  (strapi as any).log.info(`[enrollment] Created enrollment for student ${app.email} → program ${app.program_name ?? '—'}`);
}

export default {
  async beforeCreate(event: any) {
    const { data } = event.params;

    // Duplicate check: same email + same program_name (non-contact applications only)
    if (data.app_type !== 'contact' && data.email && data.program_name) {
      const existing = await (strapi as any).db.query('api::application.application').findOne({
        where: {
          email:        data.email,
          program_name: data.program_name,
          app_type:     { $ne: 'contact' },
        },
      });
      if (existing) {
        throw new errors.ValidationError(
          `Ви вже подавали заявку на програму "${data.program_name}"`,
          { code: 'DUPLICATE_APPLICATION' }
        );
      }
    }

    // Auto-increment num
    try {
      const last = await (strapi as any).db.query('api::application.application').findMany({
        where: { num: { $notNull: true } },
        orderBy: { num: 'desc' },
        limit: 1,
        select: ['num'],
      });
      const lastNum = (last?.[0]?.num && last[0].num > 1000) ? last[0].num : 1000;
      event.params.data.num = lastNum + 1;
    } catch {
      event.params.data.num = Date.now() % 10000;
    }
  },

  async afterUpdate(event: any) {
    const { result } = event;
    if (result?.status === 'accepted') {
      try {
        await handleApproval(result.id);
      } catch (err) {
        (strapi as any).log.error(`[enrollment] afterUpdate error: ${String(err)}`);
      }
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
