import { UserPublic, UserDetailsPublic } from '../../types';

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

export function buildOverviewData(user: UserPublic | null, details: UserDetailsPublic | null) {
  return {
    name: user?.full_name ?? user?.email ?? JOHN_DOE_USER.full_name,
    title: details?.title ?? JOHN_DOE_DETAILS.title,
    intro: details?.intro ?? JOHN_DOE_DETAILS.intro,
    avatar: details?.avatar ?? JOHN_DOE_DETAILS.avatar,
  };
}
