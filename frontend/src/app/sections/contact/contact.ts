import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  user_contacts = {
    email: 'johndoe@example.com',
    phone: '+12 345 678 910',
    linkedin: 'https://www.linkedin.com/in/johndoe/',
    location: 'Warsaw, Poland',
  };
}
