import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      .app-container {
        background-color: var(--surface-ground);
      }

      :host {
        display: block;
        width: 100%;
        height: 100%;
        background-color: var(--surface-ground);
      }

      * {
        box-sizing: border-box;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  loginRoute: boolean = false;

  router = inject(Router);
  themeService = inject(ThemeService);

  ngOnInit(): void {
    // Initialize theme service
    this.themeService.initializeTheme();

    this.loginRoute = this.router.url.includes('login');

    this.router.events.subscribe(() => {
      this.loginRoute = this.router.url.includes('login');
    });
  }
}

