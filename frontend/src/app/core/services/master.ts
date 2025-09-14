import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPublic } from '../../types';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class Master {
    
  private readonly base = environment.apiUrl;
  private readonly users = `${this.base}users`;

  constructor(private http: HttpClient ) { }


  // GET /users/by-id/{uuid}
  getUserById(userId: string): Observable<UserPublic> {
    return this.http.get<UserPublic>(`${this.users}/by-id/${userId}`);
  }

  // GET /users/by-url/{url}
  getUserByUrl(url: string): Observable<UserPublic> {
    return this.http.get<UserPublic>(`${this.users}/by-url/${encodeURIComponent(url)}`);
  }
}

