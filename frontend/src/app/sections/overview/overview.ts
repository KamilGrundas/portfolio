import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HideBrokenImageDirective } from '../../shared/hide-broken-image.directive';

export type OverviewData = {
  name: string;
  title: string;
  intro: string;
  avatar: string;
};

@Component({
  selector: 'app-overview',
  imports: [HideBrokenImageDirective],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  data = input.required<OverviewData>();
}
