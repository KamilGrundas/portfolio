import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserEducation } from '../../types';

@Component({
  selector: 'app-education',
  imports: [MatIconModule],
  templateUrl: './education.html',
  styleUrl: './education.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Education {
  education = input.required<UserEducation[]>();
}
