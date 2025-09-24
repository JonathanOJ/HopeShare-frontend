import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthUser } from '../../models/auth';
import { AuthService } from '../../services/auth.service';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageConfirmationService } from '../../services/message-confirmation.service';
import { SuporteService } from '../../services/suporte.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  activeIndex: number = 0;
  userSession: AuthUser | null = null;
  actualTheme: 'light' | 'dark' = 'light';
  supportForm!: FormGroup;

  settings: MenuItem[] | undefined;
  visible: boolean = false;
  loading: boolean = false;

  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageConfirmationService = inject(MessageConfirmationService);
  private suporteService = inject(SuporteService);

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.settings = [
      {
        label: 'Configurações',
        items: [
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
              this.visible = true;
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

    this.userSession = this.auth.getAuthResponse() || null;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.activeIndex = this.getActiveIndex(event.urlAfterRedirects);
      });

    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initForm() {
    this.supportForm = this.fb.group({
      name: ['', Validators.required],
      message: ['', Validators.required],
      subject: ['', Validators.required],
    });
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
      case '/hopeshare/admin/denuncias':
        return this.userSession?.is_admin ? 4 : 0;
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
        if (this.userSession?.is_admin) {
          this.router.navigate([`hopeshare/admin/denuncias`]);
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

  sendSupportEmail() {
    if (!this.supportForm.valid) {
      this.supportForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.suporteService
      .sendEmailSupport(this.supportForm.value)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: () => {
          this.visible = false;
          this.supportForm.reset();
        },
        error: () => {
          this.messageConfirmationService.showError('Erro', 'Ocorreu um erro ao enviar e-mail!');
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  get name() {
    return this.supportForm.get('name');
  }

  get subject() {
    return this.supportForm.get('subject');
  }

  get message() {
    return this.supportForm.get('message');
  }
}

