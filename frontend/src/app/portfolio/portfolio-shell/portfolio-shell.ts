import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Master } from '../../core/services/master';
import { AuthService } from '../../core/services/auth';
import {
  CertificateCreate,
  ContactPublic,
  ContactUpdate,
  EducationCreate,
  ExperienceHighlight,
  ExperienceHighlightCreate,
  ProjectCreate,
  Skill,
  SkillCategoryCreate,
  SkillCategoryPublic,
  UserCertificate,
  UserDetailsPublic,
  UserEducation,
  UserProject,
  UserPublic,
  UserSkillsByCategory,
  UserWorkExperience,
  WorkExperienceCreate,
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
  JOHN_DOE_CONTACT,
  JOHN_DOE_SKILLS,
  JOHN_DOE_WORK_EXPERIENCE,
  JOHN_DOE_EDUCATION,
  JOHN_DOE_CERTIFICATES,
  JOHN_DOE_PROJECTS,
} from '../../shared/defaults/porfolio-defaults';

type EditableSkill = Skill & { id?: string };
type EditableSkillCategory = UserSkillsByCategory & { id?: string; skills: EditableSkill[] };
type EditableExperience = UserWorkExperience & { skillIds: string[]; highlights: ExperienceHighlight[] };
type EditableProject = UserProject & { skillIds: string[] };
type NavSection = { id: string; label: string };

@Component({
  selector: 'app-portfolio-shell',
  imports: [
    FormsModule,
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
  private static readonly DEFAULT_PORTFOLIO_URL = 'john_doe';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(Master);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly title = inject(Title);

  user = signal<UserPublic>(this.emptyUser(''));
  details = signal<UserDetailsPublic>(this.emptyDetails(''));
  skills = signal<UserSkillsByCategory[]>([]);
  workExperience = signal<UserWorkExperience[]>([]);
  education = signal<UserEducation[]>([]);
  certificates = signal<UserCertificate[]>([]);
  projects = signal<UserProject[]>([]);
  contact = signal<ContactPublic | null>(null);
  skillCatalog = signal<SkillCategoryPublic[]>([]);

  editableUser: UserPublic = this.emptyUser('');
  editableDetails: UserDetailsPublic = this.emptyDetails('');
  editableSkills: EditableSkillCategory[] = [];
  editableWorkExperience: EditableExperience[] = [];
  editableEducation: UserEducation[] = [];
  editableCertificates: UserCertificate[] = [];
  editableProjects: EditableProject[] = [];
  editableContact: ContactPublic = this.emptyContact();

  error = signal<string | null>(null);
  loading = signal<boolean>(true);
  saving = signal<boolean>(false);
  editing = signal<boolean>(false);
  editorState = signal<Record<string, boolean>>({});

  readonly currentUser = this.auth.currentUser;
  readonly isLoggedIn = computed(() => this.auth.isAuthenticated());
  readonly isOwner = computed(() => this.currentUser()?.id === this.user().id);
  readonly publicSections = computed<NavSection[]>(() => {
    const sections: NavSection[] = [{ id: 'overview', label: 'Overview' }];

    if (this.hasAboutSection()) {
      sections.push({ id: 'about', label: 'About' });
    }
    if (this.hasSkillsSection()) {
      sections.push({ id: 'skills', label: 'Skills' });
    }
    if (this.hasExperienceSection()) {
      sections.push({ id: 'experience', label: 'Experience' });
    }
    if (this.hasEducationSection()) {
      sections.push({ id: 'education', label: 'Education' });
    }
    if (this.hasCertificatesSection()) {
      sections.push({ id: 'certificates', label: 'Certificates' });
    }
    if (this.hasProjectsSection()) {
      sections.push({ id: 'projects', label: 'Projects' });
    }
    if (this.hasContactSection()) {
      sections.push({ id: 'contact', label: 'Contact' });
    }

    return sections;
  });
  readonly editingSections: NavSection[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  navbarData = computed<NavbarData>(() => ({
    name: this.user().full_name || 'Portfolio',
    sections: this.editing() ? this.editingSections : this.publicSections(),
    canEdit: this.isOwner(),
    editing: this.editing(),
    saving: this.saving(),
    isLoggedIn: this.isLoggedIn(),
  }));

  overviewData = computed<OverviewData>(() => ({
    name: this.user().full_name || 'Portfolio',
    title: this.details()?.title || '',
    intro: this.details()?.intro || '',
    avatar: this.details()?.avatar || '',
  }));

  aboutData = computed<AboutData>(() => ({
    heading: 'About',
    about: this.details()?.about || '',
    extra: this.details()?.extra || '',
    image: this.details()?.work_station_url || '',
  }));

  skillsData = computed<SkillsData[]>(() => this.skills());
  experienceData = computed<UserWorkExperience[]>(() => this.workExperience());
  educationData = computed<UserEducation[]>(() => this.education());
  certificatesData = computed<UserCertificate[]>(() => this.certificates());
  projectsData = computed<UserProject[]>(() => this.projects());
  hasAboutSection = computed(
    () => Boolean(this.aboutData().about || this.aboutData().extra || this.aboutData().image)
  );
  hasSkillsSection = computed(() => this.skillsData().length > 0);
  hasExperienceSection = computed(() => this.experienceData().length > 0);
  hasEducationSection = computed(() => this.educationData().length > 0);
  hasCertificatesSection = computed(() => this.certificatesData().length > 0);
  hasProjectsSection = computed(() => this.projectsData().length > 0);
  hasContactSection = computed(
    () =>
      Boolean(
        this.contact()?.contact_email ||
          this.contact()?.phone_number ||
          this.contact()?.linked_in_url ||
          this.contact()?.github_url ||
          this.contact()?.location
      )
  );

  constructor() {
    effect(() => {
      const fullName = this.user().full_name?.trim();
      this.title.setTitle(fullName ? `${fullName} - portfolio` : 'Portfolio');
    });

    this.route.paramMap
      .pipe(
        map((pm) => pm.get('user_url')!),
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
          this.editing.set(false);
        }),
        switchMap((userUrl) => this.fetchPortfolio(userUrl)),
        tap((portfolio) => {
          this.user.set(portfolio.user);
          this.details.set(portfolio.details);
          this.skills.set(portfolio.skills);
          this.workExperience.set(portfolio.workExperience);
          this.education.set(portfolio.education);
          this.certificates.set(portfolio.certificates);
          this.projects.set(portfolio.projects);
          this.contact.set(portfolio.contact);
          this.skillCatalog.set(portfolio.skillCatalog);
          this.resetEditableState();
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

  startEditing(): void {
    if (!this.isOwner()) {
      return;
    }
    this.resetEditableState();
    this.editorState.set({});
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.resetEditableState();
    this.editorState.set({});
    this.editing.set(false);
  }

  isEditorOpen(key: string): boolean {
    return Boolean(this.editorState()[key]);
  }

  openEditor(key: string): void {
    this.editorState.update((state) => ({ ...state, [key]: true }));
  }

  closeEditor(key: string): void {
    this.editorState.update((state) => {
      const next = { ...state };
      delete next[key];
      return next;
    });
  }

  async saveAll(): Promise<void> {
    await this.persistPortfolio(false);
  }

  logout(): void {
    this.auth.logout();
  }

  async saveOverview(): Promise<void> {
    await this.persistPortfolio(true, 'overview');
  }

  cancelOverview(): void {
    this.editableUser = this.clone(this.user());
    this.editableDetails = {
      ...this.editableDetails,
      title: this.details().title,
      intro: this.details().intro,
      avatar: this.details().avatar,
    };
    this.closeEditor('overview');
  }

  async saveAbout(): Promise<void> {
    await this.persistPortfolio(true, 'about');
  }

  cancelAbout(): void {
    this.editableDetails = {
      ...this.editableDetails,
      about: this.details().about,
      extra: this.details().extra,
      work_station_url: this.details().work_station_url,
    };
    this.closeEditor('about');
  }

  async saveContact(): Promise<void> {
    await this.persistPortfolio(true, 'contact');
  }

  cancelContact(): void {
    this.editableContact = this.clone(this.contact()) ?? this.emptyContact();
    this.closeEditor('contact');
  }

  async saveSkillCategory(categoryIndex: number): Promise<void> {
    const category = this.editableSkills[categoryIndex];
    await this.persistPortfolio(true, this.categoryEditorKey(category.id || `idx-${categoryIndex}`));
  }

  cancelSkillCategory(categoryIndex: number): void {
    const category = this.editableSkills[categoryIndex];
    const original = this.skills().find((item) => item.id === category.id);
    if (!original && category.id?.startsWith('tmp-')) {
      this.removeSkillCategory(categoryIndex);
    } else if (original) {
      this.editableSkills[categoryIndex] = this.clone(original) as EditableSkillCategory;
    }
    this.closeEditor(this.categoryEditorKey(category.id || `idx-${categoryIndex}`));
  }

  async saveExperience(experienceIndex: number): Promise<void> {
    const item = this.editableWorkExperience[experienceIndex];
    await this.persistPortfolio(true, this.experienceEditorKey(item.id || `idx-${experienceIndex}`));
  }

  cancelExperience(experienceIndex: number): void {
    const item = this.editableWorkExperience[experienceIndex];
    const original = this.workExperience().find((experience) => experience.id === item.id);
    if (!original && item.id?.startsWith('tmp-')) {
      this.removeExperience(experienceIndex);
    } else if (original) {
      this.editableWorkExperience[experienceIndex] = this.cloneExperience([original])[0];
    }
    this.closeEditor(this.experienceEditorKey(item.id || `idx-${experienceIndex}`));
  }

  async saveEducationItem(index: number): Promise<void> {
    const item = this.editableEducation[index];
    await this.persistPortfolio(true, this.educationEditorKey(item.id || `idx-${index}`));
  }

  cancelEducationItem(index: number): void {
    const item = this.editableEducation[index];
    const original = this.education().find((education) => education.id === item.id);
    if (!original && item.id?.startsWith('tmp-')) {
      this.removeEducation(index);
    } else if (original) {
      this.editableEducation[index] = this.clone(original);
    }
    this.closeEditor(this.educationEditorKey(item.id || `idx-${index}`));
  }

  async saveCertificateItem(index: number): Promise<void> {
    const item = this.editableCertificates[index];
    await this.persistPortfolio(true, this.certificateEditorKey(item.id || `idx-${index}`));
  }

  cancelCertificateItem(index: number): void {
    const item = this.editableCertificates[index];
    const original = this.certificates().find((certificate) => certificate.id === item.id);
    if (!original && item.id?.startsWith('tmp-')) {
      this.removeCertificate(index);
    } else if (original) {
      this.editableCertificates[index] = this.clone(original);
    }
    this.closeEditor(this.certificateEditorKey(item.id || `idx-${index}`));
  }

  async saveProjectItem(index: number): Promise<void> {
    const item = this.editableProjects[index];
    await this.persistPortfolio(true, this.projectEditorKey(item.id || `idx-${index}`));
  }

  cancelProjectItem(index: number): void {
    const item = this.editableProjects[index];
    const original = this.projects().find((project) => project.id === item.id);
    if (!original && item.id?.startsWith('tmp-')) {
      this.removeProject(index);
    } else if (original) {
      this.editableProjects[index] = this.cloneProjects([original])[0];
    }
    this.closeEditor(this.projectEditorKey(item.id || `idx-${index}`));
  }

  private async persistPortfolio(keepEditing = false, closeEditorKey?: string): Promise<void> {
    if (!this.isOwner()) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const previousUrl = this.user().url;
    const nextUrl = this.editableUser.url?.trim() || previousUrl;
    const contactPayload = this.buildContactPayload();

    if (contactPayload === 'missing_email') {
      this.error.set('Sekcja Contact wymaga poprawnego e-maila, jeśli uzupełniasz inne pola kontaktowe.');
      this.saving.set(false);
      return;
    }

    try {
      await firstValueFrom(
        this.api.updateCurrentUser({
          full_name: this.editableUser.full_name,
          email: this.editableUser.email,
          url: nextUrl,
        })
      );
      await firstValueFrom(this.api.updateMyDetails(this.editableDetails));
      if (contactPayload) {
        await firstValueFrom(this.api.updateMyContact(contactPayload));
      }

      const skillIdMap = await this.syncSkills();
      await this.syncWorkExperience(skillIdMap);
      await this.syncEducation();
      await this.syncCertificates();
      await this.syncProjects(skillIdMap);

      const portfolio = await firstValueFrom(this.fetchPortfolio(nextUrl || this.route.snapshot.paramMap.get('user_url') || ''));
      this.user.set(portfolio.user);
      this.details.set(portfolio.details);
      this.skills.set(portfolio.skills);
      this.workExperience.set(portfolio.workExperience);
      this.education.set(portfolio.education);
      this.certificates.set(portfolio.certificates);
      this.projects.set(portfolio.projects);
      this.contact.set(portfolio.contact);
      this.skillCatalog.set(portfolio.skillCatalog);
      this.resetEditableState();
      this.editing.set(keepEditing);
      if (closeEditorKey) {
        this.closeEditor(closeEditorKey);
      } else {
        this.editorState.set({});
      }

      if (nextUrl && nextUrl !== previousUrl) {
        await this.router.navigate(['/', nextUrl]);
      }
    } catch (err) {
      console.error(err);
      this.error.set(this.resolveSaveError(err));
    } finally {
      this.saving.set(false);
    }
  }

  async deleteSkillCategory(categoryIndex: number): Promise<void> {
    const category = this.editableSkills[categoryIndex];
    if (!category.id || category.id.startsWith('tmp-')) {
      this.removeSkillCategory(categoryIndex);
      return;
    }
    this.saving.set(true);
    try {
      for (const skill of category.skills) {
        if (skill.id) {
          await firstValueFrom(this.api.deleteSkill(skill.id));
        }
      }
      await firstValueFrom(this.api.deleteSkillCategory(category.id));
      await this.reloadPortfolio(true);
    } catch (error) {
      console.error(error);
      this.error.set(this.resolveSaveError(error));
    } finally {
      this.saving.set(false);
    }
  }


  async deleteExperienceItem(experienceIndex: number): Promise<void> {
    const item = this.editableWorkExperience[experienceIndex];
    if (!item.id || item.id.startsWith('tmp-')) {
      this.removeExperience(experienceIndex);
      return;
    }
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteWorkExperience(item.id));
      await this.reloadPortfolio(true);
    } catch (error) {
      console.error(error);
      this.error.set(this.resolveSaveError(error));
    } finally {
      this.saving.set(false);
    }
  }


  async deleteEducationItem(index: number): Promise<void> {
    const item = this.editableEducation[index];
    if (!item.id || item.id.startsWith('tmp-')) {
      this.removeEducation(index);
      return;
    }
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteEducation(item.id));
      await this.reloadPortfolio(true);
    } catch (error) {
      console.error(error);
      this.error.set(this.resolveSaveError(error));
    } finally {
      this.saving.set(false);
    }
  }


  async deleteCertificateItem(index: number): Promise<void> {
    const item = this.editableCertificates[index];
    if (!item.id || item.id.startsWith('tmp-')) {
      this.removeCertificate(index);
      return;
    }
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteCertificate(item.id));
      await this.reloadPortfolio(true);
    } catch (error) {
      console.error(error);
      this.error.set(this.resolveSaveError(error));
    } finally {
      this.saving.set(false);
    }
  }


  async deleteProjectItem(index: number): Promise<void> {
    const item = this.editableProjects[index];
    if (!item.id || item.id.startsWith('tmp-')) {
      this.removeProject(index);
      return;
    }
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteProject(item.id));
      await this.reloadPortfolio(true);
    } catch (error) {
      console.error(error);
      this.error.set(this.resolveSaveError(error));
    } finally {
      this.saving.set(false);
    }
  }

  addSkillCategory(): void {
    const id = this.newTempId('category');
    this.editableSkills = [
      ...this.editableSkills,
      {
        id,
        name: 'Nowa kategoria',
        icon: 'code',
        color: '#0d6efd',
        order: this.editableSkills.length,
        skills: [],
      },
    ];
    this.openEditor(this.categoryEditorKey(id));
  }

  addSkill(categoryIndex: number): void {
    const category = this.editableSkills[categoryIndex];
    category.skills = [
      ...category.skills,
      {
        id: this.newTempId('skill'),
        name: 'Nowa umiejętność',
        category_id: category.id,
        order: category.skills.length,
      },
    ];
  }

  removeSkillCategory(categoryIndex: number): void {
    this.editableSkills = this.editableSkills.filter((_, index) => index !== categoryIndex);
  }

  removeSkill(categoryIndex: number, skillIndex: number): void {
    this.editableSkills[categoryIndex].skills = this.editableSkills[categoryIndex].skills.filter(
      (_, idx) => idx !== skillIndex
    );
  }

  addExperience(): void {
    const id = this.newTempId('experience');
    this.editableWorkExperience = [
      ...this.editableWorkExperience,
      {
        id,
        company: '',
        role: '',
        period: '',
        location: '',
        highlights: [{ id: this.newTempId('highlight'), text: '' }],
        skills: [],
        skillIds: [],
      },
    ];
    this.openEditor(this.experienceEditorKey(id));
  }

  addHighlight(experienceIndex: number): void {
    this.editableWorkExperience[experienceIndex].highlights = [
      ...this.editableWorkExperience[experienceIndex].highlights,
      { id: this.newTempId('highlight'), text: '' },
    ];
  }

  removeExperience(index: number): void {
    this.editableWorkExperience = this.editableWorkExperience.filter((_, itemIndex) => itemIndex !== index);
  }

  removeHighlight(experienceIndex: number, highlightIndex: number): void {
    this.editableWorkExperience[experienceIndex].highlights = this.editableWorkExperience[
      experienceIndex
    ].highlights.filter((_, idx) => idx !== highlightIndex);
  }

  addEducation(): void {
    const id = this.newTempId('education');
    this.editableEducation = [
      ...this.editableEducation,
      {
        id,
        school: '',
        title: '',
        period: '',
        location: '',
        logo_url: '',
      },
    ];
    this.openEditor(this.educationEditorKey(id));
  }

  removeEducation(index: number): void {
    this.editableEducation = this.editableEducation.filter((_, itemIndex) => itemIndex !== index);
  }

  addCertificate(): void {
    const id = this.newTempId('certificate');
    this.editableCertificates = [
      ...this.editableCertificates,
      {
        id,
        name: '',
        issuer: '',
        issuer_logo_url: '',
        issue_date: '',
        credential_id: '',
        credential_url: '',
      },
    ];
    this.openEditor(this.certificateEditorKey(id));
  }

  removeCertificate(index: number): void {
    this.editableCertificates = this.editableCertificates.filter((_, itemIndex) => itemIndex !== index);
  }

  addProject(): void {
    const id = this.newTempId('project');
    this.editableProjects = [
      ...this.editableProjects,
      {
        id,
        name: '',
        source_code: '',
        deployment_url: '',
        description: '',
        skills: [],
        skillIds: [],
        image_url: null,
        imageUrl: null,
      },
    ];
    this.openEditor(this.projectEditorKey(id));
  }

  removeProject(index: number): void {
    this.editableProjects = this.editableProjects.filter((_, itemIndex) => itemIndex !== index);
  }

  private fetchPortfolio(userUrl: string) {
    const useDefaultProfile = this.shouldUseDefaultProfile(userUrl);
    return this.api.getUserByUrl(userUrl).pipe(
      catchError(() => of(useDefaultProfile ? JOHN_DOE_USER : this.emptyUser(userUrl))),
      switchMap((user) =>
        forkJoin({
          user: of(user),
          details: this.api
            .getUserDetailsById(user.id)
            .pipe(catchError(() => of(useDefaultProfile ? JOHN_DOE_DETAILS : this.emptyDetails(user.id)))),
          skills: this.api
            .getUserSkillsById(user.id)
            .pipe(catchError(() => of(useDefaultProfile ? JOHN_DOE_SKILLS : []))),
          workExperience: this.api
            .getUserWorkExperiencesById(user.id)
            .pipe(catchError(() => of(useDefaultProfile ? JOHN_DOE_WORK_EXPERIENCE : []))),
          education: this.api
            .getUserEducationById(user.id)
            .pipe(catchError(() => of(useDefaultProfile ? JOHN_DOE_EDUCATION : []))),
          certificates: this.api
            .getUserCertificatesById(user.id)
            .pipe(catchError(() => of(useDefaultProfile ? JOHN_DOE_CERTIFICATES : []))),
          projects: this.api
            .getUserProjectsById(user.id)
            .pipe(catchError(() => of(useDefaultProfile ? JOHN_DOE_PROJECTS : []))),
          contact: this.api
            .getUserContactById(user.id)
            .pipe(catchError(() => of(useDefaultProfile ? JOHN_DOE_CONTACT : null))),
          skillCatalog: this.api.getSkillCategories().pipe(catchError(() => of([]))),
        })
      ),
      map((portfolio) => ({
        ...portfolio,
        projects: this.normalizeProjects(portfolio.projects),
      }))
    );
  }

  private resetEditableState(): void {
    this.editableUser = this.clone(this.user());
    this.editableDetails = this.clone(this.details());
    this.editableSkills = this.clone(this.skills());
    this.editableWorkExperience = this.cloneExperience(this.workExperience());
    this.editableEducation = this.clone(this.education());
    this.editableCertificates = this.clone(this.certificates());
    this.editableProjects = this.cloneProjects(this.projects());
    this.editableContact = this.clone(this.contact()) ?? this.emptyContact();
  }

  private async syncSkills(): Promise<Map<string, string>> {
    const originalSkills = this.skills().flatMap((category) => category.skills);
    const editedCategories = this.editableSkills;
    const idMap = new Map<string, string>();

    for (const category of editedCategories) {
      let categoryId = category.id;

      if (!categoryId || categoryId.startsWith('tmp-')) {
        const createdCategory = await firstValueFrom(
          this.api.createSkillCategory({
            name: category.name,
            icon: category.icon,
            color: category.color,
            order: category.order ?? 0,
          } satisfies SkillCategoryCreate)
        );
        categoryId = createdCategory.id;
        idMap.set(category.id || createdCategory.id, createdCategory.id);
      } else {
        await firstValueFrom(
          this.api.updateSkillCategory(categoryId, {
            name: category.name,
            icon: category.icon,
            color: category.color,
            order: category.order ?? 0,
          })
        );
      }

      for (const [skillIndex, skill] of category.skills.entries()) {
        if (!skill.id || skill.id.startsWith('tmp-')) {
          const createdSkill = await firstValueFrom(
            this.api.createSkill({
              name: skill.name,
              category_id: categoryId,
              order: skill.order ?? skillIndex,
            })
          );
          if (skill.id) {
            idMap.set(skill.id, createdSkill.id as string);
          }
          skill.id = createdSkill.id as string;
          skill.category_id = categoryId;
        } else {
          await firstValueFrom(
            this.api.updateSkill(skill.id, {
              name: skill.name,
              category_id: categoryId,
              order: skill.order ?? skillIndex,
            })
          );
          idMap.set(skill.id, skill.id);
        }
      }
    }

    const editedSkillIds = new Set(
      editedCategories.flatMap((category) => category.skills.map((skill) => idMap.get(skill.id || '') || skill.id))
    );

    for (const skill of originalSkills) {
      if (skill.id && !editedSkillIds.has(skill.id)) {
        await firstValueFrom(this.api.deleteSkill(skill.id));
      }
    }

    return idMap;
  }

  private async syncWorkExperience(skillIdMap: Map<string, string>): Promise<void> {
    const original = this.workExperience();
    const currentIds = new Set<string>();

    for (const item of this.editableWorkExperience) {
      let experienceId = item.id;
      const payload: WorkExperienceCreate = {
        company: item.company,
        role: item.role,
        period: item.period,
        location: item.location,
      };

      if (!experienceId || experienceId.startsWith('tmp-')) {
        const created = await firstValueFrom(this.api.createWorkExperience(payload));
        experienceId = created.id;
        item.id = created.id;
      }

      currentIds.add(experienceId);
      await firstValueFrom(
        this.api.updateWorkExperience(experienceId, {
          ...payload,
          skill_ids: item.skillIds.map((id) => skillIdMap.get(id) || id).filter(Boolean),
        })
      );

      const originalHighlights =
        original.find((experience) => experience.id === experienceId)?.highlights || [];
      const editedHighlightIds = new Set<string>();

      for (const highlight of item.highlights) {
        if (!highlight.id || highlight.id.startsWith('tmp-')) {
          const created = await firstValueFrom(
            this.api.createExperienceHighlight({
              text: highlight.text,
              work_experience_id: experienceId,
            } satisfies ExperienceHighlightCreate)
          );
          highlight.id = created.id;
          editedHighlightIds.add(created.id as string);
          continue;
        }

        editedHighlightIds.add(highlight.id);
        await firstValueFrom(
          this.api.updateExperienceHighlight(highlight.id, {
            text: highlight.text,
          })
        );
      }

      for (const highlight of originalHighlights) {
        if (highlight.id && !editedHighlightIds.has(highlight.id)) {
          await firstValueFrom(this.api.deleteExperienceHighlight(highlight.id));
        }
      }
    }

    for (const item of original) {
      if (item.id && !currentIds.has(item.id)) {
        await firstValueFrom(this.api.deleteWorkExperience(item.id));
      }
    }
  }

  private async syncEducation(): Promise<void> {
    const original = this.education();
    const currentIds = new Set<string>();

    for (const item of this.editableEducation) {
      let educationId = item.id;
      const payload: EducationCreate = {
        school: item.school,
        title: item.title,
        period: item.period,
        location: item.location,
        logo_url: item.logo_url,
      };

      if (!educationId || educationId.startsWith('tmp-')) {
        const created = await firstValueFrom(this.api.createEducation(payload));
        educationId = created.id;
      } else {
        await firstValueFrom(this.api.updateEducation(educationId, payload));
      }

      currentIds.add(educationId);
    }

    for (const item of original) {
      if (item.id && !currentIds.has(item.id)) {
        await firstValueFrom(this.api.deleteEducation(item.id));
      }
    }
  }

  private async syncCertificates(): Promise<void> {
    const original = this.certificates();
    const currentIds = new Set<string>();

    for (const item of this.editableCertificates) {
      let certificateId = item.id;
      const payload: CertificateCreate = {
        name: item.name,
        issuer: item.issuer,
        issuer_logo_url: item.issuer_logo_url,
        issue_date: item.issue_date,
        credential_id: item.credential_id,
        credential_url: item.credential_url,
      };

      if (!certificateId || certificateId.startsWith('tmp-')) {
        const created = await firstValueFrom(this.api.createCertificate(payload));
        certificateId = created.id;
      } else {
        await firstValueFrom(this.api.updateCertificate(certificateId, payload));
      }

      currentIds.add(certificateId);
    }

    for (const item of original) {
      if (item.id && !currentIds.has(item.id)) {
        await firstValueFrom(this.api.deleteCertificate(item.id));
      }
    }
  }

  private async syncProjects(skillIdMap: Map<string, string>): Promise<void> {
    const original = this.projects();
    const currentIds = new Set<string>();

    for (const item of this.editableProjects) {
      let projectId = item.id;
      const payload: ProjectCreate = {
        name: item.name,
        source_code: item.source_code,
        deployment_url: item.deployment_url,
        image_url: this.normalizeOptional(item.imageUrl ?? item.image_url),
        description: item.description,
      };

      if (!projectId || projectId.startsWith('tmp-')) {
        const created = await firstValueFrom(this.api.createProject(payload));
        projectId = created.id;
      }

      currentIds.add(projectId);
      await firstValueFrom(
        this.api.updateProject(projectId, {
          ...payload,
          skill_ids: item.skillIds.map((id) => skillIdMap.get(id) || id).filter(Boolean),
        })
      );
    }

    for (const item of original) {
      if (item.id && !currentIds.has(item.id)) {
        await firstValueFrom(this.api.deleteProject(item.id));
      }
    }
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }

  private cloneExperience(value: UserWorkExperience[]): EditableExperience[] {
    return this.clone(value).map((item) => ({
      ...item,
      highlights: item.highlights ?? [],
      skillIds: item.skills?.map((skill) => skill.id) ?? [],
    }));
  }

  private cloneProjects(value: UserProject[]): EditableProject[] {
    return this.clone(value).map((item) => ({
      ...item,
      imageUrl: item.imageUrl ?? item.image_url ?? null,
      skillIds: item.skills?.map((skill) => skill.id) ?? [],
    }));
  }

  private normalizeProjects(projects: UserProject[]): UserProject[] {
    return projects.map((project) => ({
      ...project,
      imageUrl: project.imageUrl ?? project.image_url ?? null,
    }));
  }

  flattenedSkills(): Array<{ id: string; name: string; category: string }> {
    return this.editableSkills.flatMap((category) =>
      category.skills
        .filter((skill): skill is EditableSkill & { id: string } => Boolean(skill.id))
        .map((skill) => ({
          id: skill.id,
          name: skill.name,
          category: category.name,
        }))
    );
  }

  private newTempId(prefix: string): string {
    return `tmp-${prefix}-${crypto.randomUUID()}`;
  }

  private emptyContact(): ContactPublic {
    return {
      id: this.newTempId('contact'),
      user_id: this.user().id,
      contact_email: '',
      phone_number: null,
      linked_in_url: null,
      github_url: null,
      location: null,
    };
  }

  private emptyUser(userUrl: string): UserPublic {
    return {
      id: '',
      email: '',
      full_name: '',
      is_active: true,
      is_superuser: false,
      url: userUrl,
    };
  }

  private emptyDetails(userId: string): UserDetailsPublic {
    return {
      id: '',
      user_id: userId,
      title: '',
      intro: '',
      avatar: '',
      about: '',
      extra: '',
      work_station_url: '',
    };
  }

  private buildContactPayload():
    | {
        contact_email?: string | null;
        phone_number?: string | null;
        linked_in_url?: string | null;
        github_url?: string | null;
        location?: string | null;
      }
    | 'missing_email'
    | null {
    const email = this.editableContact.contact_email.trim();
    const phoneNumber = this.normalizeOptional(this.editableContact.phone_number);
    const linkedInUrl = this.normalizeOptional(this.editableContact.linked_in_url);
    const githubUrl = this.normalizeOptional(this.editableContact.github_url);
    const location = this.normalizeOptional(this.editableContact.location);
    const hasSecondaryFields = Boolean(phoneNumber || linkedInUrl || githubUrl || location);

    if (!email && !hasSecondaryFields) {
      return null;
    }

    if (!email) {
      return 'missing_email';
    }

    return {
      contact_email: email,
      phone_number: phoneNumber,
      linked_in_url: linkedInUrl,
      github_url: githubUrl,
      location,
    };
  }

  private normalizeOptional(value: string | null | undefined): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }

  private resolveSaveError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const detail = error.error?.detail;
      if (Array.isArray(detail)) {
        const emailError = detail.find((item) => item?.loc?.includes?.('contact_email'));
        if (emailError) {
          return 'Sekcja Contact wymaga poprawnego adresu e-mail.';
        }
      }
      if (typeof detail === 'string' && detail.length > 0) {
        return detail;
      }
    }
    return 'Nie udało się zapisać zmian portfolio.';
  }

  private shouldUseDefaultProfile(userUrl: string): boolean {
    return userUrl === PortfolioShell.DEFAULT_PORTFOLIO_URL;
  }

  private async reloadPortfolio(keepEditing = false, navigateToUrl?: string): Promise<void> {
    const targetUrl = navigateToUrl || this.route.snapshot.paramMap.get('user_url') || '';
    const portfolio = await firstValueFrom(this.fetchPortfolio(targetUrl));
    this.user.set(portfolio.user);
    this.details.set(portfolio.details);
    this.skills.set(portfolio.skills);
    this.workExperience.set(portfolio.workExperience);
    this.education.set(portfolio.education);
    this.certificates.set(portfolio.certificates);
    this.projects.set(portfolio.projects);
    this.contact.set(portfolio.contact);
    this.skillCatalog.set(portfolio.skillCatalog);
    this.resetEditableState();
    if (keepEditing) {
      this.editing.set(true);
    }
    if (navigateToUrl && navigateToUrl !== this.route.snapshot.paramMap.get('user_url')) {
      await this.router.navigate(['/', navigateToUrl]);
    }
  }

  categoryEditorKey(id: string): string {
    return `skills:${id}`;
  }

  experienceEditorKey(id: string): string {
    return `experience:${id}`;
  }

  educationEditorKey(id: string): string {
    return `education:${id}`;
  }

  certificateEditorKey(id: string): string {
    return `certificate:${id}`;
  }

  projectEditorKey(id: string): string {
    return `project:${id}`;
  }
}
