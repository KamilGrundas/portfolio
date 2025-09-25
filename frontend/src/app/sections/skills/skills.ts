import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserSkillsByCategory } from '../../types';

export interface Skill {
  name: string;
  order?: number;
}

export interface SkillsData extends UserSkillsByCategory {
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
  categories = input.required<SkillsData[]>();

  toggle(cat: SkillsData) {
    cat.open = !cat.open;
  }

  trackByTitle = (_: number, c: SkillsData) => c.name;
}
