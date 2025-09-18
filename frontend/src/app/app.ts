import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  private scroller = inject(ViewportScroller);

  constructor() {
    this.scroller.setOffset(() => {
      const nav = document.querySelector('.glass-nav') as HTMLElement | null;
      return [0, (nav?.offsetHeight ?? 0) + 8];
    });
  }
}
