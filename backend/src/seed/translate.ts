export interface ProgramTranslation {
  title: string;
  description: string;
  targetAudience: string;
  outcomes: string[];
  modules: { title: string; hours: number }[];
  faq: { q: string; a: string }[];
}

export const programTranslations: Record<string, ProgramTranslation> = {
  q1: {
    title: 'Stress Psychology and Crisis States',
    description: 'A course focused on mastering first psychological aid skills and working with PTSD. Relevant for professionals working with people in crisis situations.',
    targetAudience: 'Psychologists, social workers, volunteers',
    outcomes: [
      'Recognize symptoms of PTSD and acute stress reactions',
      'Provide first psychological aid in crisis situations',
      'Apply psychological self-regulation techniques',
      'Organize group support and debriefing',
    ],
    modules: [
      { title: 'Theoretical Foundations of Psychotrauma', hours: 20 },
      { title: 'Diagnosis of Crisis States', hours: 24 },
      { title: 'Methods of Psychological Assistance', hours: 40 },
      { title: 'Practice and Supervision', hours: 36 },
      { title: 'Final Attestation', hours: 16 },
    ],
    faq: [
      { q: 'Is a psychological education required?', a: 'Preferred but not required. The course is open to social workers, teachers, and volunteers.' },
      { q: 'What document is issued after training?', a: 'State-standard certificate of professional development.' },
      { q: 'Can I study remotely?', a: 'Yes, the entire course is available online through the DNU Moodle platform.' },
    ],
  },
  q2: {
    title: 'Digital Literacy for Educators',
    description: 'Using modern digital tools (Google Workspace, Canva, AI assistants) in the educational process. Practical sessions and individual projects.',
    targetAudience: 'Teachers, university lecturers',
    outcomes: [
      'Effectively use Google Workspace in education',
      'Create multimedia learning content in Canva',
      'Use AI tools for lesson preparation',
      'Organize distance learning via Zoom/Meet',
    ],
    modules: [
      { title: 'Fundamentals of Digital Tools', hours: 12 },
      { title: 'Google Workspace in Education', hours: 20 },
      { title: 'Canva and Media Content', hours: 16 },
      { title: 'AI Assistants for Educators', hours: 14 },
      { title: 'Practical Project', hours: 10 },
    ],
    faq: [
      { q: 'Are special IT skills required?', a: 'No, the course is designed for beginners. Basic computer skills are sufficient.' },
      { q: 'What is a blended format?', a: '60% online, 40% in-person at DNU classrooms.' },
    ],
  },
  q3: {
    title: 'Management in Education',
    description: 'Managing educational institutions, financial management, HR policy, and strategic planning in education.',
    targetAudience: 'School principals, department heads, education administrators',
    outcomes: [
      'Develop a strategy for educational institution development',
      'Manage finances and create a budget',
      'Build an effective team and HR policy',
      'Organize the educational process according to standards',
    ],
    modules: [
      { title: 'Fundamentals of Educational Management', hours: 30 },
      { title: 'Financial Management', hours: 36 },
      { title: 'Personnel Management', hours: 36 },
      { title: 'Strategic Planning', hours: 30 },
      { title: 'Attestation Work', hours: 30 },
    ],
    faq: [
      { q: 'Can it be combined with work?', a: 'Yes, classes are held in the evenings and on weekends.' },
      { q: 'What qualification will the certificate confirm?', a: 'Professional development for educational institution director (270 hrs).' },
    ],
  },
  q4: {
    title: 'Pedagogical Excellence',
    description: 'Modern teaching methods, digital tools, working with different categories of students. Building facilitator and coaching skills.',
    targetAudience: 'Teachers, lecturers, trainers',
    outcomes: [
      'Apply digital tools and platforms in teaching',
      'Develop modern curricula and lesson plans',
      'Organize inclusive learning environments',
      'Assess learning achievements according to NUS standards',
    ],
    modules: [
      { title: 'Modern Education Paradigm', hours: 20 },
      { title: 'Digital Technologies in Education', hours: 30 },
      { title: 'Inclusive Education', hours: 30 },
      { title: 'Psychological Support for Students', hours: 24 },
      { title: 'Final Attestation', hours: 16 },
    ],
    faq: [
      { q: 'Can I study remotely?', a: 'Yes, the program is fully available online through DNU Moodle.' },
      { q: 'What document is issued upon completion?', a: 'State-standard professional development certificate (120 hrs).' },
      { q: 'Is it valid for attestation?', a: 'Yes, the program is accredited by the Ministry of Education of Ukraine.' },
    ],
  },
  q5: {
    title: 'Inclusive Education: Practical Tools',
    description: 'Principles of organizing an inclusive environment, working with children with special needs, adapting learning materials.',
    targetAudience: 'Teachers in general education schools, teacher assistants',
    outcomes: [
      'Organize an inclusive learning environment',
      'Adapt curricula for children with special educational needs',
      'Interact with parents and support teams',
      'Develop individual development plans',
    ],
    modules: [
      { title: 'Foundations of Inclusive Education', hours: 16 },
      { title: 'Categories of Children with Special Needs', hours: 20 },
      { title: 'Adapting the Learning Environment', hours: 20 },
      { title: 'Interaction with Support Teams', hours: 16 },
    ],
    faq: [
      { q: 'Is it valid for attestation?', a: 'Yes, the program meets Ministry of Education requirements for teacher professional development.' },
    ],
  },
  q6: {
    title: 'English Language (B2) for Educators',
    description: 'Intensive English language course for professional communication: academic writing, presentations, participation in international conferences.',
    targetAudience: 'Lecturers, researchers',
    outcomes: [
      'Communicate freely on professional topics in English',
      'Write academic texts and abstracts',
      'Present at conferences',
      'Read and review academic articles',
    ],
    modules: [
      { title: 'Grammar & Vocabulary', hours: 40 },
      { title: 'Academic Writing', hours: 36 },
      { title: 'Speaking & Presentations', hours: 36 },
      { title: 'Research English', hours: 24 },
    ],
    faq: [
      { q: 'What level is required to start?', a: 'Recommended entry level B1. An entrance test is conducted.' },
    ],
  },
  q7: {
    title: 'Occupational Safety in Educational Institutions',
    description: 'Regulatory requirements, documentation, practical skills for ensuring safety in the educational environment.',
    targetAudience: 'Safety officers, school principals',
    outcomes: [
      'Know the regulatory framework for occupational safety',
      'Maintain occupational safety documentation',
      'Conduct briefings and staff training',
    ],
    modules: [
      { title: 'Regulatory Framework', hours: 10 },
      { title: 'Documentation and Briefings', hours: 10 },
      { title: 'Practical Skills and Attestation', hours: 10 },
    ],
    faq: [],
  },
  q8: {
    title: 'NUS: Implementation Practice',
    description: 'Competency-based approach, formative assessment, project-based learning within the New Ukrainian School framework.',
    targetAudience: 'Grades 1–4 teachers, methodologists',
    outcomes: [
      'Implement a competency-based approach in teaching',
      'Apply formative assessment',
      'Organize project and group work',
      'Develop learning materials according to NUS standards',
    ],
    modules: [
      { title: 'NUS Concept', hours: 16 },
      { title: 'Competency-Based Learning', hours: 24 },
      { title: 'Formative Assessment', hours: 20 },
      { title: 'Project Activities', hours: 12 },
    ],
    faq: [],
  },
  r1: {
    title: 'Psychology',
    description: 'A full master\'s-level retraining program to obtain a second higher education in Psychology. Clinical, organizational, and educational psychology.',
    targetAudience: 'Individuals with higher education in any field',
    outcomes: [
      'Apply psychodiagnostic methodologies',
      'Conduct individual and group counseling',
      'Organize psychological assistance in organizations and institutions',
      'Conduct scientific research in psychology',
    ],
    modules: [
      { title: 'General and Developmental Psychology', hours: 60 },
      { title: 'Psychodiagnostics', hours: 60 },
      { title: 'Clinical Psychology', hours: 60 },
      { title: 'Psychological Counseling', hours: 60 },
      { title: 'Field Placement', hours: 120 },
      { title: 'Master\'s Thesis', hours: 120 },
    ],
    faq: [
      { q: 'What prior education is required?', a: 'Bachelor\'s or master\'s degree in any field.' },
      { q: 'Are entrance exams required?', a: 'Yes: an interview on psychology and academic record review.' },
    ],
  },
  r2: {
    title: 'Law',
    description: 'A retraining program to obtain the qualification of "Lawyer". Civil, criminal, commercial, and administrative law.',
    targetAudience: 'Professionals with higher education, civil servants',
    outcomes: [
      'Navigate the Ukrainian legal system',
      'Draft legal documents and contracts',
      'Defend rights and interests in court',
      'Provide legal consultations',
    ],
    modules: [
      { title: 'Theory of State and Law', hours: 40 },
      { title: 'Civil Law', hours: 60 },
      { title: 'Commercial Law', hours: 60 },
      { title: 'Criminal Law and Procedure', hours: 60 },
      { title: 'Internship and Master\'s Thesis', hours: 180 },
    ],
    faq: [
      { q: 'How long is the program?', a: 'One and a half years (3 semesters), classes 3 evenings per week.' },
    ],
  },
  r3: {
    title: 'Organizational Management',
    description: 'Strategic management, HR management, financial management, operational management. DNU Master\'s Degree.',
    targetAudience: 'Managers, executives, entrepreneurs',
    outcomes: [
      'Develop and implement organizational strategy',
      'Manage personnel and build teams',
      'Analyze the financial condition of an enterprise',
      'Optimize business processes',
    ],
    modules: [
      { title: 'Theory of Organizations and Management', hours: 60 },
      { title: 'Strategic Management', hours: 60 },
      { title: 'Human Resource Management', hours: 60 },
      { title: 'Financial Management', hours: 60 },
      { title: 'Internship and Master\'s Thesis', hours: 160 },
    ],
    faq: [],
  },
  m1: {
    title: 'Public Administration and Management',
    description: 'A master\'s program for training specialists in public administration, local self-government, and public service.',
    targetAudience: 'Civil servants, community leaders, managers',
    outcomes: [
      'Develop and implement public policy',
      'Manage public projects and resources',
      'Interact with civil society',
      'Implement e-governance and digitalization',
    ],
    modules: [
      { title: 'Theory of Public Administration', hours: 60 },
      { title: 'Civil Service and HR Policy', hours: 60 },
      { title: 'Public Finance and Budget', hours: 60 },
      { title: 'E-Governance', hours: 40 },
      { title: 'Internship and Master\'s Thesis', hours: 180 },
    ],
    faq: [
      { q: 'What education is required to apply?', a: 'Bachelor\'s or master\'s degree in any field.' },
      { q: 'Are EVI results considered?', a: 'Yes, EVI results are considered in the competitive selection.' },
    ],
  },
  m2: {
    title: 'Higher Education Pedagogy',
    description: 'Training masters for work in higher education: teaching methodology, pedagogical research, educational management.',
    targetAudience: 'Researchers, university lecturers, postgraduates',
    outcomes: [
      'Design courses and educational programs',
      'Apply modern pedagogical technologies in higher education',
      'Conduct pedagogical research',
      'Manage the educational process at a university',
    ],
    modules: [
      { title: 'Theory and Methodology of Pedagogy', hours: 60 },
      { title: 'Didactics of Higher Education', hours: 60 },
      { title: 'Pedagogical Technologies', hours: 60 },
      { title: 'Research in Pedagogy', hours: 60 },
      { title: 'Internship and Master\'s Thesis', hours: 160 },
    ],
    faq: [],
  },
  p1: {
    title: 'NMT Preparation: Mathematics',
    description: 'Complete NMT preparation course in mathematics. Algebra, geometry, probability theory. Groups of up to 8 students, monthly mock tests.',
    targetAudience: 'Grades 10–11 students, applicants',
    outcomes: [
      'Systematize knowledge of algebra and geometry',
      'Solve NMT problems of all difficulty levels',
      'Master test-taking techniques',
      'Complete 12+ mock NMT tests in near-real conditions',
    ],
    modules: [
      { title: 'Algebra and Calculus Fundamentals', hours: 64 },
      { title: 'Geometry', hours: 60 },
      { title: 'Probability Theory and Statistics', hours: 20 },
      { title: 'Mock Tests and Error Analysis', hours: 36 },
    ],
    faq: [
      { q: 'How many students are in a group?', a: 'Up to 8 students for maximum effectiveness.' },
      { q: 'How are classes conducted?', a: 'Twice a week, 2 academic hours each, in the evening.' },
      { q: 'Are there mock tests?', a: 'Yes, a full mock NMT is conducted once a month.' },
    ],
  },
  p2: {
    title: 'NMT Preparation: Ukrainian Language',
    description: 'Preparation in Ukrainian language and literature: grammar, orthography, syntax, text analysis. Online testing after each topic.',
    targetAudience: 'Grades 10–11 students, applicants',
    outcomes: [
      'Know the norms of modern standard Ukrainian',
      'Analyze prose and poetic texts',
      'Complete all NMT task types',
      'Write an essay according to NMT requirements',
    ],
    modules: [
      { title: 'Phonetics, Vocabulary, Morphology', hours: 50 },
      { title: 'Syntax and Punctuation', hours: 40 },
      { title: 'Literary Text Analysis', hours: 40 },
      { title: 'Essay Writing', hours: 30 },
      { title: 'Mock Tests', hours: 20 },
    ],
    faq: [
      { q: 'Does it include literature preparation?', a: 'Yes, the program covers analysis of literary texts included in the NMT.' },
    ],
  },
  p3: {
    title: 'NMT Preparation: History of Ukraine',
    description: 'Systematizing knowledge of the History of Ukraine from ancient times to the present. Chronology, personalities, cause-and-effect relationships.',
    targetAudience: 'Grades 10–11 students, applicants',
    outcomes: [
      'Know key events, dates and personalities in Ukrainian history',
      'Analyze cause-and-effect relationships in history',
      'Work with maps, documents and NMT illustrations',
    ],
    modules: [
      { title: 'Ancient and Medieval Ukraine', hours: 30 },
      { title: 'Cossack Era and Modern Ukraine', hours: 30 },
      { title: 'Contemporary History of Ukraine', hours: 36 },
      { title: 'Mock Tests and Review', hours: 24 },
    ],
    faq: [],
  },
  p4: {
    title: 'NMT Preparation: English Language',
    description: 'Grammar, vocabulary, reading, listening. Class format corresponds to the NMT structure. Homework checked by the teacher.',
    targetAudience: 'Grades 10–11 students',
    outcomes: [
      'Complete all sections of the NMT in English',
      'Understand authentic audio texts',
      'Read and analyze English-language texts',
      'Answer NMT written tasks',
    ],
    modules: [
      { title: 'Grammar & Use of English', hours: 60 },
      { title: 'Reading Comprehension', hours: 40 },
      { title: 'Listening', hours: 30 },
      { title: 'Writing tasks', hours: 30 },
      { title: 'Mock tests', hours: 20 },
    ],
    faq: [
      { q: 'What level is required to start?', a: 'From A2. Level is determined by an entrance test.' },
    ],
  },
  p5: {
    title: 'NMT Bundle: Mathematics + Ukrainian',
    description: 'Intensive preparation course for two key NMT subjects at once. Morning and evening groups available.',
    targetAudience: 'Grade 11 students, current-year applicants',
    outcomes: [
      'Prepare for NMT in mathematics and Ukrainian in a short time',
      'Complete a series of mock tests and work on mistakes',
    ],
    modules: [
      { title: 'Mathematics: Key Topics', hours: 50 },
      { title: 'Ukrainian Language: Key Topics', hours: 50 },
      { title: 'Joint Mock NMT Tests', hours: 20 },
    ],
    faq: [
      { q: 'Who is this course for?', a: 'For grade 11 students who want to prepare intensively in a short time (February–April).' },
    ],
  },
};

export interface PageTranslation {
  [field: string]: string;
}

export const homePageEn: PageTranslation = {
  hero_badge_text: 'Oles Honchar Dnipro National University',
  hero_title: 'Your growth is our specialty',
  hero_subtitle: 'Quality postgraduate education, professional development, and university entrance preparation. Become a sought-after professional with the region\'s leading educational institution.',
  quality_section_title: 'Quality education with guaranteed results',
  quality_section_description: 'The Center is an official structural unit of Oles Honchar Dnipro National University. We ensure high teaching standards and provide state-recognized documents.',
  bottom_cta_title: 'Ready to start?',
  bottom_cta_description: 'Choose a program and take the first step toward your professional growth.',
  mission: 'Quality postgraduate education for professional development.',
};

export const aboutPageEn: PageTranslation = {
  page_title: 'About the Center for Lifelong Education',
  page_subtitle: 'Oles Honchar Dnipro National University',
  mission_heading: 'Our Mission',
  history: 'Since 1995, the Center for Lifelong Education has been training professionals across all fields, providing quality education and state-recognized documents.',
  structure_description: 'The Center includes departments for professional development, retraining, pre-university preparation, and masters programs.',
};

export const qualificationPageEn: PageTranslation = {
  page_title: 'Professional Development',
  page_intro: 'Choose a program for professional growth and receive a state-standard certificate. We offer courses for educators, psychologists, civil servants, and other professionals.',
};

export const retrainingPageEn: PageTranslation = {
  page_title: 'Retraining and Master\'s Programs',
  page_intro: 'Obtain a new specialty or advance your educational level. We offer retraining programs and master\'s programs for your career growth.',
};

export const partnersPageEn: PageTranslation = {
  page_title: 'Partners',
  page_intro: 'We cooperate with leading educational institutions, enterprises, and public organizations of the Dnipropetrovsk region.',
  cta_title: 'Become our partner',
  cta_text: 'We offer corporate training, joint programs, and mutually beneficial cooperation.',
};

export const preUniversityPageEn: PageTranslation = {
  hero_title: 'Effective NMT Preparation',
  hero_subtitle: 'Prepare for the national multi-subject test with leading DNU lecturers. Small groups, individual approach, guaranteed results.',
  bundle_title: 'Mathematics + Ukrainian Language Bundle',
  bundle_description: 'Intensive preparation for two NMT subjects at once. Save up to 30% on the full price.',
};

export const alumniPageEn: PageTranslation = {
  hero_badge_text: 'More than 50,000 graduates since 1995',
  hero_title: 'Our graduates across Ukraine and beyond',
  hero_subtitle: 'Find out how studying at CNE DNU changed the careers and lives of our students.',
  cta_title: 'Become our graduate',
  cta_description: 'Join the community of 50,000+ professionals who chose CNE DNU for their development.',
  employment_section_title: 'Where our graduates work',
  employment_section_subtitle: 'Employment map',
  achievements_section_title: 'Our achievements',
};

export const contactPageEn: PageTranslation = {
  contacts_page_title: 'Contact Us',
  contacts_page_subtitle: 'Have questions? Contact us in any convenient way or fill out the feedback form.',
  room_note: 'Building 1, Room 101',
  weekend_hours_note: 'Sat–Sun: Closed',
};
