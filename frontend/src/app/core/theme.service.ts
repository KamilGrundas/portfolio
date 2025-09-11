import { Injectable, effect, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    readonly theme = signal<Theme>(this.readInitial());
    readonly isDark = () => this.theme() === 'dark';

    constructor() {
        if (this.isBrowser) {
            effect(() => {
                const t = this.theme();
                document.documentElement.setAttribute('data-bs-theme', t);
                try { localStorage.setItem(STORAGE_KEY, t); } catch { }
            });
        }
    }

    setTheme(t: Theme): void {
        this.theme.set(t);
    }

    toggle(): void {
        this.theme.set(this.isDark() ? 'light' : 'dark');
    }

    private readInitial(): Theme {
        if (!this.isBrowser) return 'light';

        try {
            const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
            if (saved === 'light' || saved === 'dark') return saved;
        } catch { }

        const prefersDark = typeof window !== 'undefined'
            && typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-color-scheme: dark)').matches;

        return prefersDark ? 'dark' : 'light';
    }
}
