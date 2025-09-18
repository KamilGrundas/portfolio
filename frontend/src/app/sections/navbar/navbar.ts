import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export type NavbarData = {
  name: string;
};

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  data = input.required<NavbarData>();
  private readonly theme = inject(ThemeService);
  isDark = this.theme.isDark;
  toggleTheme(): void {
    this.theme.toggle();
  }
}
