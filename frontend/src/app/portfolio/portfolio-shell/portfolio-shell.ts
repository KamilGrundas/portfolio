import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, forkJoin, of } from 'rxjs';
import { inject, signal } from '@angular/core';
import { Master } from '../../core/services/master';
import { UserPublic, UserDetailsPublic } from '../../types';
import { Overview, OverviewData } from '../../sections/overview/overview';
import { Navbar, NavbarData } from '../../sections/navbar/navbar';
import { About } from '../../sections/about/about';
import { Skills } from '../../sections/skills/skills';
import { Experience } from '../../sections/experience/experience';
import { Education } from '../../sections/education/education';
import { Certificates } from '../../sections/certificates/certificates';
import { Contact } from '../../sections/contact/contact';
import { Footer } from '../../sections/footer/footer';
import { Projects } from '../../sections/projects/projects';
import { JOHN_DOE_USER, JOHN_DOE_DETAILS } from '../../shared/defaults/porfolio-defaults';

@Component({
  selector: 'app-portfolio-shell',
  imports: [
    Overview,
    Navbar,
    About,
    Skills,
    Experience,
    Education,
    Certificates,
    Contact,
    Footer,
    Projects,
  ],
  templateUrl: './portfolio-shell.html',
  styleUrl: './portfolio-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioShell {
  private route = inject(ActivatedRoute);
  private api = inject(Master);

  user = signal<UserPublic>(JOHN_DOE_USER);
  details = signal<UserDetailsPublic>(JOHN_DOE_DETAILS);
  error = signal<string | null>(null);
  loading = signal<boolean>(true);

  navbarData = computed<NavbarData>(() => ({
    name: (this.user()?.full_name ?? JOHN_DOE_USER.full_name) as string,
  }));

  overviewData = computed<OverviewData>(() => ({
    name: (this.user()?.full_name ?? JOHN_DOE_USER.full_name) as string,
    title: (this.details()?.title ?? JOHN_DOE_DETAILS.title) as string,
    intro: (this.details()?.intro ?? JOHN_DOE_DETAILS.intro) as string,
    avatar: (this.details()?.avatar ?? JOHN_DOE_DETAILS.avatar) as string,
  }));

  readonly flow$ = this.route.paramMap
    .pipe(
      map((pm) => pm.get('user_url')!),
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap((userUrl) => this.api.getUserByUrl(userUrl)),
      switchMap((user) =>
        forkJoin({
          user: of(user),
          details: this.api.getUserDetailsById(user.id),
        })
      ),
      tap(({ user, details }) => {
        this.user.set(user);
        this.details.set(details);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.error.set('Nie udało się wczytać danych użytkownika.');
        this.loading.set(false);
        console.error(err);
        return EMPTY;
      })
    )
    .subscribe();
}
