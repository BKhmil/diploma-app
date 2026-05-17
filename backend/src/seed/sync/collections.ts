import { seedPrograms } from '../content/programs';
import { seedStaff, staffEnTranslations } from '../content/staff';
import { seedPartners, partnersEnTranslations } from '../content/partners';
import { seedGraduates, graduatesEnTranslations } from '../content/graduates';
import { seedDocuments, documentsEnTranslations } from '../content/documents';
import { seedPreUniversitySubjects, preUniversityEnTranslations } from '../content/preUniversitySubjects';
import { programTranslations } from '../translate';
import { localizeUk, localizeEn } from '../locale';

async function upsertLocale(
  strapi: any,
  uid: string,
  whereUk: Record<string, any>,
  ukData: Record<string, any>,
  enData: Record<string, any>
) {
  const existingUk = await strapi.db.query(uid).findOne({ where: { ...whereUk, locale: 'uk' } });
  if (existingUk) {
    await strapi.db.query(uid).update({ where: { id: existingUk.id }, data: ukData });
  } else {
    await strapi.db.query(uid).create({ data: { ...ukData, ...whereUk, locale: 'uk', publishedAt: new Date() } });
  }
  const existingEn = await strapi.db.query(uid).findOne({ where: { ...whereUk, locale: 'en' } });
  if (existingEn) {
    await strapi.db.query(uid).update({ where: { id: existingEn.id }, data: enData });
  } else {
    await strapi.db.query(uid).create({ data: { ...enData, ...whereUk, locale: 'en', publishedAt: new Date() } });
  }
}

export async function syncPrograms(strapi: any) {
  for (const prog of seedPrograms) {
    const en = programTranslations[prog.program_code];
    const ukData = {
      title: localizeUk(prog.title),
      description: localizeUk(prog.description),
      target_audience: prog.target_audience ? localizeUk(prog.target_audience) : undefined,
      certificate: prog.certificate ? localizeUk(prog.certificate) : undefined,
      duration: prog.duration,
      format: prog.format,
      credits: prog.credits,
      group_size: prog.group_size,
      start_date: prog.start_date,
      price: prog.price,
      outcomes: prog.outcomes ? prog.outcomes.map(localizeUk) : [],
      modules: prog.modules ? prog.modules.map((m) => ({ title: localizeUk(m.title), hours: m.hours })) : [],
      faq: prog.faq ? prog.faq.map((f) => ({ q: localizeUk(f.q), a: localizeUk(f.a) })) : [],
      category: prog.category,
      status: prog.status,
    };
    const enData = {
      title: en ? localizeEn(en.title) : localizeEn(prog.title),
      description: en ? localizeEn(en.description) : localizeEn(prog.description),
      target_audience: en ? localizeEn(en.targetAudience) : (prog.target_audience ? localizeEn(prog.target_audience) : undefined),
      certificate: prog.certificate ? localizeEn(prog.certificate) : undefined,
      duration: prog.duration,
      format: prog.format,
      credits: prog.credits,
      group_size: prog.group_size,
      start_date: prog.start_date,
      price: prog.price,
      outcomes: en ? en.outcomes.map(localizeEn) : (prog.outcomes ? prog.outcomes.map(localizeEn) : []),
      modules: en
        ? en.modules.map((m) => ({ title: localizeEn(m.title), hours: m.hours }))
        : (prog.modules ? prog.modules.map((m) => ({ title: localizeEn(m.title), hours: m.hours })) : []),
      faq: en
        ? en.faq.map((f) => ({ q: localizeEn(f.q), a: localizeEn(f.a) }))
        : (prog.faq ? prog.faq.map((f) => ({ q: localizeEn(f.q), a: localizeEn(f.a) })) : []),
      category: prog.category,
      status: prog.status,
    };
    await upsertLocale(strapi, 'api::program.program', { program_code: prog.program_code }, ukData, enData);
  }
}

export async function syncStaff(strapi: any) {
  for (const member of seedStaff) {
    if (!member.email) continue;
    const enTrans = staffEnTranslations[member.email] || {};
    const ukData = {
      name: localizeUk(member.name),
      position: localizeUk(member.position),
      degree: member.degree ? localizeUk(member.degree) : undefined,
      department: member.department ? localizeUk(member.department) : undefined,
      experience: member.experience,
      programs_count: member.programs_count,
      tags: member.tags ? member.tags.map(localizeUk) : [],
      role: member.role,
    };
    const enData = {
      name: localizeEn(member.name),
      position: enTrans.position ? localizeEn(enTrans.position) : localizeEn(member.position),
      degree: enTrans.degree ? localizeEn(enTrans.degree) : (member.degree ? localizeEn(member.degree) : undefined),
      department: enTrans.department ? localizeEn(enTrans.department) : (member.department ? localizeEn(member.department) : undefined),
      experience: member.experience,
      programs_count: member.programs_count,
      tags: enTrans.tags ? enTrans.tags.map(localizeEn) : (member.tags ? member.tags.map(localizeEn) : []),
      role: member.role,
      email: member.email,
    };
    await upsertLocale(strapi, 'api::staff-member.staff-member', { email: member.email }, ukData, enData);
  }
}

export async function syncPartners(strapi: any) {
  for (const partner of seedPartners) {
    const enTrans = partnersEnTranslations[partner.name] || {};
    const ukData = {
      name: localizeUk(partner.name),
      type: partner.type,
      city: partner.city ? localizeUk(partner.city) : undefined,
      agreement: partner.agreement ? localizeUk(partner.agreement) : undefined,
      description: partner.description ? localizeUk(partner.description) : undefined,
    };
    const enData = {
      name: enTrans.name ? localizeEn(enTrans.name) : localizeEn(partner.name),
      type: partner.type,
      city: enTrans.city ? localizeEn(enTrans.city) : (partner.city ? localizeEn(partner.city) : undefined),
      agreement: enTrans.agreement ? localizeEn(enTrans.agreement) : (partner.agreement ? localizeEn(partner.agreement) : undefined),
      description: enTrans.description ? localizeEn(enTrans.description) : (partner.description ? localizeEn(partner.description) : undefined),
    };
    await upsertLocale(strapi, 'api::partner.partner', { name: partner.name }, ukData, enData);
  }
}

export async function syncGraduates(strapi: any) {
  for (const grad of seedGraduates) {
    const enTrans = graduatesEnTranslations[grad.name] || {};
    const ukData = {
      name: localizeUk(grad.name),
      program: grad.program ? localizeUk(grad.program) : undefined,
      position: grad.position ? localizeUk(grad.position) : undefined,
      organization: grad.organization ? localizeUk(grad.organization) : undefined,
      year: grad.year,
      rating: grad.rating,
      story: localizeUk(grad.story),
      is_featured: grad.is_featured,
    };
    const enData = {
      name: localizeEn(grad.name),
      program: enTrans.program ? localizeEn(enTrans.program) : (grad.program ? localizeEn(grad.program) : undefined),
      position: enTrans.position ? localizeEn(enTrans.position) : (grad.position ? localizeEn(grad.position) : undefined),
      organization: enTrans.organization ? localizeEn(enTrans.organization) : (grad.organization ? localizeEn(grad.organization) : undefined),
      year: grad.year,
      rating: grad.rating,
      story: enTrans.story ? localizeEn(enTrans.story) : localizeEn(grad.story),
      is_featured: grad.is_featured,
    };
    await upsertLocale(strapi, 'api::graduate.graduate', { name: grad.name }, ukData, enData);
  }
}

export async function syncDocuments(strapi: any) {
  for (const doc of seedDocuments) {
    const enTrans = documentsEnTranslations[doc.document_code] || {};
    const ukData = {
      title: localizeUk(doc.title),
      meta: doc.meta ? localizeUk(doc.meta) : undefined,
      description: doc.description ? localizeUk(doc.description) : undefined,
      type: doc.type,
      doc_category: doc.doc_category,
    };
    const enData = {
      title: enTrans.title ? localizeEn(enTrans.title) : localizeEn(doc.title),
      meta: enTrans.meta ? localizeEn(enTrans.meta) : (doc.meta ? localizeEn(doc.meta) : undefined),
      description: enTrans.description ? localizeEn(enTrans.description) : (doc.description ? localizeEn(doc.description) : undefined),
      type: doc.type,
      doc_category: doc.doc_category,
    };
    await upsertLocale(strapi, 'api::document.document', { document_code: doc.document_code }, ukData, enData);
  }
}

export async function syncPreUniversitySubjects(strapi: any) {
  for (const subj of seedPreUniversitySubjects) {
    const enTrans = preUniversityEnTranslations[subj.subject_key] || {};
    const ukData = {
      name: localizeUk(subj.name),
      subject: localizeUk(subj.subject),
      description: subj.description ? localizeUk(subj.description) : undefined,
      format: subj.format,
      icon_emoji: subj.icon_emoji,
      price_hint: subj.price_hint ? localizeUk(subj.price_hint) : undefined,
      is_popular: subj.is_popular,
    };
    const enData = {
      name: enTrans.name ? localizeEn(enTrans.name) : localizeEn(subj.name),
      subject: enTrans.subject ? localizeEn(enTrans.subject) : localizeEn(subj.subject),
      description: enTrans.description ? localizeEn(enTrans.description) : (subj.description ? localizeEn(subj.description) : undefined),
      format: subj.format,
      icon_emoji: subj.icon_emoji,
      price_hint: subj.price_hint ? localizeEn(subj.price_hint) : undefined,
      is_popular: subj.is_popular,
    };
    await upsertLocale(strapi, 'api::pre-university-group.pre-university-group', { subject_key: subj.subject_key }, ukData, enData);
  }
}
