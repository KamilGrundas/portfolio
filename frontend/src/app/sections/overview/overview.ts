import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Master } from '../../core/services/master';
import { UserPublic } from '../../types';

export type OverviewData = {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  data = input.required<OverviewData>();
}
