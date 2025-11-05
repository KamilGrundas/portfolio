import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserCertificate } from '../../types';

@Component({
  selector: 'app-certificates',
  imports: [MatIconModule],
  templateUrl: './certificates.html',
  styleUrl: './certificates.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Certificates {
  certificates = input.required<UserCertificate[]>();
}
