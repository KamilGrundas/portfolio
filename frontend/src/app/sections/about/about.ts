import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AboutData = {
  heading: string;
  about: string;
  extra: string;
  image: string;
};

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  data = input.required<AboutData>();
}
