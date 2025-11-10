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

export interface Skill {
  name: string;
  order?: number;
}

export interface UserSkillsByCategory {
  name: string;
  icon: string;
  color: string;
  skills: Array<Skill>;
}

export interface SkillWithCategory {
  id: string;
  name: string;
  order: number;
  category: {
    name: string;
    icon: string;
    color: string;
  };
}

export interface ExperienceHighlight {
  text: string;
}

export interface UserWorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: ExperienceHighlight[];
  skills?: SkillWithCategory[];
}

export interface UserEducation {
  id: string;
  school: string;
  title: string;
  period: string;
  location: string;
  logo_url: string;
}

export interface UserCertificate {
  id: string;
  name: string;
  issuer: string;
  issuer_logo_url?: string;
  issue_date: string;
  credential_id?: string;
  credential_url?: string;
}

export interface UserProject {
  id: string;
  name: string;
  source_code?: string;
  deployment_url?: string;
  description?: string | null;
  skills?: SkillWithCategory[];
  imageUrl?: string | null;
}
