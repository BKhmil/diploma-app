import { runSeedSync } from './seed';

const PUBLIC_ACTIONS = [
	'api::program.program.find',
	'api::program.program.findOne',
	'api::program.program.create',
	'api::program.program.update',
	'api::program.program.delete',
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
	'api::staff-member.staff-member.find',
	'api::staff-member.staff-member.findOne',
	'api::home-page.home-page.find',
	'api::home-page.home-page.findOne',
	'api::about-page.about-page.find',
	'api::about-page.about-page.findOne',
	'api::contact-info.contact-info.find',
	'api::contact-info.contact-info.findOne',
	'api::alumni-page.alumni-page.find',
	'api::alumni-page.alumni-page.findOne',
	'api::qualification-page.qualification-page.find',
	'api::qualification-page.qualification-page.findOne',
	'api::retraining-page.retraining-page.find',
	'api::retraining-page.retraining-page.findOne',
	'api::partners-page.partners-page.find',
	'api::partners-page.partners-page.findOne',
	'api::pre-university-page.pre-university-page.find',
	'api::pre-university-page.pre-university-page.findOne',
	'api::application.application.create',
	'api::application.application.find',
	'api::application.application.findOne',
	'api::application.application.update',
	'api::application.application.delete',
	'api::student.student.find',
	'api::student.student.findOne',
	'api::student.student.create',
	'api::student.student.update',
	'api::student.student.delete',
	'api::enrollment.enrollment.find',
	'api::enrollment.enrollment.findOne',
	'api::enrollment.enrollment.create',
	'api::enrollment.enrollment.update',
	'api::enrollment.enrollment.delete',
	'api::news.news.find',
	'api::news.news.findOne',
	'api::apply-page.apply-page.find',
	'api::apply-page.apply-page.findOne',
	'api::programs-page.programs-page.find',
	'api::programs-page.programs-page.findOne',
	'api::staff-page.staff-page.find',
	'api::staff-page.staff-page.findOne',
	'api::documents-page.documents-page.find',
	'api::documents-page.documents-page.findOne',
	'api::not-found-page.not-found-page.find',
	'api::not-found-page.not-found-page.findOne',
	'api::site-settings.site-settings.find',
	'api::site-settings.site-settings.findOne',
];

const ensurePublicPermissions = async (strapi: any) => {
	try {
		const publicRole = await strapi.db
			.query('plugin::users-permissions.role')
			.findOne({
				where: { type: 'public' },
			});

		if (!publicRole) return;

		const existing = await strapi.db
			.query('plugin::users-permissions.permission')
			.findMany({
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
		strapi.log.warn(
			`Failed to auto-configure public permissions: ${String(error)}`,
		);
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
		'qualification_pages',
		'retraining_pages',
		'partners_pages',
		'pre_university_pages',
		'apply_pages',
		'programs_pages',
		'staff_pages',
		'documents_pages',
		'not_found_pages',
		'site_settings',
	];

	for (const table of localizedTables) {
		try {
			await strapi.db.connection.raw(
				`UPDATE "${table}" SET "locale" = 'uk' WHERE "locale" IS NULL OR "locale" = ''`,
			);
		} catch (error) {
			strapi.log.warn(
				`Failed to backfill locale for table "${table}": ${String(error)}`,
			);
		}
	}
};

export default {
	register() {},
	async bootstrap({ strapi }: { strapi: any }) {
		await ensurePublicPermissions(strapi);
		await runSeedSync(strapi);
		await backfillI18nLocales(strapi);
	},
};
