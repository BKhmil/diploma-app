import type { Core } from '@strapi/strapi';
import { seedPrograms } from '../content/programs';
import { seedStaff, staffEnTranslations } from '../content/staff';
import { seedPartners, partnersEnTranslations } from '../content/partners';
import { seedGraduates, graduatesEnTranslations } from '../content/graduates';
import { seedDocuments, documentsEnTranslations } from '../content/documents';
import { seedNews, newsEnTranslations } from '../content/news';
import { seedPreUniversitySubjects, preUniversityEnTranslations } from '../content/preUniversitySubjects';
import { programTranslations } from '../translate';

/** Upsert a localized collection entry; `where` is the stable natural key (e.g. program_code). */
async function upsertLocale(
	strapi: Core.Strapi,
	uid: string,
	where: Record<string, unknown>,
	ukData: Record<string, unknown>,
	enData: Record<string, unknown>
) {
	const svc = strapi.documents(uid as Parameters<typeof strapi.documents>[0]);

	// Find existing uk entry
	const existingUk = await strapi.db.query(uid).findOne({ where: { ...where, locale: 'uk' } }) as { id: number; documentId?: string } | null;

	let documentId: string;

	if (existingUk?.documentId) {
		documentId = existingUk.documentId;
		await svc.update({ documentId, locale: 'uk', data: ukData as any } as any);
	} else {
		const created = await svc.create({ locale: 'uk', data: { ...ukData, ...where } as any } as any) as { documentId: string };
		documentId = created.documentId;
	}

	// Link en to the same document. update() creates the locale if it's missing;
	// non-localized fields are shared from the uk version.
	try {
		await svc.update({ documentId, locale: 'en', data: enData as any } as any);
	} catch (err) {
		strapi.log.warn(`[seed] Failed to upsert en locale for ${uid} where=${JSON.stringify(where)}: ${String(err)}`);
	}
}

export async function syncPrograms(strapi: Core.Strapi) {
	for (const prog of seedPrograms) {
		const en = programTranslations[prog.program_code];
		const ukData: Record<string, unknown> = {
			title: prog.title,
			description: prog.description,
			target_audience: prog.target_audience,
			certificate: prog.certificate,
			duration: prog.duration,
			duration_unit: prog.duration_unit,
			format: prog.format,
			credits: prog.credits,
			group_size: prog.group_size,
			start_date: prog.start_date,
			price: prog.price,
			outcomes: prog.outcomes ?? [],
			modules: prog.modules ?? [],
			faq: prog.faq ?? [],
			category: prog.category,
			status: prog.status,
			is_featured: prog.is_featured ?? false,
			icon_emoji: prog.icon_emoji,
			price_hint: prog.price_hint,
		};
		const enData: Record<string, unknown> = {
			title: en ? en.title : prog.title,
			description: en ? en.description : prog.description,
			target_audience: en ? en.targetAudience : prog.target_audience,
			certificate: prog.certificate,
			duration: prog.duration,
			duration_unit: prog.duration_unit,
			format: prog.format,
			credits: prog.credits,
			group_size: prog.group_size,
			start_date: prog.start_date,
			price: prog.price,
			outcomes: en ? en.outcomes : (prog.outcomes ?? []),
			modules: en ? en.modules : (prog.modules ?? []),
			faq: en ? en.faq : (prog.faq ?? []),
			category: prog.category,
			status: prog.status,
			is_featured: prog.is_featured ?? false,
			icon_emoji: prog.icon_emoji,
			price_hint: prog.price_hint,
		};
		await upsertLocale(strapi, 'api::program.program', { program_code: prog.program_code }, ukData, enData);
	}
}

export async function syncStaff(strapi: Core.Strapi) {
	for (const member of seedStaff) {
		if (!member.email) continue;
		const enTrans = staffEnTranslations[member.email] || {};
		const ukData: Record<string, unknown> = {
			name: member.name,
			position: member.position,
			degree: member.degree,
			department: member.department,
			experience: member.experience,
			programs_count: member.programs_count,
			tags: member.tags ?? [],
			role: member.role,
			email: member.email,
		};
		const enData: Record<string, unknown> = {
			name: member.name,
			position: enTrans.position ?? member.position,
			degree: enTrans.degree ?? member.degree,
			department: enTrans.department ?? member.department,
			experience: member.experience,
			programs_count: member.programs_count,
			tags: enTrans.tags ?? member.tags ?? [],
			role: member.role,
			email: member.email,
		};
		await upsertLocale(strapi, 'api::staff-member.staff-member', { email: member.email }, ukData, enData);
	}
}

export async function syncPartners(strapi: Core.Strapi) {
	for (const partner of seedPartners) {
		const enTrans = partnersEnTranslations[partner.name] || {};
		const ukData: Record<string, unknown> = {
			name: partner.name,
			type: partner.type,
			city: partner.city,
			agreement: partner.agreement,
			description: partner.description,
		};
		const enData: Record<string, unknown> = {
			name: enTrans.name ?? partner.name,
			type: partner.type,
			city: enTrans.city ?? partner.city,
			agreement: enTrans.agreement ?? partner.agreement,
			description: enTrans.description ?? partner.description,
		};
		await upsertLocale(strapi, 'api::partner.partner', { name: partner.name }, ukData, enData);
	}
}

export async function syncGraduates(strapi: Core.Strapi) {
	for (const grad of seedGraduates) {
		const enTrans = graduatesEnTranslations[grad.name] || {};
		const ukData: Record<string, unknown> = {
			name: grad.name,
			program: grad.program,
			position: grad.position,
			organization: grad.organization,
			year: grad.year,
			rating: grad.rating,
			story: grad.story,
			is_featured: grad.is_featured,
		};
		const enData: Record<string, unknown> = {
			name: grad.name,
			program: enTrans.program ?? grad.program,
			position: enTrans.position ?? grad.position,
			organization: enTrans.organization ?? grad.organization,
			year: grad.year,
			rating: grad.rating,
			story: enTrans.story ?? grad.story,
			is_featured: grad.is_featured,
		};
		await upsertLocale(strapi, 'api::graduate.graduate', { name: grad.name }, ukData, enData);
	}
}

export async function syncDocuments(strapi: Core.Strapi) {
	for (const doc of seedDocuments) {
		const enTrans = documentsEnTranslations[doc.document_code] || {};
		const ukData: Record<string, unknown> = {
			title: doc.title,
			meta: doc.meta,
			description: doc.description,
			type: doc.type,
			doc_category: doc.doc_category,
		};
		const enData: Record<string, unknown> = {
			title: enTrans.title ?? doc.title,
			meta: enTrans.meta ?? doc.meta,
			description: enTrans.description ?? doc.description,
			type: doc.type,
			doc_category: doc.doc_category,
		};
		await upsertLocale(strapi, 'api::document.document', { document_code: doc.document_code }, ukData, enData);
	}
}

export async function syncPreUniversityGroups(strapi: Core.Strapi) {
	for (const subj of seedPreUniversitySubjects) {
		const enTrans = preUniversityEnTranslations[subj.subject_key] || {};
		const ukData: Record<string, unknown> = {
			name: subj.name,
			subject: subj.subject,
			description: subj.description,
			format: subj.format,
			icon_emoji: subj.icon_emoji,
			price_hint: subj.price_hint,
			is_popular: subj.is_popular ?? false,
		};
		const enData: Record<string, unknown> = {
			name: enTrans.name ?? subj.name,
			subject: enTrans.subject ?? subj.subject,
			description: enTrans.description ?? subj.description,
			format: subj.format,
			icon_emoji: subj.icon_emoji,
			price_hint: subj.price_hint,
			is_popular: subj.is_popular ?? false,
		};
		await upsertLocale(strapi, 'api::pre-university-group.pre-university-group', { subject_key: subj.subject_key }, ukData, enData);
	}
}

export async function syncNews(strapi: Core.Strapi) {
	for (const item of seedNews) {
		const enTrans = (newsEnTranslations[item.news_key] || {}) as { title?: string; excerpt?: string; content?: string };
		const ukData: Record<string, unknown> = {
			title: item.title,
			excerpt: item.excerpt,
			content: item.content,
			date: item.date,
			category: item.category,
			is_pinned: item.is_pinned,
		};
		const enData: Record<string, unknown> = {
			title: enTrans.title ?? item.title,
			excerpt: enTrans.excerpt ?? item.excerpt,
			content: enTrans.content ?? item.content,
			date: item.date,
			category: item.category,
			is_pinned: item.is_pinned,
		};
		// News unique key: news_key field (stable identifier)
		await upsertLocale(strapi, 'api::news.news', { news_key: item.news_key }, ukData, enData);
	}
}
