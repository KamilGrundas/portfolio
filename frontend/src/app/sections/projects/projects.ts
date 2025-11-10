import { Component } from '@angular/core';
import { UserProject } from '../../types';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-projects',
  imports: [MatIconModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  projects: UserProject[] = [
    {
      id: 'proj-1',
      name: 'Portfolio Website',
      description:
        'Personal portfolio built with Angular, TypeScript and Bootstrap. Features dark/light mode toggle and responsive design.',
      skills: [
        {
          id: 'html',
          name: 'HTML5',
          order: 1,
          category: { name: 'Languages', icon: 'html', color: '#e34f26' },
        },
        {
          id: 'css',
          name: 'CSS3',
          order: 2,
          category: { name: 'Styling', icon: 'style', color: '#2563eb' },
        },
        {
          id: 'js',
          name: 'JavaScript (ES6+)',
          order: 3,
          category: { name: 'Languages', icon: 'javascript', color: '#f59e0b' },
        },
        {
          id: 'figma',
          name: 'Figma',
          order: 4,
          category: { name: 'UX & Design', icon: 'design_services', color: '#a78bfa' },
        },
        {
          id: 'testing-library',
          name: 'Testing Library',
          order: 5,
          category: { name: 'Testing', icon: 'bug_report', color: '#ef4444' },
        },
      ],
      source_code: 'https://github.com/johndoe/portfolio',
      deployment_url: 'https://johndoe.dev',
      imageUrl: 'https://i.postimg.cc/XYJ3n7y2/Screenshot-2025-09-12-at-14-19-13.png',
    },
  ];
}
