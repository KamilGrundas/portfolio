import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Overview } from './sections/overview/overview';
import { Navbar } from './sections/navbar/navbar';
import { About } from './sections/about/about';
import { Skills } from './sections/skills/skills';
import { Experience } from './sections/experience/experience';
import { Education } from './sections/education/education';
import { Certificates } from './sections/certificates/certificates';
import { Contact } from './sections/contact/contact';
import { Footer } from './sections/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Overview, Navbar, About, Skills, Experience, Education, Certificates, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
