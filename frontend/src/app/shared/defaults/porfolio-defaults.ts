import { UserPublic, UserDetailsPublic, UserSkillsByCategory } from '../../types';

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
