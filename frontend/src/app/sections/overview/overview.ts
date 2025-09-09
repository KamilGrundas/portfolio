import { ChangeDetectionStrategy, Component } from '@angular/core';

type OverviewData = {
  name: string;
  title: string;
  intro: string;
  avatar: string;
};

@Component({
  selector: 'app-overview',
  imports: [],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Overview {
  data: OverviewData = {
    name: 'John Doe',
    title: 'Frontend Developer',
    intro: 'A Frontend Developer passionate about building fast, scalable, and accessible web applications with Angular and TypeScript.',
    avatar: 'https://prenumerata.inzynieria.com/wp-content/uploads/2014/10/speaker-3-269x300.jpg',
  };
}
