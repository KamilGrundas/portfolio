import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserPublic,
  UserDetailsPublic,
  UserSkillsByCategory,
  UserWorkExperience,
  UserEducation,
} from '../../types';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Master {
  private readonly base = environment.apiUrl;
  private readonly users = `${this.base}users`;

  constructor(private http: HttpClient) {}

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

  // GET /users/{uuid}/work-experience
  getUserWorkExperienceById(userId: string): Observable<UserWorkExperience[]> {
    return this.http.get<UserWorkExperience[]>(
      `${this.users}/get-user-work-experience?user_id=${userId}`
    );
  }

  // GET /users/{uuid}/education
  getUserEducationById(userId: string): Observable<UserEducation[]> {
    return this.http.get<UserEducation[]>(`${this.users}/get-user-education?user_id=${userId}`);
  }
}
