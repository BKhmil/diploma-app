export interface ProgramTranslation {
  title: string;
  description: string;
  targetAudience: string;
  outcomes: string[];
  modules: { title: string; hours: number }[];
  faq: { q: string; a: string }[];
}

const mkEn = (
  title: string,
  description: string,
  targetAudience = 'Professionals and students (demo audience)'
): ProgramTranslation => ({
  title,
  description,
  targetAudience,
  outcomes: [
    'Understand program structure in Strapi',
    'See changes instantly after saving',
    'Edit content without deploy',
  ],
  modules: [
    { title: 'Module 1: Intro', hours: 12 },
    { title: 'Module 2: Practice', hours: 24 },
    { title: 'Module 3: Wrap-up', hours: 12 },
  ],
  faq: [
    { q: 'Where does this text come from?', a: 'From the Program collection in Strapi — seed v2.' },
    { q: 'Is this a real course?', a: 'No, demo data for CMS verification.' },
  ],
});

export const programTranslations: Record<string, ProgramTranslation> = {
  q1: mkEn('UX Lab: Interfaces', 'Demo UX course — code q1. Check the card on /qualification.'),
  q2: mkEn('Data Analytics: Start', 'SQL, spreadsheets, basic dashboards — seed v2.'),
  q3: mkEn('Agile Facilitation', 'Scrum, Kanban, meeting facilitation.'),
  q4: mkEn('Cyber Hygiene for Educators', 'Passwords, phishing, data protection.'),
  q5: mkEn('ESG in Educational Institutions', 'Sustainability in schools and HEIs.'),
  q6: mkEn('Media Literacy 2.0', 'Fakes, sources, critical reading.'),
  q7: mkEn('Crisis Communication', 'Public speaking and crisis briefings.'),
  q8: mkEn('AI Assistants at Work', 'ChatGPT, Copilot, usage policies.'),
  r1: mkEn('Legal Retraining (Intensive)', 'Second degree — demo track r1.'),
  r2: mkEn('Digital Marketing from Scratch', 'SMM, content, campaign analytics.'),
  r3: mkEn('HR Analytics', 'People metrics and analytics.'),
  m1: mkEn('Master: Product Management', 'Master track m1 — seed v2.'),
  m2: mkEn('Master: Data Science', 'ML basics, Python, data ethics.'),
  p1: mkEn('NMT: Mathematics (Intensive)', 'Subject p1 — links to pre-university-group math.'),
  p2: mkEn('NMT: History of Ukraine', 'Subject p2 — online format.'),
  p3: mkEn('NMT: English', 'Subject p3 — B1+.'),
  p4: mkEn('NMT: Biology', 'Subject p4 — lab modules.'),
  p5: mkEn('NMT: Physics', 'Subject p5 — NMT problem sets.'),
};

/** @deprecated Page seeds use inline EN copy; kept for backwards compatibility if imported elsewhere. */
export const homePageEn = {
  hero_badge_text: 'Demo home · seed v2',
  hero_title: 'Learning you can see in Strapi',
  hero_subtitle: 'All sections from home-page single type.',
  mission: 'Seed v2 mission',
};

export const aboutPageEn = { page_title: 'About seed v2', page_subtitle: 'CMS-driven', mission_heading: 'Mission', history: 'Seed lore', structure_description: 'Structure' };
export const contactPageEn = { contacts_page_title: 'Contact seed v2', contacts_page_subtitle: 'Demo', room_note: 'Room 3B', weekend_hours_note: 'Saturday by appointment' };
export const alumniPageEn = { hero_badge_text: 'Demo community', hero_title: 'Alumni CMS', hero_subtitle: 'Graduate collection', cta_title: 'Join demo', cta_description: 'CTA from Strapi', testimonials_section_title: 'Testimonials', testimonials_section_subtitle: 'story field', employment_section_title: 'Employment', employment_section_subtitle: 'employment_items', achievements_section_title: 'Achievements' };
export const partnersPageEn = { page_title: 'Partners seed v2', page_intro: 'Partner collection', cta_title: 'Demo partner', cta_text: 'Test CTA' };
export const preUniversityPageEn = { hero_title: 'NMT seed v2', hero_subtitle: 'pre-university-page', bundle_title: 'Bundle Math + History', bundle_description: 'From single type' };
export const retrainingPageEn = { page_title: 'Retraining seed v2', page_intro: 'retraining-page + Program collection' };
