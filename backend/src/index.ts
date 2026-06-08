import type { Core } from '@strapi/strapi';
import { runSeedSync } from './seed';

// ─────────────────────────────────────────────────────────────────────────────
// Permission policy
//
// PUBLIC role  — anonymous visitors (no JWT). Read-only public content +
//                form submissions (application.create) + file uploads.
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
	'staff-member.staff-member',
	'pre-university-group.pre-university-group',
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
	// File uploads for applications (doc_diploma, doc_passport, etc.)
	'plugin::upload.content-api.upload',
	'plugin::upload.content-api.find',
	'plugin::upload.content-api.findOne',
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
	const managedPrefixes = ['api::', 'plugin::upload'];
	for (const perm of existing) {
		if (desiredSet.has(perm.action)) continue;
		if (!managedPrefixes.some((p) => perm.action.startsWith(p))) continue;
		await strapi.db.query('plugin::users-permissions.permission').delete({
			where: { id: perm.id },
		});
		strapi.log.info(`[perms] Revoked "${perm.action}" from role "${roleType}"`);
	}
}

const ensureUkLocale = async (strapi: Core.Strapi) => {
	try {
		const existing = await strapi.db
			.query('plugin::i18n.locale')
			.findOne({ where: { code: 'uk' } });

		if (!existing) {
			await strapi.db.query('plugin::i18n.locale').create({
				data: { name: 'Ukrainian (uk)', code: 'uk' },
			});
			strapi.log.info('[i18n] Registered "uk" locale in database');
		}
	} catch (error) {
		strapi.log.warn(`[i18n] Failed to ensure uk locale: ${String(error)}`);
	}
};

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

/** Disable public self-registration — only Strapi admins can create Users. */
const disablePublicRegistration = async (strapi: Core.Strapi) => {
	try {
		const upStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
		const advanced = await upStore.get({ key: 'advanced' }) as Record<string, unknown> | null;
		if (advanced && advanced.allow_register !== false) {
			await upStore.set({ key: 'advanced', value: { ...advanced, allow_register: false } });
			strapi.log.info('[auth] Disabled public self-registration');
		}
	} catch (error) {
		strapi.log.warn(`[auth] Failed to disable public registration: ${String(error)}`);
	}
};

/**
 * Auto-provision first Strapi superadmin from env vars on fresh install.
 * Only runs when there are no admin users at all.
 *
 * Required env: SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD
 * Optional env: SUPERADMIN_FIRSTNAME, SUPERADMIN_LASTNAME
 */
const provisionFirstSuperadmin = async (strapi: Core.Strapi) => {
	try {
		if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASSWORD) {
			return; // No env creds configured — skip silently
		}

		const adminCount = await strapi.db.query('admin::user').count();
		if (adminCount > 0) {
			return; // Already have at least one admin
		}

		const role = await strapi.db.query('admin::role').findOne({
			where: { code: 'strapi-super-admin' },
		}) as { id: number } | null;

		if (!role) {
			strapi.log.warn('[superadmin] Could not find super-admin role — skipping auto-provision');
			return;
		}

		await strapi.service('admin::user').create({
			email: process.env.SUPERADMIN_EMAIL,
			firstname: process.env.SUPERADMIN_FIRSTNAME || 'ЦНО',
			lastname: process.env.SUPERADMIN_LASTNAME || 'Admin',
			password: process.env.SUPERADMIN_PASSWORD,
			isActive: true,
			roles: [role.id],
		});

		strapi.log.info(`[superadmin] Provisioned superadmin: ${process.env.SUPERADMIN_EMAIL}`);
	} catch (error) {
		strapi.log.warn(`[superadmin] Failed to provision superadmin: ${String(error)}`);
	}
};

export default {
	register() {},
	async bootstrap({ strapi }: { strapi: Core.Strapi }) {
		await ensureUkLocale(strapi);
		await ensurePublicPermissions(strapi);
		await disablePublicRegistration(strapi);
		await provisionFirstSuperadmin(strapi);
		await runSeedSync(strapi);
		await backfillI18nLocales(strapi);
	},
};
