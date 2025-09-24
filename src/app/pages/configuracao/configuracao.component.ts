import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthUser, TipoUsuario } from '../../shared/models/auth';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css'],
})
export class ConfiguracaoComponent implements OnInit {
  items: MenuItem[] | undefined;
  user: AuthUser | null = null;

  activeItem: MenuItem | undefined;

  userIsCompany: boolean = false;

  router = inject(Router);
  authService = inject(AuthService);

  ngOnInit() {
    this.user = this.authService.getAuthResponse();

    this.userIsCompany = this.user?.type_user === TipoUsuario.EMPRESA;

    this.items = [
      { label: 'Conta Bancária', icon: 'pi pi-wallet' },
      { label: 'Documentos', icon: 'pi pi-file' },
      { label: 'Histórico', icon: 'pi pi-history' },
    ];

    if (!this.userIsCompany) {
      this.items = this.items.filter((item) => item.label !== 'Conta Bancária' && item.label !== 'Documentos');
    }

    const currentRoute = this.router.url.split('/').pop();

    this.activeItem = this.items[this.getActiveIndex(currentRoute)];
  }

  getActiveIndex(currentRoute: string | undefined): number {
    switch (currentRoute) {
      case 'recebimento':
        return 0;
      case 'documentos':
        return 1;
      case 'historico':
        return this.userIsCompany ? 2 : 0;
      default:
        return 0;
    }
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }
}

