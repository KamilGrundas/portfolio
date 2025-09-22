import { UserPublic, UserDetailsPublic, SkillCategory } from '../../types';

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

export const JOHN_DOE_SKILLS: SkillCategory[] = [
  {
    title: 'Programming Languages',
    icon: 'code',
    color: '#22c55e',
    items: ['Python', 'C++', 'SQL', 'JavaScript', 'HTML', 'CSS', 'R', 'MATLAB'],
  },
  {
    title: 'Machine Learning & AI',
    icon: 'psychology',
    color: '#60a5fa',
    items: ['Scikit-learn', 'XGBoost', 'LightGBM', 'TensorFlow', 'PyTorch'],
  },
  {
    title: 'Data Science',
    icon: 'insights',
    color: '#f59e0b',
    items: ['Pandas', 'NumPy', 'Statsmodels'],
  },
  {
    title: 'Data Visualisation',
    icon: 'bar_chart',
    color: '#a78bfa',
    items: ['Power BI', 'matplotlib', 'seaborn', 'Plotly'],
  },
  {
    title: 'Cloud & MLOps',
    icon: 'cloud',
    color: '#c084fc',
    items: ['Docker', 'GitHub Actions', 'Azure', 'MLflow'],
  },
];
