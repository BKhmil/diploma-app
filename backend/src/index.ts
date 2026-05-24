import type { Core } from '@strapi/strapi';
import { runSeedSync } from './seed';

// ─────────────────────────────────────────────────────────────────────────────
// Permission policy
//
// PUBLIC role  — anonymous visitors (no JWT). Read-only public content +
//                form submissions (application.create).
// AUTHENTICATED — admin dashboard users (logged in with @strapi/users-permissions
//                JWT). Full CRUD on operational resources.
//
// Public read permissions are NOT granted to Authenticated by design — the
// frontend uses `publicRequest` (no JWT) for public content fetches, so a
// logged-in admin browsing the public site still gets the Public role for
// reads, while the admin dashboard sends the JWT for writes only.
// ─────────────────────────────────────────────────────────────────────────────

const PUBLIC_READ_CONTENT_TYPES = [
	'program.program',
	'category.category',
	'news.news',
	'graduate.graduate',
	'document.document',
	'partner.partner',
	'internship.internship',
	'pre-university-group.pre-university-group',
	'staff-member.staff-member',
	'home-page.home-page',
	'about-page.about-page',
	'contact-info.contact-info',
	'alumni-page.alumni-page',
	'qualification-page.qualification-page',
	'retraining-page.retraining-page',
	'partners-page.partners-page',
	'pre-university-page.pre-university-page',
	'apply-page.apply-page',
	'programs-page.programs-page',
	'staff-page.staff-page',
	'documents-page.documents-page',
	'not-found-page.not-found-page',
	'site-settings.site-settings',
];

const PUBLIC_ACTIONS = [
	...PUBLIC_READ_CONTENT_TYPES.flatMap((uid) => [
		`api::${uid}.find`,
		`api::${uid}.findOne`,
	]),
	// Form submissions from public Apply / Contact pages
	'api::application.application.create',
];

const AUTHENTICATED_ACTIONS = [
	// Programs CRUD (admin dashboard)
	'api::program.program.create',
	'api::program.program.update',
	'api::program.program.delete',
	// Application management — review / status updates / cleanup
	'api::application.application.find',
	'api::application.application.findOne',
	'api::application.application.create',
	'api::application.application.update',
	'api::application.application.delete',
	// Student records (admin only)
	'api::student.student.find',
	'api::student.student.findOne',
	'api::student.student.create',
	'api::student.student.update',
	'api::student.student.delete',
	// Enrollment records (admin only)
	'api::enrollment.enrollment.find',
	'api::enrollment.enrollment.findOne',
	'api::enrollment.enrollment.create',
	'api::enrollment.enrollment.update',
	'api::enrollment.enrollment.delete',
];

async function syncRolePermissions(
	strapi: Core.Strapi,
	roleType: string,
	desiredActions: string[],
): Promise<void> {
	const role = await strapi.db
		.query('plugin::users-permissions.role')
		.findOne({ where: { type: roleType } }) as { id: number } | null;

	if (!role) return;

	const existing = await strapi.db
		.query('plugin::users-permissions.permission')
		.findMany({
			where: { role: role.id },
			select: ['id', 'action'],
		}) as Array<{ id: number; action: string }>;

	const existingActions = new Set(existing.map((p) => p.action));
	const desiredSet = new Set(desiredActions);

	// Add missing
	for (const action of desiredActions) {
		if (existingActions.has(action)) continue;
		await strapi.db.query('plugin::users-permissions.permission').create({
			data: { action, role: role.id },
		});
	}

	// Revoke anything not in the desired set, but only for the actions we manage.
	// We keep U&P plugin auth permissions and any unrelated entries untouched.
	const managedPrefixes = ['api::'];
	for (const perm of existing) {
		if (desiredSet.has(perm.action)) continue;
		if (!managedPrefixes.some((p) => perm.action.startsWith(p))) continue;
		await strapi.db.query('plugin::users-permissions.permission').delete({
			where: { id: perm.id },
		});
		strapi.log.info(`[perms] Revoked "${perm.action}" from role "${roleType}"`);
	}
}

const ensurePublicPermissions = async (strapi: Core.Strapi) => {
	try {
		await syncRolePermissions(strapi, 'public', PUBLIC_ACTIONS);
		await syncRolePermissions(strapi, 'authenticated', AUTHENTICATED_ACTIONS);
	} catch (error) {
		strapi.log.warn(
			`Failed to auto-configure role permissions: ${String(error)}`,
		);
	}
};

const backfillI18nLocales = async (strapi: Core.Strapi) => {
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
	async bootstrap({ strapi }: { strapi: Core.Strapi }) {
		await ensurePublicPermissions(strapi);
		await runSeedSync(strapi);
		await backfillI18nLocales(strapi);
	},
};
