import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthUser } from '../../models/auth';
import { AuthService } from '../../services/auth.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { SupportDialogService } from '../../services/support-dialog.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  activeIndex: number = 0;
  userSession: AuthUser | null = null;
  currentTheme: Theme = 'light';

  settings: MenuItem[] | undefined;

  private auth = inject(AuthService);
  private router = inject(Router);
  private supportDialogService = inject(SupportDialogService);
  public themeService = inject(ThemeService);

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.themeService.currentTheme$.pipe(takeUntil(this.destroy$)).subscribe((theme) => {
      this.currentTheme = theme;
      this.updateSettingsMenu();
    });

    this.updateSettingsMenu();
    this.getUserSessionAndSetupRouter();
  }

  private updateSettingsMenu(): void {
    this.settings = [
      {
        label: 'Configurações',
        items: [
          {
            label: this.currentTheme === 'light' ? 'Modo Escuro' : 'Modo Claro',
            icon: 'pi pi-palette',
            command: () => {
              this.themeService.toggleTheme();
            },
          },
          {
            label: 'Histórico',
            icon: 'pi pi-history',
            command: () => {
              this.redirectTo('hopeshare/configuracao/historico');
            },
          },
          {
            label: 'Suporte',
            icon: 'pi pi-envelope',
            command: () => {
              this.supportDialogService.open();
            },
          },
          {
            label: 'Configurações',
            icon: 'pi pi-cog',
            command: () => {
              this.redirectTo('hopeshare/configuracao');
            },
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              this.logout();
            },
          },
        ],
      },
    ];
  }

  private getUserSessionAndSetupRouter(): void {
    this.userSession = this.auth.getAuthResponse() || null;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.activeIndex = this.getActiveIndex(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getActiveIndex(url: string): number {
    switch (url) {
      case '/hopeshare/home':
        return 0;
      case '/hopeshare/campanha/listagem':
      case '/hopeshare/campanha/cadastro':
        return 1;
      case '/hopeshare/dashboard':
        return 2;
      case '/hopeshare/relatorio/listagem':
      case '/hopeshare/relatorio/solicitar':
        return 3;
      case '/hopeshare/configuracao':
        return 4;
      case '/hopeshare/admin':
        return this.userSession?.admin ? 5 : 0;
      default:
        return 0;
    }
  }

  tabChange() {
    switch (this.activeIndex) {
      case 0:
        this.router.navigate([`hopeshare/home`]);
        break;
      case 1:
        this.router.navigate([`hopeshare/campanha/listagem`]);
        break;
      case 2:
        this.router.navigate([`hopeshare/dashboard`]);
        break;
      case 3:
        this.router.navigate([`hopeshare/relatorio/listagem`]);
        break;
      case 4:
        this.router.navigate([`hopeshare/configuracao`]);
        break;
      case 5:
        if (this.userSession?.admin) {
          this.router.navigate([`hopeshare/admin`]);
        }
        break;
    }
  }

  logout() {
    this.auth.logout();
  }

  redirectTo(route: string) {
    this.router.navigate([`${route}`]);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

