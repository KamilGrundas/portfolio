import {
  UserPublic,
  UserDetailsPublic,
  UserSkillsByCategory,
  UserWorkExperience,
  UserEducation,
  UserCertificate,
} from '../../types';

export const JOHN_DOE_USER: UserPublic = {
  id: '0',
  email: 'john.doe@example.com',
  full_name: 'John Doe',
  is_active: true,
  is_superuser: false,
  url: '',
};

export const JOHN_DOE_DETAILS: UserDetailsPublic = {
  id: '0',
  user_id: '0',
  title: 'Frontend Developer',
  intro:
    'A Frontend Developer passionate about building fast, scalable, and accessible web applications with Angular and TypeScript.',
  avatar: 'https://prenumerata.inzynieria.com/wp-content/uploads/2014/10/speaker-3-269x300.jpg',
  about:
    "I'm John Doe, a frontend developer with a passion for building modern, performant, and user-friendly applications. I specialize in Angular and TypeScript, and I love working on projects that make a difference.",
  extra:
    'Beyond coding, I enjoy contributing tśo open source, writing technical articles, and mentoring new developers.',
  work_station_url:
    'https://www.flexjobs.com/blog/wp-content/uploads/2020/04/20044602/Organize-Workspace.png?w=1024',
};

export const JOHN_DOE_SKILLS: UserSkillsByCategory[] = [
  {
    name: 'Programming Languages',
    icon: 'code',
    color: '#22c55e',
    skills: [
      { name: 'Python', order: 1 },
      { name: 'C++', order: 2 },
      { name: 'SQL', order: 3 },
      { name: 'JavaScript', order: 4 },
      { name: 'HTML', order: 5 },
      { name: 'CSS', order: 6 },
      { name: 'R', order: 7 },
      { name: 'MATLAB', order: 8 },
    ],
  },
  {
    name: 'Machine Learning & AI',
    icon: 'psychology',
    color: '#60a5fa',
    skills: [
      { name: 'Scikit-learn', order: 1 },
      { name: 'XGBoost', order: 2 },
      { name: 'LightGBM', order: 3 },
      { name: 'TensorFlow', order: 4 },
      { name: 'PyTorch', order: 5 },
    ],
  },
  {
    name: 'Data Science',
    icon: 'insights',
    color: '#f59e0b',
    skills: [
      { name: 'Pandas', order: 1 },
      { name: 'NumPy', order: 2 },
      { name: 'Statsmodels', order: 3 },
    ],
  },
  {
    name: 'Data Visualisation',
    icon: 'bar_chart',
    color: '#a78bfa',
    skills: [
      { name: 'Power BI', order: 1 },
      { name: 'matplotlib', order: 2 },
      { name: 'seaborn', order: 3 },
      { name: 'Plotly', order: 4 },
    ],
  },
  {
    name: 'Cloud & MLOps',
    icon: 'cloud',
    color: '#c084fc',
    skills: [
      { name: 'Docker', order: 1 },
      { name: 'GitHub Actions', order: 2 },
      { name: 'Azure', order: 3 },
      { name: 'MLflow', order: 4 },
    ],
  },
];

export const JOHN_DOE_WORK_EXPERIENCE: UserWorkExperience[] = [
  {
    id: 'exp-3',
    company: 'Acme Finance',
    role: 'Senior Frontend Developer',
    period: '09/2023 – Present',
    location: 'Warsaw, Poland (Hybrid)',
    highlights: [
      {
        text: 'Led migration from Angular 12 to Angular 17 with standalone APIs and Angular Signals, reducing bundle size by 28% and improving LCP by ~350ms.',
      },
      {
        text: 'Introduced a scalable design system (Storybook + Angular CDK) and accessibility checklist, reaching WCAG 2.1 AA on core flows.',
      },
      {
        text: 'Built a high-throughput data grid with virtual scrolling and RxJS backpressure; sustained 60fps rendering for 50k+ rows.',
      },
      {
        text: 'Implemented end-to-end telemetry (Sentry + Web Vitals + custom performance marks) and CI gates in GitHub Actions.',
      },
      {
        text: 'Mentored 4 developers; set up pair-review guidelines and PR templates that cut review time by 35%.',
      },
    ],
    skills: [
      {
        id: 'angular',
        name: 'Angular',
        order: 1,
        category: { name: 'Frontend', icon: 'integration_instructions', color: '#dd0031' },
      },
      {
        id: 'ts',
        name: 'TypeScript',
        order: 2,
        category: { name: 'Languages', icon: 'code', color: '#3178c6' },
      },
      {
        id: 'rxjs',
        name: 'RxJS',
        order: 3,
        category: { name: 'Frontend', icon: 'timeline', color: '#b7178c' },
      },
      {
        id: 'ngrx',
        name: 'NgRx',
        order: 4,
        category: { name: 'Frontend', icon: 'join_full', color: '#7e22ce' },
      },
      {
        id: 'storybook',
        name: 'Storybook',
        order: 5,
        category: { name: 'UX & Design System', icon: 'styler', color: '#ff4785' },
      },
      {
        id: 'a11y',
        name: 'Accessibility (WCAG 2.1)',
        order: 6,
        category: { name: 'UX & Accessibility', icon: 'accessibility', color: '#16a34a' },
      },
      {
        id: 'gha',
        name: 'GitHub Actions',
        order: 7,
        category: { name: 'Tooling & DevOps', icon: 'build', color: '#111827' },
      },
      {
        id: 'sentry',
        name: 'Sentry & Web Vitals',
        order: 8,
        category: { name: 'Observability', icon: 'monitor_heart', color: '#0ea5e9' },
      },
      {
        id: 'jest',
        name: 'Jest',
        order: 9,
        category: { name: 'Testing', icon: 'bug_report', color: '#ef4444' },
      },
      {
        id: 'cypress',
        name: 'Cypress',
        order: 10,
        category: { name: 'Testing', icon: 'precision_manufacturing', color: '#10b981' },
      },
    ],
  },
  {
    id: 'exp-2',
    company: 'TechNova',
    role: 'Frontend Developer',
    period: '04/2020 – 08/2023',
    location: 'Remote (EU)',
    highlights: [
      {
        text: 'Delivered a multi-tenant analytics dashboard with lazy-loaded micro-frontends, cutting first-load JS by 40%.',
      },
      {
        text: 'Created a form engine using Angular Reactive Forms + JSON schema to ship 30+ forms without code changes.',
      },
      {
        text: 'Set up E2E testing pipeline (Cypress + Docker) and visual regression tests (Chromatic) for critical UI.',
      },
      {
        text: 'Collaborated with backend on GraphQL schema; added client-side caching and normalized entities.',
      },
    ],
    skills: [
      {
        id: 'scss',
        name: 'SCSS',
        order: 2,
        category: { name: 'Styling', icon: 'palette', color: '#c084fc' },
      },
      {
        id: 'webpack',
        name: 'Webpack',
        order: 3,
        category: { name: 'Build Tools', icon: 'construction', color: '#3b82f6' },
      },
      {
        id: 'docker',
        name: 'Docker',
        order: 4,
        category: { name: 'Tooling & DevOps', icon: 'cloud', color: '#0ea5e9' },
      },
      {
        id: 'ng-cdk',
        name: 'Angular CDK',
        order: 5,
        category: { name: 'Frontend', icon: 'widgets', color: '#f59e0b' },
      },
    ],
  },
  {
    id: 'exp-1',
    company: 'WebLabs',
    role: 'Junior Frontend Developer',
    period: '07/2018 – 03/2020',
    location: 'Kraków, Poland (On-site)',
    highlights: [
      {
        text: 'Implemented pixel-perfect UI components from Figma and improved CLS by 45% using proper image sizing.',
      },
      {
        text: 'Rewrote legacy jQuery widgets into Angular components with OnPush change detection.',
      },
      {
        text: 'Added unit tests with Jest and testing-library; increased coverage from 15% to 70%.',
      },
    ],
    skills: [
      {
        id: 'html',
        name: 'HTML5',
        order: 1,
        category: { name: 'Languages', icon: 'html', color: '#e34f26' },
      },
      {
        id: 'css',
        name: 'CSS3',
        order: 2,
        category: { name: 'Styling', icon: 'style', color: '#2563eb' },
      },
      {
        id: 'js',
        name: 'JavaScript (ES6+)',
        order: 3,
        category: { name: 'Languages', icon: 'javascript', color: '#f59e0b' },
      },
      {
        id: 'figma',
        name: 'Figma',
        order: 4,
        category: { name: 'UX & Design', icon: 'design_services', color: '#a78bfa' },
      },
      {
        id: 'testing-library',
        name: 'Testing Library',
        order: 5,
        category: { name: 'Testing', icon: 'bug_report', color: '#ef4444' },
      },
    ],
  },
];
export const JOHN_DOE_EDUCATION: UserEducation[] = [
  {
    id: 'edu-1',
    school: 'University of Technology',
    title: 'Bachelor of Science in Computer Science',
    period: '2016 — 2019',
    location: 'Warsaw, PL',
    logo_url: 'https://w.prz.edu.pl/themes/prz/images/favicon.png?ver=9.73',
  },
  {
    id: 'edu-2',
    school: 'Online Bootcamp',
    title: 'Frontend Development Certification',
    period: '2020',
    location: '',
    logo_url: 'https://faq-qa.m.goit.global/pl/img/logo.png',
  },
];

export const JOHN_DOE_CERTIFICATES: UserCertificate[] = [
  {
    id: 'cert-1',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issuer_logo_url: 'https://a0.awsstatic.com/libra-css/images/site/touch-icon-ipad-144-smile.png',
    issue_date: 'May 2023',
    credential_id: 'ABCDEF-123456',
    credential_url: 'https://www.credly.com/badges/abcdef123456',
  },
  {
    id: 'cert-2',
    name: 'Google Data Analytics Professional Certificate',
    issuer: 'Google / Coursera',
    issuer_logo_url:
      'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-96x96.png',
    issue_date: 'Nov 2022',
    credential_id: '',
    credential_url: 'https://coursera.org/verify/ABCDEFG12345',
  },
  {
    id: 'cert-3',
    name: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    issuer_logo_url: 'https://www.freecodecamp.org/icons/icon-96x96.png',
    issue_date: '2021',
    credential_id: '',
    credential_url: 'https://www.freecodecamp.org/certification/johndoe/responsive-web-design',
  },
];
