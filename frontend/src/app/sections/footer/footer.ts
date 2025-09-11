import { ChangeDetectionStrategy, Component } from '@angular/core';

type FooterLink = {
  label: string;
  url: string;
  external?: boolean;
};

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  year = new Date().getFullYear();

  links: FooterLink[] = [
    { label: 'GitHub', url: 'https://github.com/johndoe', external: true },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/johndoe', external: true },
    { label: 'Twitter', url: 'https://twitter.com/johndoe', external: true },
    { label: 'Contact', url: '#contact' },
  ];
}
