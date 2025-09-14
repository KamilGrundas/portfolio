import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Master } from '../../core/services/master';
import { UserPublic } from '../../types';

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
  user: UserPublic | null = null;

  data: OverviewData = {
    name: '',
    title: 'Frontend Developer',
    intro: 'A Frontend Developer passionate about building fast, scalable, and accessible web applications with Angular and TypeScript.',
    avatar: 'https://prenumerata.inzynieria.com/wp-content/uploads/2014/10/speaker-3-269x300.jpg',
  };

  constructor(private master: Master, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.master.getUserByUrl('kamil').subscribe({
      next: (res) => {
        this.user = res;
        this.data.name = res.full_name ?? res.email;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('GET /users/by-url failed', err),
    });
  }
}
