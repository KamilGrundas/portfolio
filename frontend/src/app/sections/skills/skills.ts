import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface SkillCategory {
  title: string;
  icon: string;
  color: string;
  items: string[];
  open?: boolean;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  categories = input.required<SkillCategory[]>();

  toggle(cat: SkillCategory) {
    cat.open = !cat.open;
  }

  trackByTitle = (_: number, c: SkillCategory) => c.title;
}
