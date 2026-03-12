import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserEducation } from '../../types';
import { HideBrokenImageDirective } from '../../shared/hide-broken-image.directive';

@Component({
  selector: 'app-education',
  imports: [MatIconModule, HideBrokenImageDirective],
  templateUrl: './education.html',
  styleUrl: './education.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Education {
  education = input.required<UserEducation[]>();
}
