export interface UserPublic {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  url: string | null;
  full_name: string | null;
}

export interface UserDetailsBase {
  title: string | null;
  intro: string | null;
  avatar: string | null;
  about: string | null;
  extra: string | null;
  work_station_url: string | null;
}

export interface UserDetailsPublic extends UserDetailsBase {
  id: string;
  user_id: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  color: string;
  items: string[];
}
