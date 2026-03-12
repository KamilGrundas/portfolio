import { Component, input } from '@angular/core';
import { UserProject } from '../../types';
import { MatIconModule } from '@angular/material/icon';
import { HideBrokenImageDirective } from '../../shared/hide-broken-image.directive';

@Component({
  selector: 'app-projects',
  imports: [MatIconModule, HideBrokenImageDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  projects = input.required<UserProject[]>();
}
