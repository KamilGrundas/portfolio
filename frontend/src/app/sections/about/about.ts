import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HideBrokenImageDirective } from '../../shared/hide-broken-image.directive';

export type AboutData = {
  heading: string;
  about: string;
  extra: string;
  image: string;
};

@Component({
  selector: 'app-about',
  imports: [HideBrokenImageDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  data = input.required<AboutData>();
}
