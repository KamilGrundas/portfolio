import { Component } from '@angular/core';

type Project = {
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
};

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects {
  projects: Project[] = [
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio built with Angular, TypeScript and Bootstrap. Features dark/light mode toggle and responsive design.',
      tech: ['Angular', 'TypeScript', 'Bootstrap'],
      githubUrl: 'https://github.com/johndoe/portfolio',
      liveUrl: 'https://johndoe.dev',
      imageUrl: 'https://i.postimg.cc/XYJ3n7y2/Screenshot-2025-09-12-at-14-19-13.png',
    },
    {
      title: 'Task Manager',
      description: 'A Kanban-style task manager with drag-and-drop functionality and persistent storage.',
      tech: ['Angular', 'RxJS', 'LocalStorage'],
      githubUrl: 'https://github.com/johndoe/task-manager',
      // brak imageUrl → karta będzie bez obrazka
    },
    {
      title: 'Weather App',
      description: 'Weather forecast app using OpenWeather API with geolocation and city search.',
      tech: ['Angular', 'TypeScript', 'REST API'],
      liveUrl: 'https://weather.johndoe.dev',
      imageUrl: 'https://images.twinkl.co.uk/tw1n/image/private/t_630/u/ux/spanish-weather_ver_3.jpg',
    },
    {
      title: 'Task Manager',
      description: 'A Kanban-style task manager with drag-and-drop functionality and persistent storage.',
      tech: ['Angular', 'RxJS', 'LocalStorage'],
      githubUrl: 'https://github.com/johndoe/task-manager',
      // brak imageUrl → karta będzie bez obrazka
    },
    {
      title: 'Weather App',
      description: 'Weather forecast app using OpenWeather API with geolocation and city search.',
      tech: ['Angular', 'TypeScript', 'REST API'],
      liveUrl: 'https://weather.johndoe.dev',
      imageUrl: 'https://images.twinkl.co.uk/tw1n/image/private/t_630/u/ux/spanish-weather_ver_3.jpg',
    },
  ];
}
