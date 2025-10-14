import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserWorkExperience } from '../../types';

@Component({
  selector: 'app-experience',
  imports: [MatIconModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
  experiences = input.required<UserWorkExperience[]>();
}
