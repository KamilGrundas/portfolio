import { ChangeDetectionStrategy, Component } from '@angular/core';

type Certificate = {
  name: string;
  issuer: string;
  issued: string;          // e.g., "Sep 2024"
  credentialId?: string;   // optional credential ID
  verifyUrl?: string;      // optional verification link
};

@Component({
  selector: 'app-certificates',
  imports: [],
  templateUrl: './certificates.html',
  styleUrl: './certificates.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Certificates {
certificates: Certificate[] = [
    {
      name: 'Angular Developer Certificate',
      issuer: 'Acme Institute',
      issued: 'Sep 2024',
      credentialId: 'ANG-1234-5678',
      verifyUrl: 'https://verify.example.com/ANG-1234-5678',
    },
    {
      name: 'TypeScript Advanced',
      issuer: 'Tech Academy',
      issued: 'May 2023',
      // no verifyUrl provided
    },
  ];
}