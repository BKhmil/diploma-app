import { factories } from '@strapi/strapi';

const UID = 'api::application.application';

/** Media fields on the application that accept an uploaded document. */
const DOC_FIELDS = ['doc_diploma', 'doc_passport', 'doc_ipn', 'doc_photo'] as const;

/**
 * Create handler. JSON requests use the default controller. Multipart requests
 * (file uploads) need manual handling: the default controller can't read the
 * `data` field when it arrives as a form-data string, and it ignores files.
 */
export default factories.createCoreController(UID, ({ strapi }) => ({
	async create(ctx) {
		if (!ctx.is('multipart')) {
			return await super.create(ctx);
		}

		const rawData = (ctx.request.body as { data?: unknown } | undefined)?.data;
		let data: Record<string, unknown>;
		try {
			data = typeof rawData === 'string' ? JSON.parse(rawData) : ((rawData as Record<string, unknown>) ?? {});
		} catch {
			return ctx.badRequest('Invalid "data" payload');
		}

		// Lifecycles still run here (duplicate check, num, email notification).
		const entry = await strapi.documents(UID).create({ data: data as never });

		// Attach each uploaded file to its field.
		const files = (ctx.request.files ?? {}) as Record<string, unknown>;
		const uploadService = strapi.plugin('upload').service('upload');
		for (const field of DOC_FIELDS) {
			const file = files[`files.${field}`];
			if (!file) continue;
			try {
				await uploadService.upload({
					data: { ref: UID, refId: entry.id, field },
					files: file,
				});
			} catch (err) {
				strapi.log.warn(`[application] Failed to attach ${field}: ${String(err)}`);
			}
		}

		// Return the entry with its media populated.
		const populated = await strapi.documents(UID).findOne({
			documentId: entry.documentId,
			populate: DOC_FIELDS as unknown as string[],
		});

		ctx.status = 201;
		return this.transformResponse(populated);
	},
}));
