import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthUser, TipoUsuario } from '../../shared/models/auth';
import { AuthService } from '../../shared/services/auth.service';
import { Subject, takeUntil, take } from 'rxjs';
import { ValidacaoUsuario } from '../../shared/models/validacao-usuario';
import { LoadingService } from '../../shared/services/loading.service';
import { MessageConfirmationService } from '../../shared/services/message-confirmation.service';
import { ValidacaoUsuarioService } from '../../shared/services/validacao-usuario.service';
import { Recebimento } from '../../shared/models/recebimento.model';
import { ConfigRecebimentoService } from '../../shared/services/configRecebimento.service';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css'],
})
export class ConfiguracaoComponent implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  user: AuthUser | null = null;

  activeItem: MenuItem | undefined;
  loading: boolean = false;
  validacaoUsuario: ValidacaoUsuario | null = null;
  userIsCompany: boolean = false;
  recebimentoConfig: Recebimento | null = null;

  router = inject(Router);
  authService = inject(AuthService);
  validacaoUsuarioService = inject(ValidacaoUsuarioService);
  messageConfirmationService = inject(MessageConfirmationService);
  loadingService = inject(LoadingService);
  configRecebimentoService = inject(ConfigRecebimentoService);

  private destroy$ = new Subject();

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

    if (this.userIsCompany) {
      this.getValidacaoByUser();
      this.getRecebimentoConfig();
      this.getHistorico();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
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

  getValidacaoByUser(): void {
    if (!this.user) {
      return;
    }

    this.loading = true;

    this.loadingService.start();
    this.validacaoUsuarioService
      .getValidationByUserId(this.user.user_id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response) => {
          this.validacaoUsuario = response;
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Ocorreu um erro ao carregar a configuração.';
          this.messageConfirmationService.showError('Erro', errorMessage);
          this.validacaoUsuario = null;
        },
      })
      .add(() => {
        this.loading = false;
        this.loadingService.done();
      });
  }

  getRecebimentoConfig(): void {
    if (!this.user) {
      return;
    }

    this.loading = true;

    this.loadingService.start();
    this.configRecebimentoService
      .getConfigRecebimentoByUserId(this.user.user_id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (config) => {
          this.recebimentoConfig = config;
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Ocorreu um erro ao carregar a configuração.';
          this.messageConfirmationService.showError('Erro', errorMessage);
          this.recebimentoConfig = null;
        },
      })
      .add(() => {
        this.loading = false;
        this.loadingService.done();
      });
  }

  getHistorico(): void {}
}

