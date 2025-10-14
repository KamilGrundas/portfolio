import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, forkJoin, of } from 'rxjs';
import { Master } from '../../core/services/master';
import {
  UserPublic,
  UserDetailsPublic,
  UserSkillsByCategory,
  UserWorkExperience,
} from '../../types';
import { Overview, OverviewData } from '../../sections/overview/overview';
import { Navbar, NavbarData } from '../../sections/navbar/navbar';
import { About, AboutData } from '../../sections/about/about';
import { Skills, SkillsData } from '../../sections/skills/skills';
import { Experience } from '../../sections/experience/experience';
import { Education } from '../../sections/education/education';
import { Certificates } from '../../sections/certificates/certificates';
import { Contact } from '../../sections/contact/contact';
import { Footer } from '../../sections/footer/footer';
import { Projects } from '../../sections/projects/projects';
import {
  JOHN_DOE_USER,
  JOHN_DOE_DETAILS,
  JOHN_DOE_SKILLS,
  JOHN_DOE_WORK_EXPERIENCE,
} from '../../shared/defaults/porfolio-defaults';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(Master);
  private readonly destroyRef = inject(DestroyRef);

  user = signal<UserPublic>(JOHN_DOE_USER);
  details = signal<UserDetailsPublic>(JOHN_DOE_DETAILS);
  skills = signal<UserSkillsByCategory[]>(JOHN_DOE_SKILLS);
  workExperience = signal<UserWorkExperience[]>(JOHN_DOE_WORK_EXPERIENCE);

  error = signal<string | null>(null);
  loading = signal<boolean>(true);

  navbarData = computed<NavbarData>(() => ({
    name: (this.user()?.full_name || JOHN_DOE_USER.full_name) as string,
  }));

  overviewData = computed<OverviewData>(() => ({
    name: (this.user()?.full_name || JOHN_DOE_USER.full_name) as string,
    title: (this.details()?.title || JOHN_DOE_DETAILS.title) as string,
    intro: (this.details()?.intro || JOHN_DOE_DETAILS.intro) as string,
    avatar: (this.details()?.avatar || JOHN_DOE_DETAILS.avatar) as string,
  }));

  aboutData = computed<AboutData>(() => ({
    heading: 'About Me',
    about: (this.details()?.about || JOHN_DOE_DETAILS.about) as string,
    extra: (this.details()?.extra || JOHN_DOE_DETAILS.extra) as string,
    image: (this.details()?.work_station_url || JOHN_DOE_DETAILS.work_station_url) as string,
  }));

  skillsData = computed<SkillsData[]>(() => {
    const list = this.skills();
    return Array.isArray(list) && list.length > 0 ? list : JOHN_DOE_SKILLS;
  });

  experienceData = computed<UserWorkExperience[]>(() => {
    const list = this.workExperience();
    return Array.isArray(list) && list.length > 0 ? list : JOHN_DOE_WORK_EXPERIENCE;
  });

  readonly flow$ = this.route.paramMap
    .pipe(
      map((pm) => pm.get('user_url')!),
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap((userUrl) =>
        this.api.getUserByUrl(userUrl).pipe(catchError(() => of(JOHN_DOE_USER)))
      ),
      switchMap((user) =>
        forkJoin({
          user: of(user),
          details: this.api
            .getUserDetailsById(user.id)
            .pipe(catchError(() => of(JOHN_DOE_DETAILS))),
          skills: this.api.getUserSkillsById(user.id).pipe(catchError(() => of(JOHN_DOE_SKILLS))),
          workExperience: this.api
            .getUserWorkExperienceById(user.id)
            .pipe(catchError(() => of(JOHN_DOE_WORK_EXPERIENCE))),
        })
      ),
      tap(({ user, details, skills, workExperience }) => {
        this.user.set(user);
        this.details.set(details);
        this.skills.set(Array.isArray(skills) && skills.length ? skills : JOHN_DOE_SKILLS);
        this.workExperience.set(
          Array.isArray(workExperience) && workExperience.length
            ? workExperience
            : JOHN_DOE_WORK_EXPERIENCE
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.error.set('Nie udało się wczytać danych użytkownika.');
        this.loading.set(false);
        console.error(err);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe();
}
