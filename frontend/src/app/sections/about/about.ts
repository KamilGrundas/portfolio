import { ChangeDetectionStrategy, Component } from '@angular/core';

type AboutData = {
  heading: string;
  about: string;
  extra: string;
  image: string;
};

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class About {
  data: AboutData = {
    heading: 'About Me',
    about: "I'm John Doe, a frontend developer with a passion for building modern, performant, and user-friendly applications. I specialize in Angular and TypeScript, and I love working on projects that make a difference.",
    extra: "Beyond coding, I enjoy contributing to open source, writing technical articles, and mentoring new developers.",
    image: 'https://www.flexjobs.com/blog/wp-content/uploads/2020/04/20044602/Organize-Workspace.png?w=1024',
  };
}
