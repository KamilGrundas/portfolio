import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type WorkExperience = {
  company: string;
  role: string;
  period: string;      // e.g., "Jan 2022 — Present"
  location?: string;
  bullets: string[];
  tech?: string[];
};

@Component({
  selector: 'app-experience',
  imports: [MatIconModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Experience {
  experiences: WorkExperience[] = [
    {
      company: 'Acme Corp',
      role: 'Senior Frontend Engineer',
      period: 'Jan 2023 — Present',
      location: 'Remote',
      bullets: [
        'Led Angular 16→20 migration and performance tuning (TTI -35%).',
        'Built design system with Bootstrap utilities and custom components.',
        'Mentored 3 developers, reviewed PRs and improved DX with ESLint/Prettier.'
      ],
      tech: ['Angular', 'TypeScript', 'RxJS', 'Bootstrap', 'Nx']
    },
    {
      company: 'Globex',
      role: 'Frontend Developer',
      period: 'May 2020 — Dec 2022',
      location: 'Warsaw, PL',
      bullets: [
        'Implemented SPA dashboards with charts and real-time data.',
        'Collaborated with backend on REST/GraphQL contracts.',
        'Improved accessibility (WCAG) and Lighthouse scores.'
      ],
      tech: ['Angular', 'TypeScript', 'Chart.js', 'Jest']
    }
  ];
}

