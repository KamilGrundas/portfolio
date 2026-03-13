import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Token,
  UserPublic,
  UserUpdateMe,
  UserDetailsPublic,
  UserDetailsUpdate,
  UserSkillsByCategory,
  UserWorkExperience,
  UserEducation,
  UserCertificate,
  UserProject,
  ContactPublic,
  ContactUpdate,
  Skill,
  SkillCreate,
  SkillCategoryPublic,
  SkillCategoryCreate,
  WorkExperienceCreate,
  WorkExperienceUpdate,
  ExperienceHighlight,
  ExperienceHighlightCreate,
  EducationCreate,
  CertificateCreate,
  ProjectCreate,
  ProjectUpdate,
} from '../../types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Master {
  private readonly base = environment.apiUrl;
  private readonly users = `${this.base}users`;
  private readonly login = `${this.base}login`;
  private readonly skills = `${this.base}skills`;
  private readonly skillCategories = `${this.base}skill-categories`;
  private readonly workExperiences = `${this.base}work-experiences`;
  private readonly experienceHighlights = `${this.base}experience-highlights`;
  private readonly education = `${this.base}education`;
  private readonly certificates = `${this.base}certificates`;
  private readonly projects = `${this.base}projects`;

  constructor(private http: HttpClient) {}

  loginAccessToken(email: string, password: string): Observable<Token> {
    const body = new HttpParams().set('username', email).set('password', password);
    return this.http.post<Token>(`${this.login}/access-token`, body.toString(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
  }

  getCurrentUser(): Observable<UserPublic> {
    return this.http.get<UserPublic>(`${this.users}/me`);
  }

  updateCurrentUser(payload: UserUpdateMe): Observable<UserPublic> {
    return this.http.patch<UserPublic>(`${this.users}/me`, payload);
  }

  getMyDetails(): Observable<UserDetailsPublic> {
    return this.http.get<UserDetailsPublic>(`${this.users}/me/details`);
  }

  updateMyDetails(payload: UserDetailsUpdate): Observable<UserDetailsPublic> {
    return this.http.patch<UserDetailsPublic>(`${this.users}/me/details`, payload);
  }

  getMyContact(): Observable<ContactPublic> {
    return this.http.get<ContactPublic>(`${this.users}/me/contact`);
  }

  updateMyContact(payload: ContactUpdate): Observable<ContactPublic> {
    return this.http.patch<ContactPublic>(`${this.users}/me/contact`, payload);
  }

  // GET /users/by-id/{uuid}
  getUserById(userId: string): Observable<UserPublic> {
    return this.http.get<UserPublic>(`${this.users}/by-id/${userId}`);
  }

  // GET /users/by-url/{url}
  getUserByUrl(url: string): Observable<UserPublic> {
    return this.http.get<UserPublic>(`${this.users}/by-url/${encodeURIComponent(url)}`);
  }

  // GET /users/{uuid}/details
  getUserDetailsById(userId: string): Observable<UserDetailsPublic> {
    return this.http.get<UserDetailsPublic>(`${this.users}/${userId}/details`);
  }

  // GET /users/{uuid}/skill-categories
  getUserSkillsById(userId: string): Observable<UserSkillsByCategory[]> {
    return this.http.get<UserSkillsByCategory[]>(`${this.users}/get-user-skills?user_id=${userId}`);
  }

  // GET /users/{uuid}/work-experiences
  getUserWorkExperiencesById(userId: string): Observable<UserWorkExperience[]> {
    return this.http.get<UserWorkExperience[]>(
      `${this.users}/get-user-work-experiences?user_id=${userId}`
    );
  }

  // GET /users/{uuid}/education
  getUserEducationById(userId: string): Observable<UserEducation[]> {
    return this.http.get<UserEducation[]>(`${this.users}/get-user-education?user_id=${userId}`);
  }

  // GET /users/{uuid}/certificates
  getUserCertificatesById(userId: string): Observable<UserCertificate[]> {
    return this.http.get<UserCertificate[]>(
      `${this.users}/get-user-certificates?user_id=${userId}`
    );
  }

  // GET /users/{uuid}/projects
  getUserProjectsById(userId: string): Observable<UserProject[]> {
    return this.http.get<UserProject[]>(`${this.users}/get-user-projects?user_id=${userId}`);
  }

  getUserContactById(userId: string): Observable<ContactPublic> {
    return this.http.get<ContactPublic>(`${this.users}/get-user-contact?user_id=${userId}`);
  }

  getSkillCategories(): Observable<SkillCategoryPublic[]> {
    return this.http.get<SkillCategoryPublic[]>(this.skillCategories);
  }

  createSkillCategory(payload: SkillCategoryCreate): Observable<SkillCategoryPublic> {
    return this.http.post<SkillCategoryPublic>(this.skillCategories, payload);
  }

  updateSkillCategory(id: string, payload: Partial<SkillCategoryCreate>): Observable<SkillCategoryPublic> {
    return this.http.patch<SkillCategoryPublic>(`${this.skillCategories}/${id}`, payload);
  }

  deleteSkillCategory(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.skillCategories}/${id}`);
  }

  createSkill(payload: SkillCreate): Observable<Skill> {
    return this.http.post<Skill>(this.skills, payload);
  }

  updateSkill(id: string, payload: Partial<SkillCreate>): Observable<Skill> {
    return this.http.patch<Skill>(`${this.skills}/${id}`, payload);
  }

  deleteSkill(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.skills}/${id}`);
  }

  createWorkExperience(payload: WorkExperienceCreate): Observable<UserWorkExperience> {
    return this.http.post<UserWorkExperience>(this.workExperiences, payload);
  }

  updateWorkExperience(id: string, payload: WorkExperienceUpdate): Observable<UserWorkExperience> {
    return this.http.patch<UserWorkExperience>(`${this.workExperiences}/${id}`, payload);
  }

  deleteWorkExperience(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.workExperiences}/${id}`);
  }

  createExperienceHighlight(payload: ExperienceHighlightCreate): Observable<ExperienceHighlight> {
    return this.http.post<ExperienceHighlight>(this.experienceHighlights, payload);
  }

  updateExperienceHighlight(id: string, payload: Pick<ExperienceHighlight, 'text'>): Observable<ExperienceHighlight> {
    return this.http.patch<ExperienceHighlight>(`${this.experienceHighlights}/${id}`, payload);
  }

  deleteExperienceHighlight(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.experienceHighlights}/${id}`);
  }

  createEducation(payload: EducationCreate): Observable<UserEducation> {
    return this.http.post<UserEducation>(this.education, payload);
  }

  updateEducation(id: string, payload: Partial<EducationCreate>): Observable<UserEducation> {
    return this.http.patch<UserEducation>(`${this.education}/${id}`, payload);
  }

  deleteEducation(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.education}/${id}`);
  }

  createCertificate(payload: CertificateCreate): Observable<UserCertificate> {
    return this.http.post<UserCertificate>(this.certificates, payload);
  }

  updateCertificate(id: string, payload: Partial<CertificateCreate>): Observable<UserCertificate> {
    return this.http.patch<UserCertificate>(`${this.certificates}/${id}`, payload);
  }

  deleteCertificate(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.certificates}/${id}`);
  }

  createProject(payload: ProjectCreate): Observable<UserProject> {
    return this.http.post<UserProject>(this.projects, payload);
  }

  updateProject(id: string, payload: ProjectUpdate): Observable<UserProject> {
    return this.http.patch<UserProject>(`${this.projects}/${id}`, payload);
  }

  deleteProject(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.projects}/${id}`);
  }
}
