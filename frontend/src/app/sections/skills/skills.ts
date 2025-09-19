import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface SkillCategory {
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
  categories: SkillCategory[] = [
    {
      title: 'Programming Languages',
      icon: 'code',
      color: '#22c55e',
      items: ['Python', 'C++', 'SQL', 'JavaScript', 'HTML', 'CSS', 'R', 'MATLAB'],
    },
    {
      title: 'Machine Learning & AI',
      icon: 'psychology',
      color: '#60a5fa',
      items: ['Scikit-learn', 'XGBoost', 'LightGBM', 'TensorFlow', 'PyTorch'],
    },
    {
      title: 'Data Science',
      icon: 'insights',
      color: '#f59e0b',
      items: ['Pandas', 'NumPy', 'Statsmodels'],
    },
    {
      title: 'Data Visualisation',
      icon: 'bar_chart',
      color: '#a78bfa',
      items: ['Power BI', 'matplotlib', 'seaborn', 'Plotly'],
    },
    {
      title: 'Cloud & MLOps',
      icon: 'cloud',
      color: '#c084fc',
      items: ['Docker', 'GitHub Actions', 'Azure', 'MLflow'],
    },
  ];

  toggle(cat: SkillCategory) {
    cat.open = !cat.open;
  }

  trackByTitle = (_: number, c: SkillCategory) => c.title;
}
