import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly title = inject(Title);

  readonly error = signal<string | null>(null);
  readonly loading = this.auth.loading;
  readonly currentUser = this.auth.currentUser;
  readonly hasSession = computed(() => this.auth.isAuthenticated());

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.auth.ensureSession();
    this.title.setTitle('Portfolio Creator');
    effect(() => {
      if (this.hasSession()) {
        void this.redirectToPortfolio();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.error.set(null);

    this.auth.login(email, password).subscribe({
      next: () => {
        const currentUser = this.currentUser();
        if (!currentUser?.url) {
          this.error.set('This account does not have a portfolio URL configured.');
          return;
        }
        void this.router.navigate(['/', currentUser.url]);
      },
      error: () => {
        this.error.set('Incorrect email or password.');
      },
    });
  }

  private async redirectToPortfolio(): Promise<void> {
    const user = this.currentUser();
    if (user?.url) {
      await this.router.navigate(['/', user.url]);
    }
  }
}
