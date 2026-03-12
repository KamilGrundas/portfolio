import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'img[appHideBrokenImage]',
  standalone: true,
})
export class HideBrokenImageDirective {
  @HostBinding('style.display') display = '';

  @HostListener('error')
  onError(): void {
    this.display = 'none';
  }
}
