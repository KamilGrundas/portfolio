import { Component, input } from '@angular/core';
import { UserProject } from '../../types';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-projects',
  imports: [MatIconModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  projects = input.required<UserProject[]>();
}
