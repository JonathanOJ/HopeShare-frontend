import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('light');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    // Theme will be initialized when initializeTheme() is called from app component
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Carregar dinamicamente o tema do PrimeNG
    this.loadPrimeNGTheme(theme);
  }

  private loadPrimeNGTheme(theme: Theme): void {
    const themeLink = document.getElementById('primeng-theme') as HTMLLinkElement;

    if (themeLink) {
      // Se já existe, apenas muda o href
      themeLink.href =
        theme === 'dark'
          ? 'https://unpkg.com/primeng@17/resources/themes/lara-dark-blue/theme.css'
          : 'https://unpkg.com/primeng@17/resources/themes/lara-light-blue/theme.css';
    } else {
      // Se não existe, cria o link element
      const link = document.createElement('link');
      link.id = 'primeng-theme';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href =
        theme === 'dark'
          ? 'https://unpkg.com/primeng@17/resources/themes/lara-dark-blue/theme.css'
          : 'https://unpkg.com/primeng@17/resources/themes/lara-light-blue/theme.css';

      document.head.appendChild(link);
    }
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  toggleTheme(): void {
    const newTheme = this.currentThemeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light'); // Default theme
    }
  }
}

