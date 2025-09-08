import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Overview } from './sections/overview/overview';
import { Navbar } from './sections/navbar/navbar';
import { About } from './sections/about/about';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Overview, Navbar, About],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
