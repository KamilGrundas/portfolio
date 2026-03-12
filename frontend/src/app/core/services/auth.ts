import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Master } from './master';
import { UserPublic } from '../../types';

const TOKEN_KEY = 'portfolio_access_token';
const USER_KEY = 'portfolio_current_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(Master);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly token = signal<string | null>(this.readToken());
  readonly currentUser = signal<UserPublic | null>(this.readStoredUser());
  readonly loading = signal(false);
  readonly ready = signal(!this.token());
  readonly isAuthenticated = computed(() => Boolean(this.token() && this.currentUser()));

  constructor() {
    this.ensureSession();
  }

  login(email: string, password: string) {
    this.loading.set(true);
    return this.api.loginAccessToken(email, password).pipe(
      tap((token) => {
        this.storeToken(token.access_token);
        this.ready.set(false);
      }),
      switchMap(() => this.refreshCurrentUser()),
      finalize(() => this.loading.set(false))
    );
  }

  refreshCurrentUser() {
    if (!this.token()) {
      this.currentUser.set(null);
      this.storeCurrentUser(null);
      this.ready.set(true);
      return of(null);
    }

    this.loading.set(true);
    return this.api.getCurrentUser().pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.storeCurrentUser(user);
        this.ready.set(true);
      }),
      catchError((error: unknown) => {
        if (this.isAuthFailure(error)) {
          this.logout(false);
          return of(null);
        }

        // Keep the locally restored session if refreshing the profile fails transiently.
        this.ready.set(true);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  logout(redirect = true): void {
    this.storeToken(null);
    this.currentUser.set(null);
    this.storeCurrentUser(null);
    this.ready.set(true);
    if (redirect) {
      void this.router.navigateByUrl('/');
    }
  }

  ensureSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedToken) {
      return;
    }

    if (this.token() !== storedToken) {
      this.token.set(storedToken);
      this.ready.set(false);
    }

    if (!this.currentUser() && storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser) as UserPublic);
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    if (!this.currentUser() && !this.loading()) {
      this.refreshCurrentUser().subscribe();
      return;
    }

    if (!this.loading()) {
      this.refreshCurrentUser().subscribe();
    }
  }

  private readToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  private readStoredUser(): UserPublic | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as UserPublic;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  private storeToken(token: string | null): void {
    this.token.set(token);
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
  }

  private storeCurrentUser(user: UserPublic | null): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return;
    }
    localStorage.removeItem(USER_KEY);
  }

  private isAuthFailure(error: unknown): boolean {
    return (
      error instanceof HttpErrorResponse &&
      (error.status === 401 || error.status === 403 || error.status === 404)
    );
  }
}
