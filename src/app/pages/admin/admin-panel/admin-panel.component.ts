import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { StatusDenuncia } from '../../../shared/enums/StatusDenuncia.enum';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { Denuncia } from '../../../shared/models/denuncia.model';
import { SolicitacaoDeposito } from '../../../shared/models/solicitacao-deposito.model';
import { ValidacaoUsuario } from '../../../shared/models/validacao-usuario';
import { ValidacaoUsuarioService } from '../../../shared/services/validacao-usuario.service';
import { takeUntil, take, Subject } from 'rxjs';
import { AuthUser } from '../../../shared/models/auth';
import { AuthService } from '../../../shared/services/auth.service';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { DenunciaCampanhaGrouped } from '../../../shared/models/campanha.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  activeTab: 'validacoes' | 'denuncias' | 'depositos' = 'validacoes';

  validacoesPendentes: ValidacaoUsuario[] = [];
  denunciasGrouped: DenunciaCampanhaGrouped[] = [];
  solicitacoes: SolicitacaoDeposito[] = [];

  loading = false;
  denunciasLoading = false;
  solicitacoesLoading = false;

  userSession: AuthUser | null = null;

  private messageConfirmationService = inject(MessageConfirmationService);
  private validacaoUsuarioService = inject(ValidacaoUsuarioService);
  private authService = inject(AuthService);
  private campanhaService = inject(CampanhaService);

  private destroy$ = new Subject();

  ngOnInit(): void {
    this.userSession = this.authService.getAuthResponse();

    this.loadValidacoesPendentes();
    this.loadDenuncias();
    this.loadSolicitacoes();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  loadValidacoesPendentes(): void {
    this.loading = true;
    this.validacaoUsuarioService
      .getValidacoesPendentes(this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response: ValidacaoUsuario[]) => {
          this.validacoesPendentes = response;
        },
        error: (error: any) => {
          const errorMessage = error?.error?.message || 'Ocorreu um erro ao carregar as validações.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  loadDenuncias(): void {
    this.denunciasLoading = true;
    this.campanhaService
      .getDenunciasGrouped(this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response: DenunciaCampanhaGrouped[]) => {
          this.denunciasGrouped = response;
        },
        error: (error: any) => {
          const errorMessage = error?.error?.message || 'Ocorreu um erro ao carregar as denúncias.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
        complete: () => {
          this.denunciasLoading = false;
        },
      });
  }

  loadSolicitacoes(): void {
    this.solicitacoesLoading = true;

    this.campanhaService
      .getSolicitacoesDeposito(this.userSession!.user_id)
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe({
        next: (response: SolicitacaoDeposito[]) => {
          this.solicitacoes = response;
        },
        error: (error: any) => {
          const errorMessage = error?.error?.message || 'Ocorreu um erro ao carregar as solicitações.';
          this.messageConfirmationService.showError('Erro', errorMessage);
        },
        complete: () => {
          this.solicitacoesLoading = false;
        },
      });
  }

  // Métodos para mudança de abas
  changeTab(tab: 'validacoes' | 'denuncias' | 'depositos'): void {
    this.activeTab = tab;
  }
}

