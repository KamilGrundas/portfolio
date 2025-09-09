import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Skills {
  skills = [
    { name: 'Angular', level: 'Expert', years: 5 },
    { name: 'TypeScript', level: 'Expert', years: 6 },
    { name: 'RxJS', level: 'Advanced', years: 4 },
    { name: 'Bootstrap', level: 'Advanced', years: 3 },
    { name: 'Node.js', level: 'Intermediate', years: 2 },
  ];
}
