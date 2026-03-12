export interface UserPublic {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  url: string | null;
  full_name: string | null;
}

export interface Token {
  access_token: string;
  token_type: string;
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
  id?: string;
  name: string;
  category_id?: string | null;
  order?: number;
  owner_id?: string | null;
}

export interface UserSkillsByCategory {
  id?: string;
  name: string;
  icon: string | null;
  color: string | null;
  order?: number;
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
  id?: string;
  text: string;
  work_experience_id?: string;
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
  image_url?: string | null;
  imageUrl?: string | null;
}

export interface ContactPublic {
  id: string;
  user_id: string;
  contact_email: string;
  phone_number: string | null;
  linked_in_url: string | null;
  github_url: string | null;
  location: string | null;
}

export interface UserUpdateMe {
  full_name?: string | null;
  email?: string | null;
  url?: string | null;
}

export interface UserDetailsUpdate {
  title?: string | null;
  intro?: string | null;
  avatar?: string | null;
  about?: string | null;
  extra?: string | null;
  work_station_url?: string | null;
}

export interface ContactUpdate {
  contact_email?: string | null;
  phone_number?: string | null;
  linked_in_url?: string | null;
  github_url?: string | null;
  location?: string | null;
}

export interface SkillCreate {
  name: string;
  category_id: string;
  order?: number;
}

export interface SkillCategoryPublic {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  order: number;
}

export interface SkillCategoryCreate {
  name: string;
  icon?: string | null;
  color?: string | null;
  order?: number;
}

export interface WorkExperienceCreate {
  company?: string | null;
  role?: string | null;
  period?: string | null;
  location?: string | null;
}

export interface WorkExperienceUpdate extends WorkExperienceCreate {
  skill_ids?: string[];
}

export interface ExperienceHighlightCreate {
  text?: string | null;
  work_experience_id: string;
}

export interface EducationCreate {
  school?: string | null;
  title?: string | null;
  period?: string | null;
  location?: string | null;
  logo_url?: string | null;
}

export interface CertificateCreate {
  name?: string | null;
  issuer?: string | null;
  issuer_logo_url?: string | null;
  issue_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
}

export interface ProjectCreate {
  name?: string | null;
  source_code?: string | null;
  deployment_url?: string | null;
  image_url?: string | null;
  description?: string | null;
}

export interface ProjectUpdate extends ProjectCreate {
  skill_ids?: string[];
}
