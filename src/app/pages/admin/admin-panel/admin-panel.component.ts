import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Recebimento } from '../../../shared/models/recebimento.model';
import { StatusValidacaoUsuario } from '../../../shared/enums/StatusValidacaoUsuario.enum';
import { StatusDenuncia } from '../../../shared/enums/StatusDenuncia.enum';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { Denuncia } from '../../../shared/models/denuncia.model';
import { SolicitacaoDeposito } from '../../../shared/models/solicitacao-deposito.model';
import { StatusSolicitacaoDeposito } from '../../../shared/enums/StatusSolicitacaoDeposito.enum';
import { StatusCampanha } from '../../../shared/enums/StatusCampanha.enum';
import { ValidacaoUsuario } from '../../../shared/models/validacao-usuario';
import { ValidacaoUsuarioService } from '../../../shared/services/validacao-usuario.service';
import { takeUntil, take, Subject } from 'rxjs';
import { AuthUser } from '../../../shared/models/auth';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  activeTab: 'validacoes' | 'denuncias' | 'depositos' = 'validacoes';

  validacoesPendentes: ValidacaoUsuario[] = [];
  denuncias: Denuncia[] = [];
  solicitacoes: SolicitacaoDeposito[] = [];

  loading = false;
  denunciasLoading = false;
  solicitacoesLoading = false;

  userSession: AuthUser | null = null;

  private messageConfirmationService = inject(MessageConfirmationService);
  private validacaoUsuarioService = inject(ValidacaoUsuarioService);
  private authService = inject(AuthService);

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

  // Métodos de carregamento de dados
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
    setTimeout(() => {
      this.denuncias = [
        {
          id: '1',
          reason: 'CONTEUDO_INADEQUADO',
          description: 'Campanha contém conteúdo ofensivo',
          status: StatusDenuncia.PENDING,
          created_at: new Date(),
          user_id: 'user1',
          campanha_id: 'camp1',
          campanha_title: 'Ajuda para medicamentos',
          user_name: 'João Silva',
        } as any,
        {
          id: '2',
          reason: 'INFORMACOES_FALSAS',
          description: 'Informações da campanha são falsas',
          status: StatusDenuncia.ANALYZED,
          created_at: new Date(),
          user_id: 'user2',
          campanha_id: 'camp2',
          campanha_title: 'Construção de escola',
          user_name: 'Maria Oliveira',
        } as any,
      ];
      this.denunciasLoading = false;
    }, 300);
  }

  loadSolicitacoes(): void {
    this.solicitacoesLoading = true;
    setTimeout(() => {
      this.solicitacoes = [
        {
          request_id: '1',
          status: StatusSolicitacaoDeposito.PENDING,
          request_message: 'Preciso do valor para comprar os medicamentos urgentemente.',
          created_at: new Date('2024-01-15'),
          campanha: {
            campanha_id: 'camp1',
            title: 'Ajuda para medicamentos',
            value_donated: 5200,
            status: StatusCampanha.ACTIVE,
          } as any,
          user: {
            user_id: 'user1',
            username: 'Maria Silva',
            email: 'maria@email.com',
          } as any,
        },
      ];
      this.solicitacoesLoading = false;
    }, 300);
  }

  // Métodos para mudança de abas
  changeTab(tab: 'validacoes' | 'denuncias' | 'depositos'): void {
    this.activeTab = tab;
  }
}

