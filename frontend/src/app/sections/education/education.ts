import { ChangeDetectionStrategy, Component } from '@angular/core';


type EducationData = {
  school: string;
  degree: string;
  field: string;
  period: string;
  location?: string;
};

@Component({
  selector: 'app-education',
  imports: [],
  templateUrl: './education.html',
  styleUrl: './education.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Education {
  education: EducationData[] = [
    {
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      period: '2016 — 2019',
      location: 'Warsaw, PL',
    },
    {
      school: 'Online Bootcamp',
      degree: 'Certification',
      field: 'Frontend Development',
      period: '2020',
    },
  ];
}

