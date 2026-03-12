import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContactPublic } from '../../types';

@Component({
  selector: 'app-contact',
  imports: [MatIconModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  data = input.required<ContactPublic | null>();
}
