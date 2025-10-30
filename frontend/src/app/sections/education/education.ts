import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type EducationData = {
  title: string;
  school: string;
  period: string;
  location?: string;
  logo_url?: string;
};

@Component({
  selector: 'app-education',
  imports: [MatIconModule],
  templateUrl: './education.html',
  styleUrl: './education.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Education {
  education: EducationData[] = [
    {
      title: 'Bachelor of Science in Computer Science',
      school: 'University of Technology',
      period: '2016 — 2019',
      location: 'Warsaw, PL',
      logo_url: 'https://w.prz.edu.pl/themes/prz/images/favicon.png?ver=9.73',
    },
    {
      title: 'Frontend Development Certification',
      school: 'Online Bootcamp',
      period: '2020',
      logo_url: 'https://faq-qa.m.goit.global/pl/img/logo.png',
    },
  ];
}
