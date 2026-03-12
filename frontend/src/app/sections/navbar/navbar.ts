import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export type NavbarData = {
  name: string;
  sections: Array<{ id: string; label: string }>;
  canEdit?: boolean;
  editing?: boolean;
  saving?: boolean;
  isLoggedIn?: boolean;
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
  edit = output<void>();
  cancelEdit = output<void>();
  save = output<void>();
  logout = output<void>();
  private readonly theme = inject(ThemeService);
  isDark = this.theme.isDark;
  readonly isEditing = computed(() => Boolean(this.data().editing));

  toggleTheme(): void {
    this.theme.toggle();
  }
}
